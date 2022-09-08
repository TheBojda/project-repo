<template>
  <div>
    <div style="margin-top: 1rem">
      <span
        class="badge bg-primary tag-badge"
        v-for="key in selectedCategories"
        :key="key"
        @click="removeCategory(key)"
        >{{ categories[key] }}</span
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
            <strong v-if="selectedCategories.length == 0"
              >Choose minimum 1 category.</strong
            >
            &nbsp; To select categories, click here!
          </button>
        </div>
        <div id="categoryCollapse" class="accordion-collapse collapse">
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
import { Options, Vue } from "vue-class-component";

@Options({ props: ["modelValue"] })
export default class CategorySelector extends Vue {
  public categories = {};
  public selectedCategories: string[] = [];

  created() {
    this.$watch(
      "modelValue",
      (val) => {
        this.selectedCategories = val;
      },
      { immediate: true }
    );
  }

  mounted() {
    this.init();
  }

  async init() {
    this.categories = await (await fetch("config/categories.json")).json();
  }

  selectCategory(key) {
    if (this.selectedCategories.indexOf(key) != -1) return;
    this.selectedCategories.push(key);
    this.$emit("update:modelValue", this.selectedCategories);
  }

  removeCategory(key) {
    this.selectedCategories.splice(this.selectedCategories.indexOf(key), 1);
    this.$emit("update:modelValue", this.selectedCategories);
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