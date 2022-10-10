<template>
  <div style="width: 100%; height: 500px">
    <div style="width: 100%; height: 100%">
      <small>
        Open this location in
        <a
          :href="`https://maps.google.com/?q=${coords.lat},${coords.lng}`"
          target="_blank"
          >Google Maps</a
        >
        or
        <a
          :href="`http://maps.google.com/maps?q=&layer=c&cbll=${coords.lat},${coords.lng}`"
          target="_blank"
          >Google StreetView</a
        >
      </small>
      <div ref="mapDiv" style="width: 100%; height: 90%"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-facing-decorator";

@Component
export default class LeafletMap extends Vue {
  @Prop
  public coords: any;

  @Ref
  readonly mapDiv!: HTMLDivElement;

  mounted() {
    const L = require("leaflet");
    const map = L.map(this.mapDiv).setView([51.505, -0.09], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(this.mapDiv);

    const marker = new L.Marker(this.coords, {
      icon: L.icon({
        iconUrl: "/marker-icon.png",
        shadowUrl: "/marker-shadow.png",
      }),
    });
    marker.addTo(map);
    map.panTo(this.coords);
  }
}
</script>