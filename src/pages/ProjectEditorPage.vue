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
          <image-drop ref="imgedrop" v-model="image"></image-drop>
        </div>
        <div class="mb-3">
          <hash-autocomplete>
            <textarea
              ref="textarea_description"
              v-model="description"
              class="inline-editor"
              rows="2"
              placeholder="Optional description of the project (click here to edit)"
            ></textarea>
            <small class="red" v-if="errors.includes('req_desc')"
              >Description is required</small
            >
          </hash-autocomplete>
        </div>
        <div class="mb-3">
          <link-editor v-model="links"></link-editor>
        </div>
        <category-selector v-model="category"></category-selector>
        <small class="red" v-if="errors.includes('req_category')"
          >Choose a category</small
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
import { Component, Vue } from 'vue-facing-decorator'

import { callApi } from "../utils/api_utils";

import CategorySelector from "../components/CategorySelector.vue";
import ImageDrop from "../components/ImageDrop.vue";
import LinkEditor from "../components/LinkEditor.vue";
import CoordinateSelector from "../components/CoordinateSelector.vue";
import App from "../components/App.vue";
import ModalDialog from "../components/ModalDialog.vue";
import HashAutocomplete from "../components/HashAutocomplete.vue";

@Component({
  components: {
    CategorySelector,
    ImageDrop,
    LinkEditor,
    CoordinateSelector,
    ModalDialog,
    HashAutocomplete,
  },
})
export default class ProjectEditorPage extends Vue {
  public errors: string[] = [];

  public title = "";
  public description = "";
  public category: string = "";
  public coords: any = {};
  public links = [];
  public image = "";

  private draftId?: string | null;

  mounted() {
    this.init();
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("draftId")) {
      const user = await (this.$root as App).getCurrentUser();
      if (!user) return;
      this.draftId = params.get("draftId");
      const userToken = await user.getIdToken(true);
      const draft = await callApi("/api/getDraft", {
        userToken: userToken,
        id: this.draftId,
      });
      this.title = draft.content.title;
      this.description = draft.content.description;
      this.image = draft.content.image;
      this.category = draft.content.category;
      this.links = draft.content.links;
      this.$nextTick(() => {
        let textarea = this.$refs.textarea_description as HTMLElement;
        textarea.style.height = textarea.scrollHeight + "px";
      });
    }
  }

  async submitProject() {
    this.errors = [];
    if (this.title == "") this.errors.push("req_title");
    if (this.description == "") this.errors.push("req_desc");
    if (this.category == "") this.errors.push("req_category");
    if (this.errors.length > 0) return;

    const user = await (this.$root as App).getCurrentUser();
    if (!user) {
      (this.$refs.signinModal as ModalDialog).show();
      return;
    }

    await (this as any).$recaptchaLoaded();
    let captchaToken = await (this as any).$recaptcha("login");

    const userToken = await user.getIdToken(true);

    const uploadResponse = await (this.$refs.imgedrop as ImageDrop).uploadFile(
      userToken,
      captchaToken
    );

    const image_url = uploadResponse
      ? `/images/${uploadResponse.hash}.jpg`
      : this.image;

    captchaToken = await (this as any).$recaptcha("login");

    const response = await callApi("/api/submitDraft", {
      userToken: userToken,
      captchaToken: captchaToken,
      draftId: this.draftId,
      content: {
        title: this.title,
        description: this.description,
        links: this.links,
        category: this.category,
        coords: this.coords,
        image: image_url,
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