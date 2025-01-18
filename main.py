import http.server
import os
import socketserver
import webbrowser
from uuid import uuid4
from sys import argv
from hjson import dumpJSON
from lxml import html
from requests import get
from collections import defaultdict
from re import compile
from structure import *

# 标志是否完成
is_finished = False

# 当前页码
current_page = 1
# 优惠券状态类型
coupon_use_status_list = ["yes", "no", "expiration", "all"]

# GET请求的Cookies
cookies = {
    "PRO_NEW_SID": argv[1]  # 会话ID Cookie
}


# 获取列表中单个元素的函数
def get_single_element(elements: list) -> html.HtmlElement:
    if len(elements) == 1:
        return elements[0]
    else:
        raise ValueError(f"无法找到唯一元素，现有{len(elements)}个元素")


# 打印清理后的文本的函数
def print_cleaned_text(text: str) -> str:
    cleaned_text = text.replace("\n", "").replace("\t", "").replace(" ", "")
    print(cleaned_text)
    return cleaned_text


def get_raw_data(coupon_use_status):
    global is_finished, current_page
    coupon_list = []
    is_finished = False
    current_page = 1
    while not is_finished:
        print("页码: ", current_page)
        print("~" * 50)
        response = get("https://activity.szlcsc.com/member/couponList.html",
                       params={"currentPage": current_page, "couponUseStatus": coupon_use_status}, cookies=cookies)
        html_content = response.text

        root_element = html.fromstring(html_content)

        # 包含优惠券摘要的元素
        coupon_summary_elements = root_element.xpath(".//div[@class='yhj_sm']")

        # 包含优惠券详细信息的元素
        coupon_detail_elements = root_element.xpath(".//ul[@class='yhj_xm_wrap']")

        # 当前页找到的优惠券数量
        num_coupons = len(coupon_summary_elements)

        # 如果优惠券数量不是8，标记为完成
        if num_coupons != 8:
            is_finished = True

        for index in range(num_coupons):
            coupon_summary = coupon_summary_elements[index]
            # 包含优惠价信息的元素
            discount_elements = coupon_summary.xpath(".//span[not(@*)] | .//span[@class='express-free']")
            discount = print_cleaned_text(get_single_element(discount_elements).text)
            discount = "9" if discount == "包邮券" else discount
            # 包含优惠券名称的元素
            name_elements = coupon_summary.xpath(".//span[contains(@class, 'yhjmingchen')]")
            name = print_cleaned_text(get_single_element(name_elements).text)

            coupon_detail = coupon_detail_elements[index]

            # 包含优惠券标题的元素
            title_elements = coupon_detail.xpath(".//li[@title]")
            title = print_cleaned_text(get_single_element(title_elements).get("title"))

            # 包含优惠券时间的元素
            time_elements = coupon_detail.xpath(".//li[not(@title) and contains(@class, 'color-blue-light')]")
            time = print_cleaned_text(get_single_element(time_elements).text)

            # 指示优惠券门槛的元素
            threshold_elements = coupon_detail.xpath(".//span[@class='canUse']")
            threshold = print_cleaned_text(get_single_element(threshold_elements).text)

            # 创建优惠券对象并添加到列表
            coupon = Coupon(discount, name, title, time, threshold)
            coupon_dict = coupon.__dict__
            coupon_dict['uuid'] = str(uuid4())  # 生成并添加UUID
            coupon_list.append(coupon_dict)
            print("~" * 50)

        # 增加当前页码
        current_page += 1
    return coupon_list


