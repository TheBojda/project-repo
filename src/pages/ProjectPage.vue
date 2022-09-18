<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <h1 class="text-center">{{ content.title }}</h1>
        <div class="alert alert-dark" role="alert" v-if="!avatar_hash">
          This page is imported and not maintained on our side! If you want to
          be the maintainer of this page, please contact us.
        </div>
        <img :src="content.image" class="rounded w-100 mb-3" />
        <div class="mb-3" style="white-space: pre-wrap">
          {{ content.description }}
        </div>
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
        <leaflet-map
          :coords="content.coords"
          v-if="content.coords"
        ></leaflet-map>
        <div class="row mt-2" v-if="avatar_hash">
          <div class="col"></div>
          <div class="col-3">
            This page is maintained by<br />
            <small>(click on the image)</small>
          </div>
          <div class="col-1">
            <a
              :href="`https://www.gravatar.com/${avatar_hash}`"
              target="_blank"
            >
              <img
                :src="`https://www.gravatar.com/avatar/${avatar_hash}?s=40`"
                width="40"
                height="40"
                class="d-inline-block align-middle"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="text-center">
        This content is available under the
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          >Creative Commons Attribution-ShareAlike License 4.0</a
        >
        additional terms may apply.
      </p>
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
import LeafletMap from "../components/LeafletMap.vue";

@Options({
  components: { LeafletMap },
})
export default class ProjectPage extends Vue {
  public content: any = {};
  public avatar_hash: string = "";
  public categories = {};

  created() {
    if (!isBrowser()) {
      const context = useSSRContext();
      this.content = context?.content;
      this.avatar_hash = context?.avatar_hash;
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
      const project = await (
        await fetch(window.location.pathname + "/json")
      ).json();
      this.content = project.content;
      this.avatar_hash = project.avatar_hash;
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
  