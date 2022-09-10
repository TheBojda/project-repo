<template>
  <div>
    <top-navigation
      @showLoginModal="showLoginModal"
      @logout="logout"
      ref="topNavigation"
    />
    <component :is="getMainComponent()"></component>
    <div class="footer"></div>
    <login-modal ref="loginModal" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useSSRContext } from "vue";
import { initializeApp } from "firebase/app";
import { getAuth, Auth, User } from "firebase/auth";

import { isBrowser } from "../utils/SSRUtils.js";
import config from "../config.json";

import SearchPage from "../pages/SearchPage.vue";
import ProjectPage from "../pages/ProjectPage.vue";
import ProjectEditorPage from "../pages/ProjectEditorPage.vue";

import LoginModal from "./LoginModal.vue";
import TopNavigation from "./TopNavigation.vue";

@Options({
  components: {
    SearchPage,
    ProjectPage,
    ProjectEditorPage,
    TopNavigation,
    LoginModal,
  },
})
export default class App extends Vue {
  public path = "";

  private firebaseAuth?: Auth;

  private loginModal?: LoginModal;
  private topNavigation?: TopNavigation;

  created() {
    if (!isBrowser()) {
      const context = useSSRContext();
      this.path = context?.path;
    } else {
      this.path = window.location.pathname;
    }
  }

  mounted() {
    this.loginModal = this.$refs.loginModal as LoginModal;
    this.topNavigation = this.$refs.topNavigation as TopNavigation;

    this.firebaseAuth = getAuth(initializeApp(config.firebaseConfig));
    this.loginModal.init(this.firebaseAuth);
    this.firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        this.topNavigation?.setUser(user);
      } else {
        this.topNavigation?.setUser(null);
      }
    });
  }

  getMainComponent() {
    if (this.path == "/") return SearchPage;
    if (this.path.startsWith("/project/")) return ProjectPage;
    if (this.path.startsWith("/project_editor")) return ProjectEditorPage;
  }

  showLoginModal() {
    this.loginModal?.show();
  }

  logout() {
    this.firebaseAuth?.signOut();
  }

  getCurrentUser() {
    return this.firebaseAuth?.currentUser;
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
