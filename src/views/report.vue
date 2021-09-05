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
// import html2pdf from 'html2pdf.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
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
      html2canvas(this.$refs.list, {
        useCORS: true,
        width: this.$refs.list.offsetWidth - 10,
        height: this.$refs.list.scrollHeight,
        windowHeight: this.$refs.list.scrollHeight,
        y: this.$refs.list.getBoundingClientRect().top,
      }).then((canvas) => {
        let img = document.createElement('img')
        let pagedata = canvas.toDataURL('image/jpeg')
        img.src = pagedata
        document.body.appendChild(img)

        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
        var pageHeight = 595.28 / contentWidth * 680
        let orientation = ''
        if (pageHeight < 595.28) {
          orientation = 'l'
        } else {
          orientation = 'p'
        }
        const pdf = new jsPDF(orientation, 'px', [595.28, pageHeight])
        //页面偏移
        var position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        var imgWidth = 595.28;
        var imgHeight = 595.28 / contentWidth * contentHeight;
        //未生成pdf的html页面高度
        var leftHeight = imgHeight;

        var pageData = canvas.toDataURL('image/jpeg', 1.0);
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= pageHeight;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }

        pdf.save();
      })
      // this.$nextTick(() => {
      //   var opt = {
      //     image: { type: 'jpeg', quality: 0.98 },
      //     html2canvas: {
      //       useCORS: true,
      //       // width: this.$refs.list.offsetWidth,
      //       // height: this.$refs.list.offsetHeight,
      //       windowWidth: this.$refs.list.offsetWidth,
      //       // windowHeight: this.$refs.list.scrollHeight,
      //       // x: this.$refs.list.getBoundingClientRect().left,
      //       // y: this.$refs.list.getBoundingClientRect().top,
      //       scale: 2,
      //       scrollX: 0,
      //       scrollY: 0,
      //       // pagebreak: { mode: 'avoid-all' }
      //     },
      //     jsPDF: { unit: 'mm', format: 'a4' }
      //   };
      //   html2pdf().set(opt).from(this.$refs.list).save().then(() => {
      //   })
      // })
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