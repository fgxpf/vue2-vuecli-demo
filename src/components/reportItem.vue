<template>
  <div class="item">
    <div ref="chart" id="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.chart = echarts.init(this.$refs.chart)
    let option = {
      legend: {
        top: 'bottom'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [50, 150],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 40, name: 'rose 1' },
            { value: 38, name: 'rose 2' },
            { value: 32, name: 'rose 3' },
            { value: 30, name: 'rose 4' },
            { value: 28, name: 'rose 5' },
            { value: 26, name: 'rose 6' },
            { value: 22, name: 'rose 7' },
            { value: 18, name: 'rose 8' }
          ]
        }
      ]
    };
    this.chart.setOption(option);

    window.addEventListener('resize', this.resize);
  },
  beforeDestroy () { //一定要在这个生命周期销毁，不然在销毁时找不到元素报错，不信你试试🤨
    window.removeEventListener('resize', this.resize);
    if (this.chart.dispose) this.chart.dispose();
  },
  methods: {
    resize () {
      if (this.chart.resize) this.chart.resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  background: #9bb5a9;
  grid-column: span 2;
  grid-row: span 2;
}
#chart {
  height: 100%;
  width: 100%;
}
</style>