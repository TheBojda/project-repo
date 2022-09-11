<template>
  <div>
    <div>
      <div class="row mb-2 link-line" v-for="(link, idx) in links" :key="idx">
        <div class="col">
          <i class="link-icon" :class="getIcon(link.url)"></i>
          {{ link.description }} -
          <a :href="link.url" target="_blank">{{ link.url }}</a>
        </div>
        <div class="col-sm-2">
          <button class="btn btn-danger" @click="removeLink(idx)">
            Remove link
          </button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <input
          type="text"
          v-model="description"
          class="form-control"
          placeholder="Type the description of your link"
        />
      </div>
      <div class="col">
        <input
          type="text"
          v-model="url"
          class="form-control"
          placeholder="Type your link"
        />
      </div>
      <div class="col-sm-2">
        <button class="btn btn-primary" @click="addLink">
          <i class="fa fa-circle-plus"></i> Add link
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

class Link {
  public url = "";
  public description = "";
}

@Options({ props: ["modelValue"] })
export default class LinkEditor extends Vue {
  public url = "";
  public description = "";
  public links = [] as Link[];

  created() {
    this.$watch(
      "modelValue",
      (val) => {
        this.links = val ? val : [];
      },
      { immediate: true }
    );
  }
  addLink() {
    let link = new Link();
    link.url = this.url;
    link.description = this.description;
    this.links.push(link);
    this.url = "";
    this.description = "";
    this.$emit("update:modelValue", this.links);
  }

  removeLink(idx) {
    this.links.splice(idx, 1);
    this.$emit("update:modelValue", this.links);
  }

  getIcon(url) {
    if (url.startsWith("https://github")) return "fab fa-square-github";
    if (url.startsWith("https://youtube.com")) return "fab fa-square-youtube";
    if (url.startsWith("https://facebook.com")) return "fab fa-square-facebook";
    return "fa fa-external-link-square";
  }
}
</script>

<style scoped>
.link-line {
  font-size: 1.2em;
}
.link-icon {
  color: #08c;
}
a {
  color: black;
  text-decoration: none;
  font-style: italic;
}
</style>
