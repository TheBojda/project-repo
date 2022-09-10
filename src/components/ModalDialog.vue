<template>
  <div class="modal" tabindex="-1" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <slot name="title"></slot>
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Modal } from "bootstrap";

@Options({})
export default class ModalDialog extends Vue {
  private modal?: Modal;

  mounted() {
    const bootstrap = require("bootstrap");
    this.modal = new bootstrap.Modal(this.$refs.modal as Element);
  }

  show() {
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }
}
</script>