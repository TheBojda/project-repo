<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <table class="table align-middle">
      <tbody>
        <tr v-for="(draft, idx) in drafts" :key="idx">
          <td style="width: 40px">
            <img
              :src="
                'https://www.gravatar.com/avatar/' + draft.avatar_hash + '?s=40'
              "
              width="40"
              height="40"
              class="d-inline-block align-top profile-image"
            />
          </td>
          <td>{{ draft.content.title }}</td>
          <td class="col-3">
            <button type="button" class="btn btn-dark mx-1">Preview</button>
            <button type="button" class="btn btn-success mx-1">Accept</button>
            <button type="button" class="btn btn-danger mx-1">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>


<script lang="ts">
import { Options, Vue } from "vue-class-component";

import App from "../components/App.vue";

@Options({})
export default class DraftsPage extends Vue {
  public drafts: any[] = [];

  mounted() {
    this.init();
  }

  async init() {
    const user = await (this.$root as App).getCurrentUser();
    if (!user) return;
    const userToken = await user.getIdToken(true);
    const response = await (
      await fetch("/api/getDrafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userToken: userToken,
        }),
      })
    ).json();
    console.log(response);
    this.drafts = response;
  }
}
</script>