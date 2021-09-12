import Vue from 'vue'
import {
  debounce
} from 'lodash'

const activateTooltip = debounce(tooltip => tooltip.handleShowPopper(), 50)
// v-showOverflow：超出隐藏tips 
Vue.directive('showOverflow', {
  bind(el, binding, vnode) {
    const tooltip = vnode.context.$root.$children[0].$refs.overflowTooltip
    el.onmouseenter = e => handleCellMouseEnter(e, tooltip)
    el.onmouseleave = e => handleCellMouseLeave(e, tooltip)
  }
})

function handleCellMouseEnter(event, tooltip) {
  const el = event.target

  const range = document.createRange()
  range.setStart(el, 0)
  range.setEnd(el, el.childNodes.length)
  const rangeWidth = range.getBoundingClientRect().width
  const padding = (parseInt(getStyle(el, 'paddingLeft'), 10) || 0) + (parseInt(getStyle(el, 'paddingRight'), 10) || 0)
  if (rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.scrollHeight) {
    tooltip.content = el.innerText || el.textContent
    tooltip.referenceElm = el
    tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none')
    tooltip.doDestory()
    tooltip.setExpectedState(true)
    activateTooltip(tooltip)
  }
}

function handleCellMouseLeave(event, tooltip) {
  if (tooltip) {
    tooltip.setExpectedState(false)
    tooltip.handleClosePopper()
  }
}

function getStyle(element, styleName) {
  if (!element || !styleName) return null
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }

  try {
    let computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

// v-resize：改变宽高度，默认宽度，只发消息改变距离的数值，相关模块接收消息自行更新
Vue.directive('resize', {
  bind(el, binding, vnode) {
    if (binding.value == false) return

    // 获取更新类型
    const resizeType = binding.arg === 'height' ? 'height' : 'width'

    el.style.position = 'relative'
    const child = document.createElement('i')
    child.style.position = 'absolute'
    if (resizeType === 'width') {
      child.style.top = '0'
      child.style.right = '0'
      child.style.width = '2px'
      child.style.height = '100%'
      child.style.cursor = 'col-resize'
    } else {
      child.style.bottom = '0'
      child.style.left = '0'
      child.style.width = '100%'
      child.style.height = '2px'
      child.style.cursor = 'row-resize'
    }
    el.append(child)

    child.onmousedown = e => {
      let srcDis = resizeType === 'width' ? e.clientX : e.clientY

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        const moveDis = resizeType === 'width' ? e.clientX : e.clientY
        const value = moveDis - srcDis
        vnode.context.$root.$event.emit('vResize', value)
        srcDis = moveDis
      }

      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})