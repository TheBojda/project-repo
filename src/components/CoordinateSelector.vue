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
                    <div class="col-lg input-group">
                      <button class="btn btn-primary" @click="jumpto">
                        Jump to:
                      </button>
                      <input
                        v-model="jumpto_coords"
                        type="text"
                        class="form-control"
                        placeholder="GPS coordinate eg.: 37.3978, -122.0610"
                      />
                    </div>
                    <div class="col-lg">
                      <small>
                        We don't have address database, so if you want to jump
                        to an address, search it on
                        <a href="https://www.google.com/maps" target="_blank"
                          >Google Maps</a
                        >, copy the GPS address from right click menu, and click
                        on the "Jump to" button.
                      </small>
                    </div>
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
        this.map.panTo([p.coords.latitude, p.coords.longitude]);
      });
    }
  }

  clearPosition() {
    this.map.removeLayer(this.marker);
    this.marker = undefined;
    this.coords = {};
    this.$emit("update:modelValue", this.coords);
  }

  jumpto() {
    let coords = convert(this.jumpto_coords);
    this.map.flyTo([coords.decimalLatitude, coords.decimalLongitude], 17);
  }
}
</script>