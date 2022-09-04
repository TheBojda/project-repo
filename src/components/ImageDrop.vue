<template>
  <div>
    <img  :src="previewSrc" class="rounded preview" @drop.prevent="onDrop" v-show="previewSrc" />
    <div class="image_drop" @drop.prevent="onDrop" v-show="!previewSrc">
      <span class="image_drop_text">Drop a project image here!</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

const events = ["dragenter", "dragover", "dragleave", "drop"];

function preventDefaults(e) {
  e.preventDefault();
}

@Options({})
export default class ImageDrop extends Vue {
  public previewSrc = "";

  mounted() {
    events.forEach((eventName) => {
      document.body.addEventListener(eventName, preventDefaults);
    });
  }

  unmounted() {
    events.forEach((eventName) => {
      document.body.removeEventListener(eventName, preventDefaults);
    });
  }

  onDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      this.previewSrc = URL.createObjectURL(file);
    }
  }
}
</script>

<style scoped>
.image_drop {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  text-align: center;
  min-height: 200px;
  background-color: #eeeeee;
}
.image_drop_text {
  text-align: center;
  vertical-align: middle;
  line-height: 200px;
}
.preview {
  width: 100%;
}
</style>