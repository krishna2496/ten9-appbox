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
import colorPicker from '@caohenghu/vue-colorpicker';
const { mxEventSource } = require('../../lib/jgraph/mxClient.js');

interface ColorPickerObject {
  type?: string;
  color?: string;
}

interface ColorPickerEvent {
  getProperty?(propName: string): ColorPickerObject;
}

// interface ColorObject {
//   hex?: string;
// }

export default defineComponent({
  name: 'ColorPickerModal',
  components: {
    'color-picker': colorPicker,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const show = ref<boolean>(false);

    const suckerCanvas = ref(null);

    const suckerArea = ref([]);

    const isSucking = ref<boolean>(false);

    const colorPickerType = ref<string>('');

    const color = ref<string>('#FFFFF');

    function close() {
      show.value = false;
      color.value = '#FFFFF';
    }

    function openColorPicker(_sender: typeof mxEventSource, event: ColorPickerEvent) {
      show.value = true;
      const options = event.getProperty('options');
      colorPickerType.value = options.type;
      console.log(options.color);
      color.value = options.color;
    }

    function apply() {
      if (colorPickerType.value === 'Background') {
        props.editorUi.setGraphBackgroundColor(color.value);
      } else if (colorPickerType.value === 'Grid') {
        props.editorUi.setGridColor(color.value);
      } else if (colorPickerType.value === 'Fill') {
        props.editorUi.setShapeColor('fillColor', color.value);
      } else if (colorPickerType.value === 'Gradient') {
        props.editorUi.setShapeColor('gradientColor', color.value);
      } else if (colorPickerType.value === 'Line') {
        props.editorUi.setShapeColor('strokeColor', color.value);
      } else if (colorPickerType.value === 'Font Color') {
        props.editorUi.setShapeColor('fontColor', color.value);
      } else if (colorPickerType.value === 'Background Color') {
        props.editorUi.setShapeColor('labelBackgroundColor', color.value);
      }
      close();
    }
    onMounted(() => {
      props.editorUi.addListener('openColorPicker', openColorPicker);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openColorPicker);
    });

    // function changeColor(colors: string) {
    //   const { r, g, b, a } = colors.rgba;
    //   color.value = `rgba(${r}, ${g}, ${b}, ${a})`;
    // }

    function openSucker(isOpen: boolean) {
      if (isOpen) {
        // ... canvas be created
        // this.suckerCanvas = canvas
        // this.suckerArea = [x1, y1, x2, y2]
      } else {
        // this.suckerCanvas && this.suckerCanvas.remove
      }
    }

    return {
      apply,
      close,
      color,
      colorPickerType,
      //changeColor,
      isSucking,
      openSucker,
      show,
      suckerArea,
      suckerCanvas,
    };
  },
});
</script>

<template lang="pug">
b-modal(:visible='show', no-close-on-backdrop='', @close='close', @hide='close', no-fade)
  template(v-slot:modal-header)
    h4 Select Color
    i.fa.fa-times(aria-hidden='true', @click='close')
    color-picker(
      theme='light',
      :color='color',
      :sucker-hide='false',
      :sucker-canvas='suckerCanvas',
      :sucker-area='suckerArea',
      @changecolor='changeColor',
      @opensucker='openSucker'
    )
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
