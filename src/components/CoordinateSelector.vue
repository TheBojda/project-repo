<template>
  <div>
    <div class="mb-3 mt-3" v-if="coords.lat && coords.lng">
      <strong>Position: {{ coords.lat }}, {{ coords.lng }}</strong>
    </div>
    <div class="accordion mt-3">
      <div class="accordion-item">
        <div class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#coordinateCollapse"
            aria-expanded="false"
          >
            <strong v-if="!coords.lat && !coords.lng">
              Set the geographical position. (optional)
            </strong>
            &nbsp; To set the position, click here!
          </button>
        </div>
        <div id="coordinateCollapse" class="accordion-collapse collapse">
          <div class="accordion-body">
            <div style="width: 100%; height: 500px">
              <div style="width: 100%; height: 100%">
                <div class="container">
                  <div class="row">
                    <div class="col">
                      Click on the map to select a position (<a
                        href="#"
                        @click="clearPosition"
                        >clear position</a
                      >)
                    </div>
                  </div>
                  <div class="row mt-1 mb-2">
                    <div class="input-group">
                      <button class="btn btn-primary" @click="jumpto">
                        Jump to:
                      </button>
                      <input
                        v-model="jumpto_coords"
                        type="text"
                        class="form-control"
                        placeholder="What3words address eg.: ///filled.count.soap or GPS coordinate eg.: 37.3978, -122.0610"
                      />
                    </div>
                    <small>
                      Use
                      <a href="https://what3words.com/" target="_blank"
                        >what3words</a
                      >
                      to find the address and jump to it.
                    </small>
                  </div>
                </div>
                <div ref="map" style="width: 100%; height: 80%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import convert from "geo-coordinates-parser";

import config from "../config.json";

@Options({ props: ["modelValue"] })
export default class CoordinateSelector extends Vue {
  private marker: any;
  private map: any;

  public coords: any = {};
  public jumpto_coords = "";

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
      this.coords = latlng;
      this.$emit("update:modelValue", this.coords);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        if (!this.marker)
          this.map.panTo([p.coords.latitude, p.coords.longitude]);
      });
    }

    this.$watch(
      "modelValue",
      (val) => {
        this.coords = val ? val : {};
        if (this.coords && this.coords.lat && this.coords.lng && this.map) {
          this.marker = new L.Marker([this.coords.lat, this.coords.lng]);
          this.marker.addTo(this.map);
          this.map.panTo([this.coords.lat, this.coords.lng]);
        }
      },
      { immediate: true }
    );
  }

  clearPosition() {
    this.map.removeLayer(this.marker);
    this.marker = undefined;
    this.coords = {};
    this.$emit("update:modelValue", this.coords);
  }

  async jumpto() {
    if (this.jumpto_coords) {
      let coords;
      if (this.jumpto_coords.startsWith("///")) {
        const result = await (
          await fetch(
            `https://api.what3words.com/v3/convert-to-coordinates?words=${this.jumpto_coords}&key=${config.w3wApiKey}`
          )
        ).json();
        coords = result.coordinates;
      } else {
        const result = convert(this.jumpto_coords);
        coords.lat = result.decimalLatitude;
        coords.lng = result.decimalLongitude;
      }
      this.map.flyTo([coords.lat, coords.lng], 17);
    }
  }
}
</script>