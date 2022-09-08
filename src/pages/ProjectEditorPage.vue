<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <div class="mb-3">
          <h1>
            <input
              v-model="title"
              type="text"
              class="inline-editor"
              placeholder="Project title (click here to edit)"
            />
          </h1>
          <small class="red" v-if="errors.includes('req_title')"
            >Project title is required</small
          >
        </div>
        <div class="mb-3">
          <image-drop></image-drop>
        </div>
        <div class="mb-3">
          <h2>
            <textarea
              v-model="short_description"
              class="inline-editor"
              rows="2"
              placeholder="Short description of the project (click here to edit)"
            ></textarea>
          </h2>
          <small class="red" v-if="errors.includes('req_short_desc')"
            >Short description is required</small
          >
        </div>
        <div class="mb-3">
          <h2>
            <textarea
              v-model="description"
              class="inline-editor"
              rows="2"
              placeholder="Optional description of the project (click here to edit)"
            ></textarea>
          </h2>
        </div>
        <div class="mb-3">
          <link-editor v-model="links"></link-editor>
        </div>
        <category-selector v-model="categories"></category-selector>
        <small class="red" v-if="errors.includes('req_category')"
          >Choose minimum 1 category</small
        >
        <coordinate-selector v-model="coords"></coordinate-selector>
        <div class="mt-3 mb-3">
          <button class="btn btn-primary" @click="submitProject">
            Submit project to review
          </button>
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
export default class ProjectEditorPage extends Vue {
  public errors: string[] = [];

  public title = "";
  public short_description = "";
  public description = "";
  public categories: string[] = [];
  public coords: any = {};
  public links = [];

  submitProject() {
    this.errors = [];
    //console.log(this.categories);
    //console.log(this.coords);
    //console.log(this.links);
    if (this.title == "") this.errors.push("req_title");
    if (this.short_description == "") this.errors.push("req_short_desc");
    if (this.categories.length == 0) this.errors.push("req_category");
  }
}
</script>

<style scoped>
.inline-editor {
  width: 100%;
  border: none;
  outline: none;
}
.red {
  color: red;
}
</style>