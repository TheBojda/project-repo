<template>
  <div class="row">
    <div class="col-sm-2">
      <button class="btn btn-primary">
        <i class="fa fa-circle-plus"></i> Add link
      </button>
    </div>
    <div class="col">
      <input
        type="text"
        class="form-control"
        placeholder="Type your project page link, facebook group, GitHub repo, contact links, etc."
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class LinkEditor extends Vue {}
</script>
