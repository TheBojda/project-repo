<template>
  <div>
    <top-navigation
      @showLoginModal="showLoginModal"
      @logout="logout"
      ref="topNavigation"
    />
    <main role="main" class="container"></main>
    <div class="footer"></div>
    <login-modal ref="loginModal" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import config from "../config.json";

import LoginModal from "./LoginModal.vue";
import TopNavigation from "./TopNavigation.vue";

@Options({
  components: { TopNavigation, LoginModal },
})
export default class App extends Vue {
  private firebaseAuth?: Auth;

  private loginModal?: LoginModal;
  private topNavigation?: TopNavigation;

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
</style>
