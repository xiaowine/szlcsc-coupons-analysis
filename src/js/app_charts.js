let currentCharts = {};

const chartColors = {
  backgroundColor: [
    "rgba(48, 63, 159, 0.2)", // 主色调
    "rgba(255, 64, 129, 0.2)", // 强调色
    "rgba(0, 150, 136, 0.2)", // 绿色
    "rgba(255, 152, 0, 0.2)", // 橙色
  ],
  borderColor: [
    "rgba(48, 63, 159, 1)", // 主色调
    "rgba(255, 64, 129, 1)", // 强调色
    "rgba(0, 150, 136, 1)", // 绿色
    "rgba(255, 152, 0, 1)", // 橙色
  ],
};

const chartTitles = {
  yes: {
    brand: "已使用优惠券品牌分布",
    expiry: "已使用优惠券到期时间",
    threshold: "已使用优惠券门槛分布",
    summary: "已使用优惠券统计",
    freeShipping: "已使用免邮券月度统计",
  },
  no: {
    brand: "未使用优惠券品牌分布",
    expiry: "未使用优惠券到期时间",
    threshold: "未使用优惠券门槛分布",
    summary: "未使用优惠券统计",
    freeShipping: "未使用免邮券月度统计",
  },
  expiration: {
    brand: "已过期优惠券品牌分布",
    expiry: "已过期优惠券到期时间",
    threshold: "已过期优惠券门槛分布",
    summary: "已过期优惠券统计",
    freeShipping: "已过期免邮券月度统计",
  },
};

let currentState = "yes";
let rawCouponData = null;

// 在初始化时加载原始数据
function loadRawData() {
  return fetch("/data/coupons_raw_data_yes.json")
    .then((response) => response.json())
    .then((data) => {
      rawCouponData = data;
    });
}

function findCouponsByUuids(uuids) {
  return uuids
    .map((uuid) => rawCouponData.find((coupon) => coupon.uuid === uuid))
    .filter((coupon) => coupon !== undefined);
}

function showCouponModal(coupons, title) {
  const modal = document.getElementById("couponModal");
  const modalTitle = document.getElementById("modalTitle");
  const couponList = document.getElementById("couponList");

  modalTitle.textContent = title;
  couponList.innerHTML = coupons
    .map(
      (coupon) => `
        <div class="coupon-item">
            <div><strong>名称:</strong> ${coupon.name}</div>
            <div><strong>活动:</strong> ${coupon.title}</div>
            <div><strong>时间:</strong> ${coupon.time}</div>
            <div><strong>门槛:</strong> ${coupon.threshold}</div>
            <div><strong>折扣:</strong> ¥${coupon.discount}</div>
        </div>
    `
    )
    .join("");

  modal.style.display = "block";
}

