<script lang="ts">
import { defineComponent, nextTick ,ref, watch } from '@vue/composition-api';

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
            const modal: any = ctx.refs.pageScale;
            modal.show();
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
      ctx.emit('setPageScale', xmlData);
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
  b-modal#modal(no-close-on-backdrop='' ref="pageScale")
    template(#modal-header='')
    .mw-100
      label Page Scale (%):
      input(type='text' value='100')
    template(#modal-footer='')
      button.btn.btn-default(type='button', @click='closeModal')
        | Close
      button.btn.btn-primary(type='button', @click='apply')
        | Ok
</template>