## ![](https://socialify.git.ci/xiaowine/szlcsc-coupons-analysis/image?description=1&descriptionEditable=%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E5%8E%86%E5%8F%B2%E4%BC%98%E6%83%A0%E5%88%B8%E5%88%86%E6%9E%90&language=1&name=1&owner=1&theme=Auto)

# 立创商城优惠券分析工具

## 📊 功能特点

- 🔄 多状态分析：已使用、未使用、已过期优惠券
- 🏢 品牌分布：各品牌优惠券数量和折扣金额统计
- 📅 时间分析：优惠券到期时间分布
- 💰 门槛分析：优惠券使用门槛分布
- 📦 免邮分析：免邮券使用情况月度统计
- 🔍 详细信息：支持点击查看优惠券详情

## 🚀 快速开始

### 环境配置

```bash
# 安装依赖
pip install -r requirements.txt
```

### 运行分析

```bash
# 使用您的Cookies运行分析
python main.py [Your-Cookies]
# 示例：python main.py `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
# 数据获取完成后，将自动打开浏览器展示分析界面
# 如果为自动打开，请手动打开浏览器访问 http://localhost:8000/src/index.html
```

## 📝 使用说明

### 获取 Cookies

1. 使用 Chrome/Edge 浏览器登录立创商城
2. 按 `F12` 打开开发者工具
3. 切换到 `应用程序(Application)` 标签
4. 左侧导航栏选择 `Cookies` → `https://www.szlcsc.com`
5. 找到并复制 `PRO_NEW_SID` 的值
6. `PRO_NEW_SID` 的值是128位的UUID，类似 `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 数据分析界面

- 切换状态：顶部按钮切换不同状态的优惠券
- 查看详情：点击图表可查看详细优惠券信息
- 图表说明：
  - 总览：优惠券总数和优惠总额
  - 品牌：各品牌优惠券分布
  - 时间：到期时间分布趋势
  - 门槛：使用门槛区间分布
  - 免邮：免邮券月度使用情况

## ⚠️ 注意事项

- Cookies 安全：请勿泄露您的 Cookies，它相当于您的登录凭证
- 数据更新：每次运行脚本都会重新获取最新数据
- 浏览器支持：建议使用现代浏览器访问分析界面

## 📖 技术栈

- Python：数据获取与处理
- Chart.js：数据可视化
- HTML5/CSS3：界面布局
- JavaScript：交互功能

## 📄 开源协议

MIT License
