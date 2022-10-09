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
        <hash-autocomplete>
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
        </hash-autocomplete>
        <div class="text-end">
          <small v-if="optionsVisible"
            ><a href="#" @click.prevent="optionsVisible = false"
              >hide options</a
            ></small
          >
          <small v-if="!optionsVisible"
            ><a href="#" @click.prevent="optionsVisible = true"
              >show options</a
            ></small
          >
        </div>
        <div v-show="optionsVisible">
          <category-selector v-model="category"></category-selector>
          <small class="red" v-if="errors.includes('req_category')"
            >Choose a category</small
          >
          <coordinate-selector v-model="coords"></coordinate-selector>
        </div>
        <div style="height: 1rem"></div>
        <div class="mt-3" v-for="(project, idx) in projects" :key="idx">
          <div class="link-line fw-bold fs-5">
            <i class="link-icon fa fa-external-link-square mr-1"></i
            ><a :href="`/project/${project.slug}`">{{
              project.content.title
            }}</a>
          </div>
          <div class="fs-6">
            {{ truncate(project.content.description, 160) }}
          </div>
        </div>
        <div class="d-flex mt-3">
          <button
            type="button"
            class="btn btn-primary prevButton"
            v-if="nextOffset && nextOffset > 11"
            @click="prevPage"
          >
            Previous
          </button>
          <button
            type="button"
            class="btn btn-primary ms-auto"
            v-if="nextOffset"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <div class="footer mt-4"></div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { callApi } from "../utils/api_utils";

import CategorySelector from "../components/CategorySelector.vue";
import CoordinateSelector from "../components/CoordinateSelector.vue";
import HashAutocomplete from "../components/HashAutocomplete.vue";

@Options({
  components: { CategorySelector, CoordinateSelector, HashAutocomplete },
})
export default class SearchPage extends Vue {
  public optionsVisible = true;
  public searchExpression = "";
  public category: string = "";
  public coords: any = {};
  public errors: string[] = [];
  public projects: any[] = [];
  public nextOffset = 0;
  public hashtags: string[] = [];

  private offset = 0;

  truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  }

  mounted() {
    window.addEventListener("hashchange", this.handleHashChange);
    this.handleHashChange();
  }

  unmounted() {
    window.removeEventListener("hashchange", this.handleHashChange);
  }

  handleHashChange() {
    console.log(window.location.hash);
    if (window.location.hash) {
      let frags = window.location.hash.substring(1).split("|");
      if (frags.length > 0) this.category = frags[0];
      if (frags.length > 1) this.searchExpression = decodeURI(frags[1]);
      if (frags.length > 3 && frags[3] && frags[2])
        this.coords = { lat: parseFloat(frags[2]), lng: parseFloat(frags[3]) };
      if (frags.length > 4) this.offset = parseInt(frags[4]);
      this.doSearch();
    } else {
      this.searchExpression = "";
      this.offset = 0;
      this.optionsVisible = true;
      this.projects = [];
      this.nextOffset = 0;
    }
  }

  refreshHash() {
    window.location.hash = `#${this.category}|${this.searchExpression}|${
      this.coords.lat || ""
    }|${this.coords.lng || ""}|${this.offset}`;
  }

  async doSearch() {
    this.optionsVisible = false;

    await (this as any).$recaptchaLoaded();
    let captchaToken = await (this as any).$recaptcha("login");

    const response = await callApi("/api/search", {
      captchaToken: captchaToken,
      category: this.category,
      coords: this.coords,
      expression: this.searchExpression,
      offset: this.offset,
    });

    this.projects = response.projects;

    if (response.next_offset) this.nextOffset = response.next_offset;
  }

  search() {
    this.errors = [];
    if (this.category == "") this.errors.push("req_category");
    if (this.errors.length > 0) {
      this.optionsVisible = true;
      return;
    }

    this.refreshHash();
  }

  nextPage() {
    this.offset = this.nextOffset;
    this.search();
  }

  prevPage() {
    this.offset = this.offset - 11;
    this.search();
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
.red {
  color: red;
}
</style>