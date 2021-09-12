import jspdf from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * 使用html2canvas+jspdf截屏dom导出pdf文件，可分页
 * 
 * @param { HTMLElement } el 需要导出的dom
 * @param { String } fileName："file" 导出的pdf文件名
 * @param { Object } imageOpt：{} html2canvas导出图片样式 
 * {
 *  backgroundColor: "#ffffff" 图片背景色
 *  width: "el.scrollWidth" 图片宽度
 *  height: "el.scrollHeight" 图片高度
 *  compensationHeight："0" 补偿高度，页面导出可能有空白，适度添加补偿高度
 * }
 * @param { Object } pdfOpt：{} jspdf导出pdf样式
 * {
 *  width: pdf单页宽度，默认a4纸宽度
 *  contentPageHeight: 单页内容显示高度，用于计算对应pdf单页高度，为空则单页高度为a4纸高度
 *  padding: "0" 边距，只显示在width和首页上方，其他页垂直边距由dom本身提供
 * }
 * @returns 
 */
export const download = (el, fileName = 'file', imageOpt = {}, pdfOpt = {}) => {
  return new Promise((resolve) => {
    html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      scale: 1,
      backgroundColor: imageOpt.backgroundColor || '#ffffff', // 页面背景
      width: imageOpt.width || el.scrollWidth,
      height: imageOpt.height || el.scrollHeight, // 图片高度
      windowHeight: (imageOpt.height || el.scrollHeight) + (imageOpt.compensationHeight || 0) // 页面导出可能有空白，添加补偿高度
    }).then(canvas => {
      let pageData = canvas.toDataURL('image/jpeg', 1.0)
      let contentWidth = canvas.width
      let contentHeight = canvas.height

      // 边框：只存在于width和首页上方
      const padding = pdfOpt.padding || 0
      // pdf单页宽度，默认a4纸宽度
      const pageWidth = pdfOpt.width || 595.28
      // pdf单页高度，默认a4纸高度
      let pageHeight = pdfOpt.contentPageHeight ? ((pageWidth - padding * 2)) / contentWidth * pdfOpt.contentPageHeight : 841.89
      let orientation = ''
      // 根据单页宽高计算方向
      if (pageHeight < pageWidth) {
        orientation = 'l'
      } else {
        orientation = 'p'
      }
      // p 纵向 l 横向，px 单位，尺寸可自定义[页宽，页高]
      const pdf = new jspdf(orientation, 'px', [pageWidth, pageHeight])
      // 每页image定位， 首页可添加边距
      let position = padding
      let imgWidth = pageWidth - padding * 2
      let imgHeight = (pageWidth - padding * 2) / contentWidth * contentHeight
      let leftHeight = imgHeight
      // 单页及多页情况
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', padding, padding, imgWidth, imgHeight)
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', padding, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= pageHeight

          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage()
          }
        }
      }

      pdf.save(`${fileName}.pdf`)

      resolve(pdf)
    })
  })
}