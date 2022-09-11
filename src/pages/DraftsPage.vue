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
          <td class="col-3 text-end">
            <span class="badge bg-success" v-if="draft.state == 'accepted'"
              >Accepted</span
            >
            <span class="badge bg-danger" v-if="draft.state == 'rejected'"
              >Rejected</span
            >
            <a
              type="button"
              class="btn btn-dark mx-1"
              :href="'/preview?draftId=' + draft.id"
              target="_blank"
            >
              Preview
            </a>
            <a
              type="button"
              class="btn btn-primary mx-1"
              :href="'/project_editor?draftId=' + draft.id"
              target="_blank"
            >
              Edit
            </a>
            <button
              type="button"
              class="btn btn-success mx-1"
              @click="setDraftState(draft.id, 'accepted')"
              v-if="role == 'admin'"
            >
              Accept
            </button>
            <button
              type="button"
              class="btn btn-danger mx-1"
              @click="setDraftState(draft.id, 'rejected')"
              v-if="role == 'admin'"
            >
              Reject
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>


<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { callApi } from "../utils/api_utils";

import App from "../components/App.vue";

@Options({})
export default class DraftsPage extends Vue {
  public drafts: any[] = [];
  public role = "user";

  mounted() {
    this.init();
  }

  async init() {
    const user = await (this.$root as App).getCurrentUser();
    if (!user) return;
    const userToken = await user.getIdToken(true);
    const response = await callApi("/api/getDrafts", {
      userToken: userToken,
    });
    this.drafts = response.drafts;
    this.role = response.role;
  }

  async setDraftState(id: number, state: string) {
    const user = await (this.$root as App).getCurrentUser();
    if (!user) return;
    const userToken = await user.getIdToken(true);
    await callApi("/api/setDraftState", {
      userToken: userToken,
      id: id,
      state: state,
    });
    this.init();
  }
}
</script>