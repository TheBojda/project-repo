<template>
  <div>
    <img
      :src="previewSrc"
      class="rounded preview"
      @drop.prevent="onDrop"
      v-show="previewSrc"
    />
    <div class="image_drop" @drop.prevent="onDrop" v-show="!previewSrc">
      <span class="image_drop_text">Drop a project image here!</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-facing-decorator";

import { uploadImage } from "../utils/api_utils";

const events = ["dragenter", "dragover", "dragleave", "drop"];

function preventDefaults(e) {
  e.preventDefault();
}

@Component
export default class ImageDrop extends Vue {
  public previewSrc = "";

  private file: any;

  @Prop
  public modelValue = "";

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

  @Watch("modelValue", { immediate: true })
  modelValueWatcher(val) {
    this.previewSrc = val;
  }

  onDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.file = files[0];

      let fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        let result = fileReader.result as string;
        this.previewSrc = result;
        this.$emit("update:modelValue", result);
      });
      fileReader.readAsDataURL(this.file);
    }
  }

  async uploadFile(userToken: string, captchaToken: string) {
    if (!this.file) return;
    return await uploadImage(this.file, userToken, captchaToken);
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