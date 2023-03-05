<script setup lang="ts">
import * as d3 from "d3";
import { vega } from './chart-engine/vega/vegaLoader.js';
import { SankeyChart } from './chart-engine/d3/sankeyD3Loader.js';

import sankeySampleData from './assets/chart-data/sankey-sample-data.json';
import sankeyChartData from './assets/chart-data/sankey.vg.json';
import voronoiChartData from './assets/chart-data/voronoi.vg.json';

import HelloWorld from './components/HelloWorld.vue';
import { onMounted, ref } from "vue";

let chart = SankeyChart({
  links: sankeySampleData
}, {
  nodeGroup: d => d.id.split(/\W/)[0], // take first word for color
  nodeAlign: "justify", // e.g., d3.sankeyJustify; set by input above
  linkColor: "source-target", // e.g., "source" or "target"; set by input above
  format: (f => d => `${f(d)} TWh`)(d3.format(",.1~f")),
  width: 1000,
  height: 600
});

const chartContainer = ref();

onMounted(() => {
  chartContainer.value?.insertBefore(chart, null);

  let voronoiView = new vega.View(vega.parse(voronoiChartData), {
    renderer: 'svg',  // renderer (canvas or svg)
    container: '#voronoiContainer',   // parent DOM container
    hover: true       // enable hover processing
  });
  voronoiView.runAsync();

  let sankeyView = new vega.View(vega.parse(sankeyChartData), {
    renderer: 'svg',  // renderer (canvas or svg)
    container: '#sankeyContainer',   // parent DOM container
    hover: true       // enable hover processing
  });
  sankeyView.runAsync();

});

</script>

<template>
  <div ref="chartContainer" />
  <div id="sankeyContainer" />
  <div id="voronoiContainer" />
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
