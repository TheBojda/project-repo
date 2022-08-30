<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <div class="mb-3">
          <h1>
            <label for="title" class="form-label">Project title</label>
            <input
              type="text"
              class="form-control"
              id="title"
              placeholder="Example project title"
            />
          </h1>
        </div>
        <div class="mb-3">
          <h2>
            <label for="short_description" class="form-label"
              >Short description</label
            >
            <textarea
              class="form-control"
              id="short_description"
              rows="3"
              placeholder="Short description of the project"
            ></textarea>
          </h2>
        </div>
        <div class="mb-3">
          <h2>
            <label for="description" class="form-label">Description</label>
            <textarea
              class="form-control"
              id="description"
              rows="3"
              placeholder="Description of the project"
            ></textarea>
          </h2>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class ProjectEditorPage extends Vue {}
</script>
