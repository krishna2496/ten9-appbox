<script lang="ts">
import { defineComponent, nextTick, ref, watch } from '@vue/composition-api';

export default defineComponent({
  name: 'Model',
  props: {
    isShow: Boolean,
    xml: {
      required: true,
      type: String,
    },
  },
  setup(props, ctx) {
    const xmlData = ref(null);

    watch(
      () => props.isShow,
      (val) => {
        nextTick(() => {
          if (val) {
            ctx.refs.btn.click();
          }
        });
      },
    );

    watch(
      () => props.xml,
      (val: string) => {
        xmlData.value = val;
      },
    );

    function closeModal() {
      ctx.emit('modelClose');
    }

    function apply() {
      ctx.emit('setGraphData', xmlData);
    }

    return {
      apply,
      closeModal,
      xmlData,
    };
  },
});
</script>

<template lang="pug">
div
  b-modal#modal(v-if='isShow', no-close-on-backdrop='')
    template(#modal-header='')
      h4 Edit Diagram
    .mw-100
      textarea(cols='50', rows='10', v-model='xmlData') {{ xmlData }}
    template(#modal-footer='')
      button.btn.btn-default(type='button', data-dismiss='modal', @click='closeModal')
        | Close
      button.btn.btn-primary(type='button', data-dismiss='modal', @click='apply')
        | Ok
  button(v-b-modal='\'modal\'', ref='btn')
</template>
