<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <div class="mb-3">
          <h1>
            <input
              type="text"
              class="inline-editor"
              placeholder="Project title (click here to modify)"
            />
          </h1>
        </div>
        <div class="mb-3">
          <image-drop></image-drop>
        </div>
        <div class="mb-3">
          <h2>
            <textarea
              class="inline-editor"
              rows="2"
              placeholder="Short description of the project (click here to modify)"
            ></textarea>
          </h2>
        </div>
        <div class="mb-3">
          <h2>
            <textarea
              class="inline-editor"
              rows="2"
              placeholder="Description of the project (click here to modify)"
            ></textarea>
          </h2>
        </div>
        <div class="mb-3">
          <link-editor></link-editor>
        </div>
        <div class="accordion">
          <div class="accordion-item">
            <div class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#coordinateCollapse"
                aria-expanded="false"
              >
                <strong
                  >Set the geographical position of your project if it has.
                  (optional)</strong
                >
                &nbsp; To set the position, click here!
              </button>
            </div>
            <div id="coordinateCollapse" class="accordion-collapse collapse">
              <div class="accordion-body">
                <div style="width: 100%; height: 500px">
                  <coordinate-selector></coordinate-selector>
                </div>
              </div>
            </div>
          </div>
        </div>
        <category-selector></category-selector>
        <div class="mt-3">
          <button class="btn btn-primary">Submit project to review</button>
        </div>
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
.inline-editor {
  width: 100%;
  border: none;
  outline: none;
}
</style>