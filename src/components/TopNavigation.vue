<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <button class="navbar-toggler" type="button" @click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="container">
      <a class="navbar-brand" href="/">ENVIENTA Search</a>
    </div>
    <div class="collapse navbar-collapse" ref="navbarDiv">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#"> How it works? </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#"> Who we are? </a>
        </li>
        <li class="nav-item" v-show="!userPhotoURL">
          <a class="nav-link" href="#" @click="showLoginModal">
            Sign Up / Sign In
          </a>
        </li>
        <li class="nav-item dropdown" v-show="userPhotoURL">
          <a
            class="nav-link"
            href="#"
            @click="toggleUserMenu"
            data-bs-toggle="dropdown"
          >
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
            :class="{ show: userMenuShown }"
            ref="userMenu"
          >
            <a class="dropdown-item" :href="userLinkURL" target="_blank"
              >Profile</a
            >
            <a class="dropdown-item" href="/drafts">Projects & drafts</a>
            <a class="dropdown-item" href="#" @click="logout">Log Off</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue, Ref, Emit } from "vue-facing-decorator";
import { User } from "firebase/auth";
import { Collapse } from "bootstrap";
import * as md5 from "md5";

@Component
export default class TopNavigation extends Vue {
  public userPhotoURL = "";
  public userLinkURL = "";
  public userMenuShown = false;

  private navbar?: Collapse;

  @Ref
  readonly navbarDiv!: HTMLDivElement;

  setUser(user: User | any) {
    if (user) {
      this.userPhotoURL =
        "https://www.gravatar.com/avatar/" + md5(user.email) + "?s=40";
      this.userLinkURL = "https://www.gravatar.com/" + md5(user.email);
    } else {
      this.userPhotoURL = "";
    }
  }

  mounted() {
    const bootstrap = require("bootstrap");
    this.navbar = new bootstrap.Collapse(this.navbarDiv, {
      toggle: false,
    });
  }

  toggleNavbar() {
    this.navbar?.toggle();
  }

  toggleUserMenu() {
    this.userMenuShown = !this.userMenuShown;
  }

  @Emit("showLoginModal")
  showLoginModal() {}

  @Emit("logout")
  logout() {}
}
</script>

<style scoped>
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