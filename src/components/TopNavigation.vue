<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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
        <li class="nav-item" v-show="!userPhotoURL">
          <a class="nav-link" href="#" @click="showLoginModal">
            Sign Up / Sign In
          </a>
        </li>
        <li class="nav-item" v-show="userPhotoURL">
          <a class="nav-link" href="#" @click="toggleUserMenu">
            <img
              id="profileImage"
              :src="userPhotoURL"
              width="40"
              height="40"
              class="d-inline-block align-top profile-image"
            />
          </a>
          <div class="dropdown-menu profileDropDown" ref="userMenu">
            <a class="dropdown-item" href="profile/" target="_blank">Profile</a>
            <a class="dropdown-item" href="#" @click="logout">Log Off</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { User } from "firebase/auth";
import { Collapse, Dropdown } from "bootstrap";
import * as md5 from "md5";

@Options({})
export default class TopNavigation extends Vue {
  public userPhotoURL = "";

  private navbar?: Collapse;
  private userMenu?: Dropdown;

  setUser(user: User | any) {
    if (user) {
      this.userPhotoURL =
        "https://www.gravatar.com/avatar/" + md5(user.email) + "?s=40";
    } else {
      this.userPhotoURL = "";
    }
  }

  mounted() {
    // bootstrap should be included only on browser side
    const bootstrap = require("bootstrap");
    this.navbar = new bootstrap.Collapse(this.$refs.navbar as Element, {
      toggle: false,
    });
    this.userMenu = new bootstrap.Dropdown(this.$refs.userMenu as Element);
  }

  toggleNavbar() {
    this.navbar?.toggle();
  }

  toggleUserMenu() {
    this.userMenu?.toggle();
  }

  showLoginModal() {
    this.$emit("showLoginModal");
  }

  logout() {
    this.$emit("logout");
  }
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