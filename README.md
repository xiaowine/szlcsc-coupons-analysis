## ![](https://socialify.git.ci/xiaowine/szlcsc-coupons-analysis/image?description=1&descriptionEditable=%E7%AB%8B%E5%88%9B%E5%95%86%E5%9F%8E%E5%8E%86%E5%8F%B2%E4%BC%98%E6%83%A0%E5%88%B8%E5%88%86%E6%9E%90&language=1&name=1&owner=1&theme=Auto)

<div align="center">

# 🛍️ 立创商城优惠券分析工具

[![GitHub license](https://img.shields.io/github/license/xiaowine/szlcsc-coupons-analysis)](https://github.com/xiaowine/szlcsc-coupons-analysis/blob/main/LICENSE)
[![Python Version](https://img.shields.io/badge/Python-3.6%2B-blue)](https://www.python.org/)
[![GitHub stars](https://img.shields.io/github/stars/xiaowine/szlcsc-coupons-analysis)](https://github.com/xiaowine/szlcsc-coupons-analysis/stargazers)

_一款简单易用的立创商城优惠券数据分析工具_

</div>

---

## ✨ 功能特点

- 🔄 **多状态分析**：已使用、未使用、已过期优惠券的完整分析
- 🏢 **品牌分布**：各品牌优惠券数量和折扣金额的可视化展示
- 📅 **时间分析**：优惠券到期时间分布趋势图
- 💰 **门槛分析**：优惠券使用门槛的区间分布
- 📦 **免邮分析**：免邮券使用情况的月度统计
- 🔍 **详情查看**：支持点击图表查看优惠券详细信息

## 🚀 快速开始

### 1️⃣ 环境配置

```bash
# 安装必需的依赖包
pip install -r requirements.txt
```

### 2️⃣ 运行分析

```bash
# 使用您的Cookies运行分析器
python main.py <Your-PRO_NEW_SID>

# 示例
python main.py xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 📝 使用指南

### 获取 Cookies

1. 使用 Chrome/Edge 浏览器登录[立创商城](https://www.szlcsc.com)
2. 按 `F12` 打开开发者工具
3. 切换到 `应用程序(Application)` 标签页
4. 在左侧导航栏中找到 `Cookies` → `https://www.szlcsc.com`
5. 找到并复制 `PRO_NEW_SID` 的值

> ⚠️ **注意**：PRO_NEW_SID 是一个 128 位的 UUID，形如：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 查看分析结果

- 脚本运行完成后会自动打开浏览器显示分析界面
- 如未自动打开，请手动访问：`http://localhost:8000/src/index.html`

#### 界面功能

| 功能   | 说明                |
|------|-------------------|
| 状态切换 | 顶部按钮可切换不同状态的优惠券数据 |
| 总体统计 | 显示优惠券总数和优惠总额      |
| 品牌分析 | 展示各品牌优惠券使用情况      |
| 时间分析 | 显示优惠券到期时间分布       |
| 详情查看 | 点击图表元素可查看详细信息     |

## ⚠️ 重要提示

- 请妥善保管您的 Cookies，切勿泄露
- 建议定期更新数据以获取最新统计
- 推荐使用现代浏览器访问分析界面

## 🔧 技术栈

- **后端**：Python
- **前端**：HTML5 / CSS3 / JavaScript
- **可视化**：Chart.js
- **服务器**：Python SimpleHTTPServer

## 📊 项目统计

[![Star History Chart](https://api.star-history.com/svg?repos=xiaowine/szlcsc-coupons-analysis&type=Timeline)](https://star-history.com/#xiaowine/szlcsc-coupons-analysis&Timeline)

## 📄 开源协议

[MIT License](LICENSE)
