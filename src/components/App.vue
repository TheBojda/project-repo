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
import { getAuth, Auth, User, Unsubscribe } from "firebase/auth";

import { isBrowser } from "../utils/ssr_utils";
import config from "../config.json";

import SearchPage from "../pages/SearchPage.vue";
import ProjectPage from "../pages/ProjectPage.vue";
import ProjectEditorPage from "../pages/ProjectEditorPage.vue";
import DraftsPage from "../pages/DraftsPage.vue";

import LoginModal from "./LoginModal.vue";
import TopNavigation from "./TopNavigation.vue";

@Options({
  components: {
    SearchPage,
    ProjectPage,
    ProjectEditorPage,
    DraftsPage,
    TopNavigation,
    LoginModal,
  },
})
export default class App extends Vue {
  public path = "";

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

    const firebaseAuth = getAuth(initializeApp(config.firebaseConfig));
    this.loginModal.init(firebaseAuth);
    firebaseAuth.onAuthStateChanged(async (user) => {
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
    if (this.path.startsWith("/drafts")) return DraftsPage;
    if (this.path.startsWith("/preview")) return ProjectPage;
  }

  showLoginModal() {
    this.loginModal?.show();
  }

  logout() {
    const firebaseAuth = getAuth(initializeApp(config.firebaseConfig));
    firebaseAuth.signOut();
  }

  getCurrentUser() {
    const firebaseAuth = getAuth(initializeApp(config.firebaseConfig));
    return new Promise<User | null>((resolve, reject) => {
      if (firebaseAuth.currentUser) resolve(firebaseAuth.currentUser);
      const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
        (unsubscribe as Unsubscribe)();
        resolve(user);
      }, reject);
    });
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
