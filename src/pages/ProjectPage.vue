<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <h1 class="text-center">{{ content.title }}</h1>
        <span>{{ content.description }}</span>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useSSRContext } from "vue";
import { isBrowser } from "../utils/ssr_utils";

import { callApi } from "../utils/api_utils";

import App from "../components/App.vue";

@Options({})
export default class ProjectPage extends Vue {
  public content = {
    title: "",
    description: "",
  };

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
  }
}
</script>