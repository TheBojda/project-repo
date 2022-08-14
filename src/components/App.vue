<template>
  <div>
    <top-navigation
      @showLoginModal="showLoginModal"
      @logout="logout"
      ref="topNavigation"
    />
    <main role="main" class="container">
      <component :is="path == '/' ? 'search-page' : 'project-page'"></component>
    </main>
    <div class="footer"></div>
    <login-modal ref="loginModal" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useSSRContext } from "vue";
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

import { isBrowser } from "../utils/SSRUtils.js";
import config from "../config.json";

import SearchPage from "../pages/SearchPage.vue";
import ProjectPage from "../pages/ProjectPage.vue";

import LoginModal from "./LoginModal.vue";
import TopNavigation from "./TopNavigation.vue";

@Options({
  components: { SearchPage, ProjectPage, TopNavigation, LoginModal },
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

  showLoginModal() {
    this.loginModal?.show();
  }

  logout() {
    this.firebaseAuth?.signOut();
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-size: cover;
  background-image: url("../../public/res/background.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>