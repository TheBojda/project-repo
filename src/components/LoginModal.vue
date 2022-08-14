<template>
  <div id="login-modal" class="modal" tabindex="-1" ref="loginModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Sign Up / Sign In</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div id="firebaseui-auth-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Modal } from "bootstrap";
import { EmailAuthProvider, GoogleAuthProvider, Auth } from "firebase/auth";

@Options({})
export default class LoginModal extends Vue {
  private modal?: Modal;

  mounted() {
    // bootstrap should be included only on browser side
    const bootstrap = require("bootstrap");
    this.modal = new bootstrap.Modal(this.$refs.loginModal as Element);
  }

  init(firebaseAuth: Auth) {
    // firebaseui should be included only on browser side
    const firebaseui = require("firebaseui");
    let ui = new firebaseui.auth.AuthUI(firebaseAuth);
    ui.start("#firebaseui-auth-container", {
      signInSuccessUrl: "http://localhost:3000/",
      signInOptions: [
        {
          provider: EmailAuthProvider.PROVIDER_ID,
          signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        },
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
        },
      ],
    });
  }

  show() {
    this.modal?.show();
  }
}
</script>