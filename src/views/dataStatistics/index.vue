<template>
  <div class="main">
    <n-grid x-gap="12" y-gap="12" :cols="4">
      <n-gi>
        <div class="countExhibit">
          <h3>设备总数</h3>
          <div class="countData">{{ originData.deviceCount }} 台</div>
        </div>
      </n-gi>
      <n-gi>
        <div class="countExhibit">
          <h3>今日上线数量</h3>
          <div class="countData">{{ originData.deviceOnlineCountToDay }} 台</div>
        </div>
      </n-gi>
      <n-gi>
        <div class="countExhibit">
          <h3>当前在线数量</h3>
          <div class="countData">{{ originData.deviceOnlineCountNow }} 台</div>
        </div>
      </n-gi>
      <n-gi>
        <div class="countExhibit">
          <h3>昨日里程</h3>
          <div class="countData">{{ originData.mileageYesterDay }} km</div>
        </div>
      </n-gi>
      <n-gi :span="2">
        <chart id="deviceTrailSevenDay" class="chartExhibit" :option="sevenDayTrailOption" v-if="sevenDayTrailOption != null"></chart>
      </n-gi>
      <n-gi :span="2">
        <chart id="deviceMileageSevenDay" class="chartExhibit" :option="sevenDayMileageOption" v-if="sevenDayMileageOption != null"></chart>
      </n-gi>
      <n-gi :span="2">
        <chart id="deviceTrailMonth" class="chartExhibit" :option="trailMonthOption" v-if="trailMonthOption != null"></chart>
      </n-gi>
      <n-gi :span="2">
        <chart id="deviceMileageMonth" class="chartExhibit" :option="mileageMonthOption" v-if="mileageMonthOption != null"></chart>
      </n-gi>
      <n-gi :span="4">
        <chart id="deviceMileageMonthTop" class="chartExhibit chartExhibitTop5" :option="mileageMonthTopOption" v-if="mileageMonthTopOption != null"></chart>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import chart from "./chart.vue";
import { getAdminStatistics } from "@/api/dataStatistics";

let originData = ref<any>({});
let sevenDayTrailOption = ref<any>(null);
let sevenDayMileageOption = ref<any>(null);
let trailMonthOption = ref<any>(null);
let mileageMonthOption = ref<any>(null);
let mileageMonthTopOption = ref<any>(null);

onMounted(() => {
  getStatisticsData();
});

/**获取后台统计数据 */
const getStatisticsData = () => {
  getAdminStatistics().then((res) => {
    if (res.State == 1) {
      console.log(res.Data);
      originData.value = Object.assign({}, res.Data);
      //  近七天轨迹点
      initSevenDayTrailChart(res.Data);
      //  近七天里程
      initSevenDayMileageChart(res.Data);
      //  本月轨迹点
      initTrailMonthChart(res.Data);
      //  本月里程
      initMileageMonthChart(res.Data);
      //  本月设备里程Top5
      initMileageMonthTopChart(res.Data);
    }
  });
};
/**近七天轨迹点图表 */
const initSevenDayTrailChart = (data: any) => {
  let sevenDayTerminalNo: Array<string> = [];
  let sevenDayTrailCount: Array<string> = [];
  data.deviceTrailSevenDay.forEach((item: any) => {
    sevenDayTerminalNo.push(item.key);
    sevenDayTrailCount.push(item.val);
  });
  sevenDayTrailOption.value = {
    title: "最近7天轨迹点",
    tooltipTitle: "时间：",
    tooltip: "轨迹点",
    isArea: true,
    mainData: sevenDayTrailCount.reverse(),
    xAxis: {
      type: "category",
      data: sevenDayTerminalNo.reverse(),
      axisLabel: {
        interval: 0,
        // rotate: 40
      },
    },
  };
};

/**近七天里程图表 */
const initSevenDayMileageChart = (data: any) => {
  let sevenDayMileageTime: Array<string> = [];
  let sevenDayMileageData: Array<string> = [];
  data.deviceMileageSevenDay.forEach((item: any) => {
    // sevenDayMileageTime.push(formatDateTime(item.recordDate, 'yyyy-m-d'));
    sevenDayMileageTime.push(item.key);
    sevenDayMileageData.push(item.val);
  });
  sevenDayMileageOption.value = {
    title: "最近七天里程",
    tooltipTitle: "时间：",
    tooltip: "km",
    color: "#91cc75",
    isArea: true,
    mainData: sevenDayMileageData.reverse(),
    xAxis: {
      type: "category",
      data: sevenDayMileageTime.reverse(),
    },
  };
};

/**本月轨迹点图表 */
const initTrailMonthChart = (data: any) => {
  let trailMonthTime: Array<string> = [];
  let trailMonthData: Array<string> = [];
  data.deviceTrailMonth.forEach((item: any) => {
    trailMonthTime.push(item.key);
    trailMonthData.push(item.val);
  });
  trailMonthOption.value = {
    title: "本月轨迹点",
    tooltipTitle: "时间：",
    tooltip: "轨迹点",
    color: "#fac858",
    isArea: true,
    mainData: trailMonthData.reverse(),
    xAxis: {
      type: "category",
      data: trailMonthTime.reverse(),
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
  };
};

/**本月里程图表 */
const initMileageMonthChart = (data: any) => {
  let mileageMonthTime: Array<string> = [];
  let mileageMonthData: Array<string> = [];
  data.deviceMileageMonth.forEach((item: any) => {
    mileageMonthTime.push(item.key);
    mileageMonthData.push(item.val);
  });
  mileageMonthOption.value = {
    title: "本月里程",
    tooltipTitle: "时间：",
    tooltip: "km",
    color: "#ee6666",
    isArea: true,
    mainData: mileageMonthData.reverse(),
    xAxis: {
      type: "category",
      data: mileageMonthTime.reverse(),
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
  };
};

/**本月设备里程Top5 */
const initMileageMonthTopChart = (data: any) => {
  let mileageMonthTime: Array<string> = [];
  let mileageMonthData: Array<string> = [];
  data.deviceMileageMonthTop.forEach((item: any) => {
    mileageMonthTime.push(item.key);
    mileageMonthData.push(item.val);
  });
  mileageMonthTopOption.value = {
    title: "本月设备里程Top5",
    tooltipTitle: "设备：",
    tooltip: "km",
    color: "#73c0de",
    chartType: "bar",
    mainData: mileageMonthData,
    xAxis: {
      type: "category",
      data: mileageMonthTime,
    },
  };
};
</script>

<style lang="scss">
.main {
  margin: 10px 0;
}

.countExhibit {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  h3 {
    margin: 0;
    font-size: 14px;
  }
  .countData {
    margin: 10px;
    text-align: right;
    font-size: 24px;
    font-weight: bold;
  }
}
.chartExhibit {
  height: 270px;
  padding: 10px 0;
  margin: 10px 0;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #f1f1f1;
}
.chartExhibitTop5 {
  height: 210px;
}
</style>
