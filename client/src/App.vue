<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light bg-transparent">
    <button class="navbar-toggler" type="button" @click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" ref="navbar">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">
            How it works?
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            Who we are?
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link loginButton" href="#">
            Sign Up / Sign In
          </a>
        </li>
        <li id="userContainer" class="nav-item" style="display: none">
          <a
            id="userButton"
            class="nav-link"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              id="profileImage"
              width="40"
              height="40"
              class="d-inline-block align-top profile-image"
            />
          </a>
          <div
            class="dropdown-menu profileDropDown"
            aria-labelledby="userButton"
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
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "./components/HelloWorld.vue";
import { Collapse } from "bootstrap";

@Options({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  private navbar: Collapse = {} as Collapse;

  mounted() {
    console.log("mounted");
    this.navbar = new Collapse(this.$refs.navbar as Element, { toggle: false });
  }

  toggleNavbar() {
    this.navbar.toggle();
  }
}
</script>

<style>
.navbar {
  font-family: "Montserrat" sans-serif;
  font-size: 22px;
  color: whitesmoke;
}
</style>
