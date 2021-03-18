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
import { Sketch } from 'vue-color';
const { mxEventSource } = require('../../lib/jgraph/mxClient.js');

interface ColorPickerObject {
  type?: string;
  color?: string;
}

interface ColorPickerEvent {
  getProperty?(propName: string): ColorPickerObject;
}

interface ColorObject {
  hex?: string;
}

export default defineComponent({
  name: 'ColorPickerModal',
  components: {
    'sketch-picker': Sketch,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const show = ref<boolean>(false);

    const colorPickerType = ref<string>('');

    const colors = ref<ColorObject>({
      hex: '#FFFFF',
    });

    function close() {
      show.value = false;
      colors.value = {
        hex: '#FFFFF',
      };
    }

    function openColorPicker(_sender: typeof mxEventSource, event: ColorPickerEvent) {
      show.value = true;
      const options = event.getProperty('options');
      colorPickerType.value = options.type;
      console.log(options.color);
      colors.value.hex = options.color;
    }

    function apply() {
      if (colorPickerType.value === 'Background') {
        props.editorUi.setGraphBackgroundColor(colors.value.hex);
      } else if (colorPickerType.value === 'Grid') {
        props.editorUi.setGridColor(colors.value.hex);
      } else if (colorPickerType.value === 'Fill') {
        props.editorUi.setShapeColor('fillColor', colors.value.hex);
      } else if (colorPickerType.value === 'Gradient') {
        props.editorUi.setShapeColor('gradientColor', colors.value.hex);
      } else if (colorPickerType.value === 'Line') {
        props.editorUi.setShapeColor('strokeColor', colors.value.hex);
      } else if (colorPickerType.value === 'Font Color') {
        props.editorUi.setShapeColor('fontColor', colors.value.hex);
      } else if (colorPickerType.value === 'Background Color') {
        props.editorUi.setShapeColor('labelBackgroundColor', colors.value.hex);
      }
      close();
    }
    onMounted(() => {
      props.editorUi.addListener('openColorPicker', openColorPicker);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openColorPicker);
    });

    return {
      apply,
      close,
      colors,
      colorPickerType,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal(:visible='show', no-close-on-backdrop='', @close='close', @hide='close', no-fade)
  template(v-slot:modal-header)
    h4 Select Color
    i.fa.fa-times(aria-hidden='true', @click='close')
  .row.justify-content-center
    sketch-picker(v-model='colors')
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
