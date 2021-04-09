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
const { mxImage, mxResources, mxUtils } = require('../../lib/jgraph/mxClient');

interface ImageDimension {
  height: number;
  width: number;
}

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

    const imageUrl = ref<string>('');

    const imageHeight = ref<number>(null);

    const imageWidth = ref<number>(null);

    function close() {
      show.value = false;
    }

    function openBackgroundImage() {
      show.value = true;
    }

    function reset() {
      imageUrl.value = '';
      imageHeight.value = null;
      imageWidth.value = null;
    }

    function loadUrl() {
      props.editorUi.loadImage(
        imageUrl.value,
        (img: ImageDimension) => {
          imageWidth.value = img.width;
          imageHeight.value = img.height;
        },
        () => {
          throw new Error(mxResources.get('fileNotFound'));
        },
      );
    }

    function urlChanged(evt: EventHandlerNonNull, execute: FunctionStringCallback) {
      // Skips blur event if called from apply button
      if (evt == null) {
        imageUrl.value = mxUtils.trim(imageUrl.value);

        if (imageUrl.value != '' && !props.editorUi.isOffline()) {
          props.editorUi.loadImage(
            imageUrl.value,
            (img: ImageDimension) => {
              imageWidth.value = img.width;
              imageHeight.value = img.height;

              if (execute != null) {
                execute(imageUrl.value);
              }
            },
            () => {
              imageWidth.value = null;
              imageHeight.value = null;

              if (execute != null) {
                execute(null);
              }
            },
          );
        } else {
          imageWidth.value = null;
          imageHeight.value = null;

          if (execute != null) {
            execute('');
          }
        }
      }
    }

    function done() {
      const applyFn = mxUtils.bind(props.editorUi, (image: ImageDimension, failed: string) => {
        if (!failed) {
          props.editorUi.setBackgroundImage(image);
        }
      });

      urlChanged(null, (newurl: string) => {
        applyFn(
          newurl != '' && newurl != null
            ? new mxImage(imageUrl.value, imageWidth.value, imageHeight.value)
            : null,
          newurl == null,
        );
      });
    }
    function apply() {
      props.editorUi.loadImage(
        imageUrl.value,
        (img: ImageDimension) => {
          imageWidth.value = img.width;
          imageHeight.value = img.height;
          if (done != null) {
            done();
          }
        },
        () => {
          imageWidth.value = 0;
          imageHeight.value = 0;

          if (done != null) {
            done();
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
      loadUrl,
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
    i.fa.fa-times(aria-hidden='true', @click='close')
  .image-container
    .row
      .col-md-12.pl-5
        label Image URL:
      .col-md-12.pl-5
        input.txt-input.w-90(type='text', v-model='imageUrl', @change='loadUrl')
    .row.background-image-cordinate.mt-3.pl-5
      label.mt-1.text-box-label Width:
      input.ml-2.txt-input.w-20(type='text', v-model='imageWidth')
      label.ml-2.mt-1.text-box-label Height:
      input.ml-2.txt-input.w-20(type='text', v-model='imageHeight')
      button.ml-4.btn.btn-default(type='button', @click='reset') Reset
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
