<template>
  <div>
    <div style="margin-top: 1rem; display: none">
      <span class="badge bg-primary tag-badge">Makerspace</span>
      <span class="badge bg-primary tag-badge">Community project</span>
    </div>
    <div style="height: 1rem"></div>
    <div class="accordion">
      <div class="accordion-item">
        <div class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#categoryCollapse"
            aria-expanded="false"
          >
            <strong>Choose minimum 1 category.</strong> &nbsp; To select
            categories, click here!
          </button>
        </div>
        <div
          id="categoryCollapse"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <label for="categoryFilter" class="form-label"
              >Category filter</label
            >
            <input
              id="categoryFilter"
              type="text"
              class="form-control search-edit"
              placeholder="Start typing to filter categories!"
            />
            <div style="height: 1rem"></div>
            <span class="badge bg-secondary tag-badge">Makerspace</span>
            <span class="badge bg-secondary tag-badge">Community project</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class CategorySelector extends Vue {}
</script>

<style scoped>
.tag-badge {
  margin-top: 2px;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  cursor: default;
}
</style>