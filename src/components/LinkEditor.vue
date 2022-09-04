<template>
  <div>
    <div class="row mb-1 link-line" style="display: none">
      <div class="col">
        <i class="fa fa-external-link-square link-icon"></i> My project GitHub
        link - <a href="https://github.com">https://github.com</a>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input
          type="text"
          class="form-control"
          placeholder="Type the description of your link"
        />
      </div>
      <div class="col">
        <input type="text" class="form-control" placeholder="Type your link" />
      </div>
      <div class="col-sm-2">
        <button class="btn btn-primary">
          <i class="fa fa-circle-plus"></i> Add link
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class LinkEditor extends Vue {}
</script>

<style scoped>
.link-line {
  font-size: 1.5em;
}
.link-icon {
  color: #08c;
}
</style>
