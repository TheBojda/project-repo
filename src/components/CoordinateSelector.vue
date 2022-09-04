<template>
  <div style="width: 100%; height: 100%">
    <small>Click on the map to select a position</small>
    <div ref="map" style="width: 100%; height: 90%"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class CoordinateSelector extends Vue {
  mounted() {
    var L = require("leaflet");

    var map = L.map(this.$refs.map).setView([51.505, -0.09], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
}
</script>