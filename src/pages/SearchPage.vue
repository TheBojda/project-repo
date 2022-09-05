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
        <div class="input-group search-input">
          <div class="input-group-prepend" id="service-button-addon4">
            <button
              id="service-add-tag"
              class="btn btn-secondary mapTargetButton"
              type="button"
            >
              <i class="fas fa-map-marker-alt"></i>
            </button>
          </div>
          <input
            id="service-search-input"
            type="text"
            class="form-control search-edit"
            placeholder="Search our repository for world-changing projects"
          />
        </div>
        <category-selector></category-selector>
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
import CategorySelector from "../components/CategorySelector.vue";

@Options({
  components: { CategorySelector },
})
export default class SearchPage extends Vue {}
</script>

<style scoped>
a {
  color: black;
  text-decoration: none;
  font-style: italic;
}
</style>