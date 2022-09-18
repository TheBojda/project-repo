<template>
  <main role="main" class="container">
    <div style="padding-top: 1rem" class="d-none d-lg-block"></div>
    <h1>Projects</h1>
    <p v-if="projects.length == 0">
      You don't have any project yet.
      <a href="/project_editor">Register</a> your project or local community on
      our site to make it visible to the whole world.
    </p>
    <table class="table align-middle">
      <tbody>
        <tr v-for="(project, idx) in projects" :key="idx">
          <td style="width: 40px">
            <img
              :src="
                'https://www.gravatar.com/avatar/' +
                project.avatar_hash +
                '?s=40'
              "
              width="40"
              height="40"
              class="d-inline-block align-top profile-image"
            />
          </td>
          <td>{{ project.content.title }}</td>
          <td class="col-4 text-end">
            <a
              type="button"
              class="btn btn-dark mx-1"
              :href="`/project/${project.slug}`"
              target="_blank"
            >
              Preview
            </a>
            <a
              type="button"
              class="btn btn-primary mx-1"
              href="#"
              @click="editProject(project.slug)"
            >
              Edit
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="drafts.length > 0">
      <h1>Drafts</h1>
      <table class="table align-middle">
        <tbody>
          <tr v-for="(draft, idx) in drafts" :key="idx">
            <td style="width: 40px">
              <img
                :src="
                  'https://www.gravatar.com/avatar/' +
                  draft.avatar_hash +
                  '?s=40'
                "
                width="40"
                height="40"
                class="d-inline-block align-top profile-image"
              />
            </td>
            <td>{{ draft.content.title }}</td>
            <td class="col-4 text-end">
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
    </div>
  </main>
</template>


<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { callApi } from "../utils/api_utils";

import App from "../components/App.vue";

@Options({})
export default class DraftsPage extends Vue {
  public drafts: any[] = [];
  public projects: any[] = [];
  public role = "user";

  mounted() {
    this.init();
  }

  async init() {
    const user = await (this.$root as App).getCurrentUser();
    if (!user) return;
    const userToken = await user.getIdToken(true);
    const response_drafts = await callApi("/api/getDrafts", {
      userToken: userToken,
    });
    this.drafts = response_drafts.drafts;
    this.role = response_drafts.role;
    const response_projects = await callApi("/api/getProjects", {
      userToken: userToken,
    });
    this.projects = response_projects.projects;
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

  async editProject(slug: string) {
    const user = await (this.$root as App).getCurrentUser();
    const userToken = await user?.getIdToken(true);
    await (this as any).$recaptchaLoaded();
    const captchaToken = await (this as any).$recaptcha("login");

    const response = await callApi("/api/createDraftForProject", {
      userToken: userToken,
      captchaToken: captchaToken,
      slug: slug,
    });

    window.location.href = `/project_editor?draftId=${response.id}`;
  }
}
</script>