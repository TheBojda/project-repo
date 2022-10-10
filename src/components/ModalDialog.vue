<template>
  <div class="modal" tabindex="-1" ref="modalDiv">
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
import { Component, Vue, Ref } from "vue-facing-decorator";
import { Modal } from "bootstrap";

@Component
export default class ModalDialog extends Vue {
  private modal?: Modal;

  @Ref
  readonly modalDiv!: HTMLDivElement;

  mounted() {
    const bootstrap = require("bootstrap");
    this.modal = new bootstrap.Modal(this.modalDiv);
  }

  show() {
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }
}
</script>