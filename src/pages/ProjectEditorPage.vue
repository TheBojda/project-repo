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
          <image-drop v-model="image"></image-drop>
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
    <modal-dialog ref="signinModal">
      <template #title>Error dialog</template>
      Please sign in before submit your project!
    </modal-dialog>
    <modal-dialog ref="responseModal">
      <template #title>Draft submission</template>
      Draft is succesfully submited to review!
      <template #footer>
        <button class="btn btn-primary" @click="redirectHome">OK</button>
      </template>
    </modal-dialog>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { callApi } from "../utils/api_utils";

import CategorySelector from "../components/CategorySelector.vue";
import ImageDrop from "../components/ImageDrop.vue";
import LinkEditor from "../components/LinkEditor.vue";
import CoordinateSelector from "../components/CoordinateSelector.vue";
import App from "../components/App.vue";
import ModalDialog from "../components/ModalDialog.vue";

@Options({
  components: {
    CategorySelector,
    ImageDrop,
    LinkEditor,
    CoordinateSelector,
    ModalDialog,
  },
})
export default class ProjectEditorPage extends Vue {
  public errors: string[] = [];

  public title = "";
  public short_description = "";
  public description = "";
  public categories: string[] = [];
  public coords: any = {};
  public links = [];
  public image = "";

  async submitProject() {
    this.errors = [];
    if (this.title == "") this.errors.push("req_title");
    if (this.short_description == "") this.errors.push("req_short_desc");
    if (this.categories.length == 0) this.errors.push("req_category");
    if (this.errors.length > 0) return;

    const user = await (this.$root as App).getCurrentUser();
    if (!user) {
      (this.$refs.signinModal as ModalDialog).show();
      return;
    }

    await (this as any).$recaptchaLoaded();
    const captchaToken = await (this as any).$recaptcha("login");

    const userToken = await user.getIdToken(true);

    const response = await callApi("/api/submitDraft", {
      userToken: userToken,
      captchaToken: captchaToken,
      content: {
        title: this.title,
        short_description: this.short_description,
        description: this.description,
        links: this.links,
        categories: this.categories,
        coords: this.coords,
        image: this.image,
      },
    });

    console.log(response);
    (this.$refs.responseModal as ModalDialog).show();
  }

  async redirectHome() {
    window.location.replace("/");
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