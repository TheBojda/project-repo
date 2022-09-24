<template>
  <main role="main" class="container">
    <div style="padding-top: 7rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <h1 class="text-center">ENVIENTA Search</h1>
        <div style="height: 1rem"></div>
        <h4>
          The
          <a
            href="https://wiki.p2pfoundation.net/Cosmo-Localization"
            target="_blank"
            >Cosmo-Local</a
          >
          search engine. <a href="/project_editor">Register</a> your project or
          local community on our site to make it visible to the whole world.
          Let's change the world together...
        </h4>
        <div style="height: 1rem"></div>
        <div class="input-group search-input">
          <input
            v-model="searchExpression"
            type="text"
            class="form-control"
            placeholder="Search our repository for world-changing projects"
            @keypress.enter="search"
          />
          <button class="btn btn-primary" @click="search">Search</button>
        </div>
        <div class="text-end">
          <small v-if="optionsVisible"
            ><a href="#" @click="optionsVisible = false">hide options</a></small
          >
          <small v-if="!optionsVisible"
            ><a href="#" @click="optionsVisible = true">show options</a></small
          >
        </div>
        <div v-show="optionsVisible">
          <category-selector></category-selector>
          <coordinate-selector></coordinate-selector>
        </div>
        <div style="height: 1rem"></div>
        <div id="service-results">
          <div v-for="(project, idx) in projects" :key="idx">
            <div class="link-line fw-bold fs-5">
              <i class="link-icon fa fa-external-link-square mr-1"></i
              ><a :href="`/project/${project.slug}`">{{
                project.content.title
              }}</a>
            </div>
            <div
              class="fs-6"
              v-html="truncate(project.content.description, 160)"
            ></div>
          </div>
        </div>
        <div id="service-paginator">
          <button
            type="button"
            class="btn btn-primary prevButton"
            style="display: none"
          >
            Previous
          </button>
          <button
            type="button"
            class="btn btn-primary nextButton float-right"
            style="display: none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { callApi } from "../utils/api_utils";

import CategorySelector from "../components/CategorySelector.vue";
import CoordinateSelector from "../components/CoordinateSelector.vue";

@Options({
  components: { CategorySelector, CoordinateSelector },
})
export default class SearchPage extends Vue {
  public optionsVisible = true;
  public searchExpression = "";

  public projects: any[] = [];

  truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
  }

  async search() {
    await (this as any).$recaptchaLoaded();
    let captchaToken = await (this as any).$recaptcha("login");

    const response = await callApi("/api/search", {
      captchaToken: captchaToken,
      expression: this.searchExpression,
    });

    this.projects = response.projects;
  }
}
</script>

<style scoped>
a {
  color: black;
  text-decoration: none;
  font-style: italic;
}
link-line {
  font-size: 1.2em;
}
.link-icon {
  color: #08c;
  margin-right: 0.2rem;
}
</style>