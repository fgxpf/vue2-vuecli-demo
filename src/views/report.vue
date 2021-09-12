<template>
  <div class="about">
    <button @click="download">下载</button>
    <div class="side"></div>
    <div ref="list" class="list">
      <reportItem v-for="key in 10" :key="key" />
    </div>
  </div>
</template>

<script>
import reportItem from '@/components/reportItem'
import { download } from '@/tool/reportDownload'
export default {
  components: {
    reportItem
  },
  data () {
    return {
    }
  },
  methods: {
    download () {
      download(this.$refs.list, 'file', {
        width: this.$refs.list.offsetWidth - 10
      }, {
        contentPageHeight: 680
      })
    }
  }
}
</script>


<style scoped>
.about {
  height: 100%;
  display: grid;
  grid-template-areas:
    "sidebar header  header"
    "sidebar content content";
}
.list {
  grid-area: content;
  height: 100%;
  background: #2e4358;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 150px;
  overflow: auto;
}

.list.ab {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

button {
  grid-area: header;
}

.side {
  width: 100px;
  grid-area: sidebar;
}
</style>