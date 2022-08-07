<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light bg-transparent">
    <button class="navbar-toggler" type="button" @click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" ref="navbar">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#"> How it works? </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#"> Who we are? </a>
        </li>
        <li class="nav-item" v-if="!user">
          <a class="nav-link loginButton" href="#" @click="showLoginModal">
            Sign Up / Sign In
          </a>
        </li>
        <li class="nav-item" v-if="user">
          <a class="nav-link" href="#" @click="toggleUserMenu">
            <img
              id="profileImage"
              :src="userPhotoURL"
              width="40"
              height="40"
              class="d-inline-block align-top profile-image"
            />
          </a>
          <div
            class="dropdown-menu profileDropDown"
            aria-labelledby="userButton"
            ref="userMenu"
          >
            <a class="dropdown-item" href="profile/" target="_blank"
              ><span data-localize="profile">Profile</span></a
            >
            <a class="dropdown-item logoutButton" href="#"
              ><span data-localize="logoff">Log Off</span></a
            >
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <main role="main" class="container"></main>
  <div class="footer"></div>
  <login-modal ref="loginModal"></login-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { Collapse, Dropdown } from "bootstrap";
import * as md5 from "md5";

import LoginModal from "./components/LoginModal.vue";

@Options({
  components: { LoginModal },
})
export default class App extends Vue {
  private navbar: Collapse = {} as Collapse;
  private userMenu: Dropdown = {} as Dropdown;
  private firebaseApp: FirebaseApp = {} as FirebaseApp;

  public user: User = {} as User;
  public userPhotoURL = "";

  created() {
    this.firebaseApp = initializeApp({
      apiKey: "AIzaSyDlc9pnPh4jmzg43KRdBrqCkK6117G6p8I",
      authDomain: "test-project-8440d.firebaseapp.com",
      databaseURL: "https://test-project-8440d.firebaseio.com",
      projectId: "test-project-8440d",
      storageBucket: "test-project-8440d.appspot.com",
      messagingSenderId: "1061585054183",
      appId: "1:1061585054183:web:311b7c4a04a3d1ab8a3542",
    });

    getAuth(this.firebaseApp).onAuthStateChanged(async (user) => {
      if (user) {
        this.user = user;
        this.userPhotoURL =
          "https://www.gravatar.com/avatar/" + md5(user.email) + "?s=40";
      } else {
        console.log("No user is signed in.");
      }
    });
  }

  mounted() {
    this.navbar = new Collapse(this.$refs.navbar as Element, { toggle: false });
    this.userMenu = new Dropdown(this.$refs.userMenu as Element);
    (this.$refs.loginModal as LoginModal).init(this.firebaseApp);
  }

  toggleNavbar() {
    this.navbar.toggle();
  }

  toggleUserMenu() {
    this.userMenu.toggle();
  }

  showLoginModal() {
    (this.$refs.loginModal as LoginModal).show();
  }
}
</script>

<style>
.navbar {
  font-family: "Montserrat" sans-serif;
  font-size: 22px;
  color: whitesmoke;
}
.profileDropDown {
  left: auto !important;
  right: 1rem;
}
</style>
