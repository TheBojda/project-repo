<template>
  <modal-dialog ref="modal">
    <template #title> Sign Up / Sign In </template>
    <div id="firebaseui-auth-container"></div>
  </modal-dialog>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-facing-decorator";
import ModalDialog from "./ModalDialog.vue";
import { EmailAuthProvider, GoogleAuthProvider, Auth } from "firebase/auth";

@Component({ components: { ModalDialog } })
export default class LoginModal extends Vue {
  @Ref
  private modal!: ModalDialog;

  init(firebaseAuth: Auth) {
    const firebaseui = require("firebaseui");
    let ui = new firebaseui.auth.AuthUI(firebaseAuth);
    ui.start("#firebaseui-auth-container", {
      signInSuccessUrl: window.location.href,
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
    this.modal.show();
  }
}
</script>