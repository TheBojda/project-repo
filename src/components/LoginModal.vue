<template>
  <modal-dialog ref="modal">
    <template #title> Sign Up / Sign In </template>
    <div id="firebaseui-auth-container"></div>
  </modal-dialog>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ModalDialog from "./ModalDialog.vue";
import { EmailAuthProvider, GoogleAuthProvider, Auth } from "firebase/auth";

@Options({ components: { ModalDialog } })
export default class LoginModal extends Vue {
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
    (this.$refs.modal as ModalDialog).show();
  }
}
</script>