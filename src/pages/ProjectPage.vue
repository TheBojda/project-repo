<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <h1 class="text-center">{{ content.title }}</h1>
        <img :src="content.image" class="rounded w-100 mb-3" />
        <div class="mb-3" style="white-space: pre-wrap;">{{ content.description }}</div>
        <div class="mb-3">
          <span
            class="badge bg-primary tag-badge"
            v-for="key in content.categories"
            :key="key"
            >{{ categories[key] }}</span
          >
        </div>
        <div
          class="row mb-2 link-line"
          v-for="(link, idx) in content.links"
          :key="idx"
        >
          <div class="col">
            <i class="link-icon" :class="getIcon(link.url)"></i>
            {{ link.description }} -
            <a :href="link.url" target="_blank">{{ link.url }}</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useSSRContext } from "vue";

import { isBrowser } from "../utils/ssr_utils";
import { callApi } from "../utils/api_utils";
import { getIcon } from "../utils/link_utils";

import App from "../components/App.vue";

@Options({})
export default class ProjectPage extends Vue {
  public content: any = {};
  public categories = {};

  created() {
    if (!isBrowser()) {
      const context = useSSRContext();
      this.content = context?.content;
    }
  }

  mounted() {
    this.init();
  }

  async init() {
    this.categories = await (await fetch("/config/categories.json")).json();

    const params = new URLSearchParams(window.location.search);
    if (params.has("draftId")) {
      const user = await (this.$root as App).getCurrentUser();
      if (!user) return;
      const draftId = params.get("draftId");
      const userToken = await user.getIdToken(true);
      const draft = await callApi("/api/getDraft", {
        userToken: userToken,
        id: draftId,
      });
      this.content = draft.content;
    }

    const path = window.location.pathname;
    if (path.startsWith("/project/")) {
      const slug = window.location.pathname.substring(9);
      const project = await callApi("/api/getProject", {
        slug: slug,
      });
      this.content = project.content;
    }
  }

  getIcon(url) {
    return getIcon(url);
  }
}
</script>

<style scoped>
.link-line {
  font-size: 1.2em;
}
.link-icon {
  color: #08c;
}
a {
  color: black;
  text-decoration: none;
  font-style: italic;
}
.tag-badge {
  margin-top: 2px;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  cursor: default;
}
</style>
  