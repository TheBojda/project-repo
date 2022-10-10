<template>
  <div>
    <div style="margin-top: 1rem">
      <span
        class="badge bg-primary tag-badge"
        v-if="selectedCategory"
        @click="removeCategory(selectedCategory)"
        >{{ categories[selectedCategory] }}</span
      >
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
            <strong v-if="!selectedCategory">Choose a category.</strong>
            &nbsp; To select category, click here!
          </button>
        </div>
        <div id="categoryCollapse" class="accordion-collapse collapse">
          <div class="accordion-body">
            <!--
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
            -->
            <span
              class="badge bg-secondary tag-badge"
              v-for="(value, key) in categories"
              :key="key"
              @click="selectCategory(key)"
              >{{ value }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-facing-decorator";

@Component
export default class CategorySelector extends Vue {
  public categories = {};
  public selectedCategory: string = "";

  @Prop
  public modelValue: string = "";

  mounted() {
    this.init();
  }

  @Watch("modelValue", { immediate: true })
  modelValueWatcher(val: string) {
    this.selectedCategory = val ? val : "";
  }

  async init() {
    this.categories = await (await fetch("config/categories.json")).json();
  }

  @Emit("update:modelValue")
  selectCategory(key) {
    this.selectedCategory = key;
    return this.selectedCategory;
  }

  @Emit("update:modelValue")
  removeCategory(key) {
    this.selectedCategory = "";
    return this.selectedCategory;
  }
}
</script>

<style scoped>
.tag-badge {
  margin-top: 2px;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  cursor: default;
}
</style>