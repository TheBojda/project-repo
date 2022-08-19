<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <h1 class="text-center">{{ title }}</h1>
        <h2>{{ short_description }}</h2>
        <span>{{ description }}</span>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useSSRContext } from "vue";
import { isBrowser } from "../utils/SSRUtils.js";

@Options({})
export default class ProjectPage extends Vue {
  public title: string = "";
  public short_description: string = "";
  public description: string = "";

  created() {
    if (!isBrowser()) {
      const context = useSSRContext();
      this.title = context?.title;
      this.short_description = context?.short_description;
      this.description = context?.description;
    }
  }
}
</script>