function updateCharts(data, state) {
  currentState = state;
  // 清除现有图表
  Object.values(currentCharts).forEach((chart) => chart.destroy());

  // Brand Chart
  const brandLabels = data.brands.map((brand) => brand.name);
  const brandCounts = data.brands.map((brand) => brand.count);
  const brandChartCtx = document.getElementById("brandChart").getContext("2d");
  currentCharts.brandChart = new Chart(brandChartCtx, {
    type: "bar",
    data: {
      labels: brandLabels,
      datasets: [
        {
          label: "优惠券数量",
          data: brandCounts,
          backgroundColor: chartColors.backgroundColor[0],
          borderColor: chartColors.borderColor[0],
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "折扣金额",
          data: data.brands.map((brand) => brand.total_discount),
          backgroundColor: chartColors.backgroundColor[1],
          borderColor: chartColors.borderColor[1],
          borderWidth: 1,
          type: "line",
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          type: "linear",
          position: "left",
          ticks: {
            stepSize: 1,
            precision: 0,
          },
          title: {
            display: true,
            text: "优惠券数量",
          },
        },
        y1: {
          beginAtZero: true,
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "折扣金额 (¥)",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: chartTitles[state].brand,
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          const brand = data.brands[idx];
          const coupons = findCouponsByUuids(brand.uuids);
          showCouponModal(
            coupons,
            `${brand.name} 品牌优惠券列表 (折扣总额: ¥${brand.total_discount})`
          );
        }
      },
    },
  });

  // Monthly Expiry Chart
  const expiryLabels = data.monthly_expiry_counts.map((expiry) => expiry.month);
  const expiryCounts = data.monthly_expiry_counts.map((expiry) => expiry.count);
  const expiryChartCtx = document
    .getElementById("expiryChart")
    .getContext("2d");
  currentCharts.expiryChart = new Chart(expiryChartCtx, {
    type: "line",
    data: {
      labels: expiryLabels,
      datasets: [
        {
          label: "每月优惠券数量",
          data: expiryCounts,
          backgroundColor: chartColors.backgroundColor[0],
          borderColor: chartColors.borderColor[0],
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "每月折扣金额",
          data: data.monthly_expiry_counts.map((month) => month.total_discount),
          backgroundColor: chartColors.backgroundColor[1],
          borderColor: chartColors.borderColor[1],
          borderWidth: 1,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          position: "left",
          title: {
            display: true,
            text: "优惠券数量",
          },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          title: {
            display: true,
            text: "折扣金额 (¥)",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: chartTitles[state].expiry,
        },
      },
    },
  });

  // Threshold Stage Chart
  const thresholdLabels = data.threshold_stages.map((stage) => stage.stage);
  const thresholdCounts = data.threshold_stages.map((stage) => stage.count);
  const thresholdChartCtx = document
    .getElementById("thresholdChart")
    .getContext("2d");
  const thresholdDatasets = {
    labels: thresholdLabels,
    datasets: [
      {
        label: "门槛分布",
        data: thresholdCounts,
        backgroundColor: chartColors.backgroundColor.slice(0, 3),
        borderColor: chartColors.borderColor.slice(0, 3),
        borderWidth: 1,
      },
    ],
  };
  currentCharts.thresholdChart = new Chart(thresholdChartCtx, {
    type: "pie",
    data: thresholdDatasets,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: chartTitles[state].threshold,
          padding: {
            top: 10,
            bottom: 30,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const stage = data.threshold_stages[context.dataIndex];
              return [
                `数量: ${stage.count}`,
                `折扣金额: ¥${stage.total_discount}`,
              ];
            },
          },
        },
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
          },
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          const stage = data.threshold_stages[idx];
          const coupons = findCouponsByUuids(stage.uuids);
          showCouponModal(coupons, `${stage.stage} 区间优惠券列表`);
        }
      },
    },
  });

  // Summary Chart
  const summaryData = [data.total_coupons, data.free_shipping.count];
  const summaryChartCtx = document
    .getElementById("summaryChart")
    .getContext("2d");
  currentCharts.summaryChart = new Chart(summaryChartCtx, {
    type: "bar",
    data: {
      labels: ["总计", "免邮"],
      datasets: [
        {
          label: "优惠券数量",
          data: summaryData,
          backgroundColor: [
            chartColors.backgroundColor[0],
            chartColors.backgroundColor[3],
          ],
          borderColor: [chartColors.borderColor[0], chartColors.borderColor[3]],
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "优惠金额",
          data: [data.total_discount, data.free_shipping.total_discount],
          backgroundColor: [
            chartColors.backgroundColor[1],
            chartColors.backgroundColor[2],
          ],
          borderColor: [chartColors.borderColor[1], chartColors.borderColor[2]],
          borderWidth: 1,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "优惠券数量",
          },
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
        y1: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "优惠金额 (¥)",
          },
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || "";
              if (context.dataset.label === "优惠券数量") {
                return `${label}: ${context.raw}张`;
              } else {
                return `${label}: ¥${context.raw}`;
              }
            },
          },
        },
        title: {
          display: true,
          text: [
            chartTitles[state].summary,
            `总优惠金额: ¥${data.total_discount}`,
          ],
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const idx = elements[0].index;
          if (idx === 0) {
            // 点击总优惠券
            const allUuids = data.monthly_expiry_counts.flatMap(
              (month) => month.uuids
            );
            const coupons = findCouponsByUuids(allUuids);
            showCouponModal(
              coupons,
              `全部优惠券列表 (总折扣: ¥${data.total_discount})`
            );
          } else if (idx === 1) {
            // 点击免邮优惠券
            const coupons = findCouponsByUuids(data.free_shipping.uuids);
            showCouponModal(
              coupons,
              `免邮优惠券列表 (总折扣: ¥${data.free_shipping.total_discount})`
            );
          }
        }
      },
    },
  });

  // Free Shipping Monthly Chart - 新增
  const monthlyLabels = Object.keys(data.free_shipping.monthly_counts);
  const monthlyCounts = Object.values(data.free_shipping.monthly_counts);
  const freeShippingMonthlyChartCtx = document
    .getElementById("freeShippingMonthlyChart")
    .getContext("2d");
  currentCharts.freeShippingMonthlyChart = new Chart(
    freeShippingMonthlyChartCtx,
    {
      type: "bar",
      data: {
        labels: monthlyLabels,
        datasets: [
          {
            label: "每月免邮券数量",
            data: monthlyCounts,
            backgroundColor: chartColors.backgroundColor[1],
            borderColor: chartColors.borderColor[1],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: chartTitles[state].freeShipping,
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            const month = monthlyLabels[idx];
            const monthData = Object.entries(
              data.free_shipping.monthly_counts
            ).find(([key]) => key === month);
            if (monthData) {
              // 从free_shipping.uuids中筛选该月份的优惠券
              const monthCoupons = data.free_shipping.uuids
                .map((uuid) =>
                  rawCouponData.find((coupon) => {
                    return coupon.uuid === uuid && coupon.time.includes(month);
                  })
                )
                .filter((coupon) => coupon !== undefined);
              showCouponModal(monthCoupons, `${month} 免邮优惠券列表`);
            }
          }
        },
      },
    }
  );
}

function loadData(fileType) {
  fetch(`/data/coupons_analysis_${fileType}.json`)
    .then((response) => response.json())
    .then((data) => {
      updateCharts(data, fileType);
      updateButtonStatus(fileType);
    })
    .catch((error) => console.error("Error loading data:", error));
}

function updateButtonStatus(fileType) {
  document.querySelectorAll(".switch-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.file === fileType) {
      btn.classList.add("active");
    }
  });
  console.log("Button status updated");
}

// 初始化事件监听
document.addEventListener("DOMContentLoaded", function () {
  // 添加按钮点击事件
  document.querySelectorAll(".switch-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      loadData(e.target.dataset.file);
    });
  });
  // 加载用户ID
  fetch("../data/user_id.txt")
    .then((response) => response.text())
    .then((userId) => {
      document.getElementById("userId").textContent = userId.trim();
    })
    .catch((error) => {
      console.error("Error loading user ID:", error);
      document.getElementById("userId").textContent = "未知用户";
    });
  // 初始加载
  loadData("yes");

  // 模态窗关闭按钮事件
  document.querySelector(".close-modal").addEventListener("click", function () {
    document.getElementById("couponModal").style.display = "none";
  });

  // 点击模态窗外部关闭
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("couponModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // 加载原始数据
  loadRawData().then(() => loadData("yes"));

  console.log("App loaded");
});
