<template>
  <main role="main" class="container">
    <div style="padding-top: 7rem" class="d-none d-lg-block"></div>
    <div class="row justify-content-md-center">
      <div class="col-lg-8">
        <h1 class="text-center">ENVIENTA</h1>
        <div style="height: 1rem"></div>
        <h4>
          The aim of the this project portal is collecting world-changing
          projects from the whole world, that follows the open source philosophy
          of ENVIENTA.
        </h4>
        <div style="height: 1rem"></div>
        <div class="input-group search-input">
          <input
            id="service-search-input"
            type="text"
            class="form-control search-edit"
            placeholder="Search our repository for world-changing projects"
          />
        </div>
        <div style="height: 1rem"></div>
        <div id="service-results"></div>
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

@Options({})
export default class SearchPage extends Vue {}
</script>