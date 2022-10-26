<template>
  <div v-bind="$attrs"></div>
</template>
<script lang="ts">
import * as echarts from "echarts";
import { h, onMounted, reactive, ref, useAttrs } from "vue";

export default {
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    console.log(props.option);
    const attrs = useAttrs();
    console.log(attrs);
    const chartView = ref({});
    const chartOption = ref(null);

    const initChart = () => {
      let dom = document.getElementById(attrs.id as string);
      console.log(dom);
      let chart = echarts.init(
        dom as HTMLElement,
        {},
        {
          renderer: "svg",
        }
      );
      chart.setOption(
        {
          title: {
            show: true,
            text: props.option.title != undefined ? props.option.title : "",
            top: "15px",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
            formatter: (params: any) => {
              return props.option.tooltipTitle != undefined ? props.option.tooltipTitle + params[0].name + "<br/>" + params[0].marker + params[0].value + props.option.tooltip : params[0].name + "<br/>" + params[0].marker + params[0].value;
            },
          },
          color: props.option.color != undefined ? props.option.color : "#5470C6",
          xAxis:
            props.option.xAxis != undefined
              ? props.option.xAxis
              : {
                  type: "category",
                  data: [],
                },
          yAxis:
            props.option.yAxis != undefined
              ? props.option.yAxis
              : {
                  type: "value",
                  //   axisLabel: {
                  //       formatter: `{value}${props.option.tooltip != undefined ? props.option.tooltip : ''}`,
                  //   },
                },
          grid: {
            left: "100px",
          },
          series: [
            {
              data: props.option.mainData,
              type: props.option.chartType != undefined ? props.option.chartType : "line",
              areaStyle: props.option.isArea ? {} : undefined,
              colorBy: "series",
            },
          ],
        },
        true
      );
      window.addEventListener("resize", () => {
        chart.resize();
      });
      return chart;
    };

    onMounted(() => {
      initChart();
    });

    return {
      chartView,
      chartOption,
      initChart,
    };
  },
};
</script>
<style scoped></style>
