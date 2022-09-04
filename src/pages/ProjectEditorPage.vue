<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <div class="mb-3">
          <h1>
            <label for="title" class="form-label">Project title</label>
            <input
              type="text"
              class="form-control"
              id="title"
              placeholder="Example project title"
            />
          </h1>
        </div>
        <div class="mb-3">
          <image-drop></image-drop>
        </div>
        <div class="mb-3">
          <h2>
            <label for="short_description" class="form-label"
              >Short description</label
            >
            <textarea
              class="form-control"
              id="short_description"
              rows="3"
              placeholder="Short description of the project"
            ></textarea>
          </h2>
        </div>
        <div class="mb-3">
          <h2>
            <label for="description" class="form-label"
              >Description (optional)</label
            >
            <textarea
              class="form-control"
              id="description"
              rows="6"
              placeholder="Description of the project"
            ></textarea>
          </h2>
        </div>
        <div class="mb-3">
          <h2>
            <label class="form-label">Position (optional)</label>
          </h2>
          <div style="width: 100%; height: 200px">
            <coordinate-selector></coordinate-selector>
          </div>
        </div>
        <div class="mb-3">
          <h2>Links</h2>
          <link-editor></link-editor>
        </div>
        <category-selector></category-selector>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import CategorySelector from "../components/CategorySelector.vue";
import ImageDrop from "../components/ImageDrop.vue";
import LinkEditor from "../components/LinkEditor.vue";
import CoordinateSelector from "../components/CoordinateSelector.vue";

@Options({
  components: { CategorySelector, ImageDrop, LinkEditor, CoordinateSelector },
})
export default class ProjectEditorPage extends Vue {}
</script>

<style scoped>
</style>