def analyze_coupons(coupon_list):
    total_coupons = len(coupon_list)
    total_discount = sum(float(coupon['discount']) for coupon in coupon_list)

    brands = []
    brand_dict = defaultdict(lambda: {"count": 0, "uuids": []})
    for coupon in coupon_list:
        if "品牌推广活动" in coupon['title']:
            brand_name = coupon['name'].split('元')[1].split('品牌')[0]
            brand_dict[brand_name]["count"] += 1
            brand_dict[brand_name]["uuids"].append(coupon['uuid'])
    for brand, data in brand_dict.items():
        brands.append(Brand(brand, data["count"], data["uuids"]))

    monthly_expiry_counts = []
    monthly_expiry_dict = defaultdict(int)
    expiry_date_pattern = compile(r"有效期：\d{4}-\d{2}-\d{2}-(\d{4}-\d{2}-\d{2})")
    for coupon in coupon_list:
        match = expiry_date_pattern.search(coupon['time'])
        if match:
            expiry_date = match.group(1)
            month = expiry_date[:7]
            monthly_expiry_dict[month] += 1
    for month, count in monthly_expiry_dict.items():
        monthly_expiry_counts.append(MonthlyExpiry(month, count))

    threshold_stages = []
    threshold_stage_dict = {
        "0-15": 0,
        "15-30": 0,
        "30+": 0
    }
    threshold_pattern = compile(r"满(\d+(\.\d+)?)元可用")
    for coupon in coupon_list:
        match = threshold_pattern.search(coupon['threshold'])
        if match:
            threshold_value = float(match.group(1))
            if threshold_value <= 15:
                threshold_stage_dict["0-15"] += 1
            elif threshold_value <= 30:
                threshold_stage_dict["15-30"] += 1
            else:
                threshold_stage_dict["30+"] += 1
    for stage, count in threshold_stage_dict.items():
        threshold_stages.append(ThresholdStage(stage, count))

    free_shipping_count = 0
    free_shipping_uuids = []
    free_shipping_total_discount = 0.0
    free_shipping_monthly_counts = defaultdict(int)
    for coupon in coupon_list:
        if "免邮活动" in coupon['title']:
            free_shipping_count += 1
            free_shipping_uuids.append(coupon['uuid'])
            free_shipping_total_discount += float(coupon['discount'])
            match = expiry_date_pattern.search(coupon['time'])
            if match:
                expiry_date = match.group(1)
                month = expiry_date[:7]
                free_shipping_monthly_counts[month] += 1
    free_shipping = FreeShipping(free_shipping_count, free_shipping_uuids, free_shipping_total_discount,
                                 dict(free_shipping_monthly_counts))

    print(f"优惠券总数: {total_coupons}")
    print(f"总折扣金额: {total_discount}元")
    print("品牌统计:", [brand.__dict__ for brand in brands])
    print("每月到期统计:", [expiry.__dict__ for expiry in monthly_expiry_counts])
    print("门槛阶段:", [stage.__dict__ for stage in threshold_stages])
    print(f"免邮活动数量: {free_shipping.count}")
    print(f"免邮活动UUIDs: {free_shipping.uuids}")
    print(f"免邮活动总折扣: {free_shipping.total_discount}元")
    print("免邮活动每月统计:", dict(free_shipping_monthly_counts))

    return {
        "total_coupons": total_coupons,
        "total_discount": total_discount,
        "brands": [brand.__dict__ for brand in brands],
        "monthly_expiry_counts": [expiry.__dict__ for expiry in monthly_expiry_counts],
        "threshold_stages": [stage.__dict__ for stage in threshold_stages],
        "free_shipping": free_shipping.__dict__
    }
def open_analysis_file():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    httpd = socketserver.TCPServer(("", 8000), http.server.SimpleHTTPRequestHandler)

    # Open the index.html file in the default web browser
    webbrowser.open(f"http://localhost:8000/index.html")
    httpd.serve_forever()

if __name__ == '__main__':
    coupon_use_status_list.remove("all")
    for status in coupon_use_status_list:
        coupons = get_raw_data(status)
        # 保存原始优惠券数据
        raw_data_filename = f'coupons_raw_data_{status}.json'
        with open(raw_data_filename, 'w', encoding='utf-8') as f:
            dumpJSON(coupons, f, ensure_ascii=False, indent=4)

        # 分析优惠券数据
        analysis = analyze_coupons(coupons)
        analysis_filename = f'coupons_analysis_{status}.json'
        with open(analysis_filename, 'w', encoding='utf-8') as f:
            dumpJSON(analysis, f, ensure_ascii=False, indent=4)
        print(f"状态'{status}'的分析结果:", analysis)
        print("~" * 50)

    open_analysis_file()