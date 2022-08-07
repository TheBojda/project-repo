<template>
  <top-navigation
    @showLoginModal="showLoginModal"
    @logout="logout"
    ref="topNavigation"
  />
  <main role="main" class="container"></main>
  <div class="footer"></div>
  <login-modal ref="loginModal" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import config from "./config.json";

import LoginModal from "./components/LoginModal.vue";
import TopNavigation from "./components/TopNavigation.vue";

@Options({
  components: { TopNavigation, LoginModal },
})
export default class App extends Vue {
  private firebaseAuth?: Auth;

  mounted() {
    let firebaseApp = initializeApp(config.firebaseConfig);
    this.firebaseAuth = getAuth(firebaseApp);
    (this.$refs.loginModal as LoginModal).init(this.firebaseAuth);
    this.firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        (this.$refs.topNavigation as TopNavigation).setUser(user);
      } else {
        (this.$refs.topNavigation as TopNavigation).setUser(null);
      }
    });
  }

  showLoginModal() {
    (this.$refs.loginModal as LoginModal).show();
  }

  logout() {
    this.firebaseAuth?.signOut();
  }
}
</script>

<style>
</style>
