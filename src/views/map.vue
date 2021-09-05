<template>
  <div id="map-container"></div>
</template>


<script>
import { Scene } from '@antv/l7'
import { Mapbox } from '@antv/l7-maps'

export default {
  mounted () {
    this.scene = new Scene({
      id: 'map-container',
      map: new Mapbox({
      })
    })
  }
}
</script>
