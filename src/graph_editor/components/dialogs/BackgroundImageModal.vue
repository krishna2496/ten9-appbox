<!--
* ten9, Inc
* Copyright (c) 2015 - 2020 ten9, Inc
* -----
* NOTICE:  All information contained herein is, and remains
* the property of ten9 Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to ten9 Incorporated
* and its suppliers and may be covered by U.S. and Foreign Patents,
* patents in process, and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from ten9 Incorporated.
* -----
-->

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
const { mxImage } = require('../../lib/jgraph/mxClient');
export default defineComponent({
  name: 'BackgroundImageModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const show = ref<boolean>(false);

    const imageUrl = ref('');

    const imageHeight = ref<number>(0);

    const imageWidth = ref<number>(0);

    function close() {
      show.value = false;
    }

    function openBackgroundImage() {
      show.value = true;
    }

    function reset() {
      imageUrl.value = '';
      imageHeight.value = 0;
      imageWidth.value = 0;
    }

    function done(url: string) {
      const applyFn = props.editorUi.editor.graph.backgroundImage;
      applyFn(
        url != '' && url != null
          ? new mxImage(imageUrl.value, imageWidth.value, imageHeight.value)
          : null,
        url == null,
      );
    }
    function apply() {
      props.editorUi.loadImage(
        imageUrl.value,
        (img: ImageData) => {
          imageWidth.value = img.width;
          imageHeight.value = img.height;
          if (done != null) {
            done(imageUrl.value);
          }
        },
        () => {
          props.editorUi.showError(
            //   mxResources.get('error'),
            //   mxResources.get('fileNotFound'),
            //   mxResources.get('ok'),
            alert('error'),
          );
          imageWidth.value = 0;
          imageHeight.value = 0;

          if (done != null) {
            done(null);
          }
        },
      );
      close();
    }
    onMounted(() => {
      props.editorUi.addListener('openBackgroundImage', openBackgroundImage);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openBackgroundImage);
    });

    return {
      apply,
      close,
      imageHeight,
      imageUrl,
      imageWidth,
      openBackgroundImage,
      reset,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal(:visible='show', no-close-on-backdrop='', @close='close', @hide='close', no-fade)
  template(v-slot:modal-header)
    h4 Background Image
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .image-container
    .row
      .col-md-12.pl-5
        label Image URL:
        input.image-url(type='text', v-model='imageUrl')
    .row.image-cordinate
      .col
        label.text-box-label Width:
        input.text-box(type='text', v-model='imageWidth')
      .col
        label.text-box-label Height:
        input.text-box(type='text', v-model='imageHeight')
      .col
        button.btn.btn-default(type='button', @click='reset') Reset
  template(v-slot:modal-footer)
    button.btn.btn-grey(@click='close') Cancel
    button.btn.btn-primary(@click='apply') Apply
</template>

<style lang="scss" scoped>
.image-url {
  width: 370px;
}
.text-box {
  width: 100px;
}
.text-box-label {
  margin-bottom: 0;
}
.image-cordinate {
  align-items: center;
}
</style>
