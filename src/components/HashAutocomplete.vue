<template>
  <Mentionable :keys="['#']" :items="hashtags">
    <slot></slot>
  </Mentionable>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

import { Mentionable } from "vue-mention";

@Component({ components: { Mentionable } })
export default class HashAutocomplete extends Vue {
  public hashtags: any[] = [];

  mounted() {
    this.fetchHashtags();
  }

  async fetchHashtags() {
    this.hashtags = await (await fetch("/hashtags")).json();
  }
}
</script>