<template>
  <div style="width: 100%; height: 100%">
    <small
      >Click on the map to select a position (<a href="#" @click="clearPosition"
        >clear position</a
      >)</small
    >
    <div ref="map" style="width: 100%; height: 90%"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class CoordinateSelector extends Vue {
  private marker: any;
  private map: any;

  mounted() {
    const L = require("leaflet");
    this.map = L.map(this.$refs.map).setView([51.505, -0.09], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
    });
    resizeObserver.observe(this.$refs.map as Element);

    this.map.on("click", (e) => {
      let latlng = e.latlng;
      if (!this.marker) {
        this.marker = new L.Marker(latlng);
        this.marker.addTo(this.map);
      } else {
        this.marker.setLatLng(latlng);
      }
      this.$emit("coordsChanged", latlng);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        this.map.panTo([p.coords.latitude, p.coords.longitude]);
      });
    }
  }

  clearPosition() {
    this.map.removeLayer(this.marker);
    this.marker = undefined;
    this.$emit("coordsChanged", {});
  }
}
</script>