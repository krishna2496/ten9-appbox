<script>
//import { computed, defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';
//const { mxEventSource } = require('../../../lib/jgraph/mxClient.js');
import mixin from './mixin';
import Saturation from './Saturation.vue';
import Hue from './Hue.vue';
import Alpha from './Alpha.vue';
import Preview from './Preview.vue';
import Sucker from './Sucker.vue';
import Box from './Box.vue';
import Colors from './Colors.vue';

// interface ColorPickerObject {
//   type?: string;
//   color?: string;
// }

// interface ColorPickerEvent {
//   getProperty?(propName: string): ColorPickerObject;
// }

// export default defineComponent({
//   name: 'ColorPickerModal',
//   components: {
//     saturation: Saturation,
//     hue: Hue,
//     alpha: Alpha,
//     preview: Preview,
//     sucker: Sucker,
//     box: Box,
//     colors: Colors,
//   },
//   props: {
//     theme: {
//       type: String,
//       default: 'dark',
//     },
//     suckerHide: {
//       type: Boolean,
//       default: true,
//     },
//     suckerCanvas: {
//       type: null, // HTMLCanvasElement
//       default: null,
//     },
//     suckerArea: {
//       type: Array,
//       default: () => [],
//     },
//     colorsDefault: {
//       type: Array,
//       default: () => [
//         '#000000',
//         '#FFFFFF',
//         '#FF1900',
//         '#F47365',
//         '#FFB243',
//         '#FFE623',
//         '#6EFF2A',
//         '#1BC7B1',
//         '#00BEFF',
//         '#2E81FF',
//         '#5D61FF',
//         '#FF89CF',
//         '#FC3CAD',
//         '#BF3DCE',
//         '#8E00A7',
//         'rgba(0,0,0,0)',
//       ],
//     },
//     colorsHistoryKey: {
//       type: String,
//       default: 'vue-colorpicker-history',
//     },
//     editorUi: {
//       type: Object,
//       // eslint-disable-next-line vue/require-valid-default-prop
//       default: {},
//     },
//   },
//   setup(props) {
//     const color = ref<string>('#000000');
//     const show = ref<boolean>(false);
//     const hueWidth = ref(15);
//     const hueHeight = ref(152);
//     const previewHeight = ref(30);
//     const modelRgba = ref('');
//     const modelHex = ref('');
//     const r = ref(0);
//     const g = ref(0);
//     const b = ref(0);
//     const a = ref(1);
//     const h = ref(0);
//     const s = ref(0);
//     const v = ref(0);
//     const colorPickerType = ref('');

//     function openColorPicker(_sender: typeof mxEventSource, event: ColorPickerEvent) {
//       show.value = true;
//       const options = event.getProperty('options');
//       colorPickerType.value = options.type;
//       console.log(options.color);
//       color.value = options.color;
//     }

//     onMounted(() => {
//       props.editorUi.addListener('openColorPicker', openColorPicker);
//     });

//     onUnmounted(() => {
//       props.editorUi.removeListener(openColorPicker);
//     });

//     return {
//       color,
//       colorPickerType,
//       show,
//       hueWidth,
//       hueHeight,
//       isLightTheme,
//       previewHeight,
//       modelRgba,
//       modelHex,
//       r,
//       g,
//       b,
//       a,
//       h,
//       s,
//       v,
//     };
//   },
// });

export default {
  components: {
    Saturation,
    Hue,
    Alpha,
    Preview,
    Sucker,
    Box,
    Colors,
  },
  mixins: [mixin],
  props: {
    theme: {
      type: String,
      default: 'dark',
    },
    suckerHide: {
      type: Boolean,
      default: true,
    },
    suckerCanvas: {
      type: null, // HTMLCanvasElement
      default: null,
    },
    suckerArea: {
      type: Array,
      default: () => [],
    },
    colorsDefault: {
      type: Array,
      default: () => [
        '#000000',
        '#FFFFFF',
        '#FF1900',
        '#F47365',
        '#FFB243',
        '#FFE623',
        '#6EFF2A',
        '#1BC7B1',
        '#00BEFF',
        '#2E81FF',
        '#5D61FF',
        '#FF89CF',
        '#FC3CAD',
        '#BF3DCE',
        '#8E00A7',
        'rgba(0,0,0,0)',
      ],
    },
    colorsHistoryKey: {
      type: String,
      default: 'vue-colorpicker-history',
    },
    editorUi: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
    },
  },
  data() {
    return {
      color: '#000000',
      colorPickerType: '',
      show: false,
      hueWidth: 15,
      hueHeight: 152,
      previewHeight: 30,
      modelRgba: '',
      modelHex: '',
      r: 0,
      g: 0,
      b: 0,
      a: 1,
      h: 0,
      s: 0,
      v: 0,
    };
  },
  computed: {
    isLightTheme() {
      return this.theme === 'light';
    },
    totalWidth() {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      return this.hueHeight + (this.hueWidth + 8) * 2;
    },
    previewWidth() {
      return this.totalWidth - (this.suckerHide ? 0 : this.previewHeight);
    },
    rgba() {
      return {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a,
      };
    },
    hsv() {
      return {
        h: this.h,
        s: this.s,
        v: this.v,
      };
    },
    rgbString() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    },
    rgbaStringShort() {
      return `${this.r}, ${this.g}, ${this.b}, ${this.a}`;
    },
    rgbaString() {
      return `rgba(${this.rgbaStringShort})`;
    },
    hexString() {
      return this.rgb2hex(this.rgba, true);
    },
  },
  created() {
    Object.assign(this, this.setColorValue(this.color));
    this.setText();

    // 避免初始化时，也会触发changeColor事件
    this.$watch('rgba', () => {
      this.$emit('changeColor', {
        rgba: this.rgba,
        hsv: this.hsv,
        hex: this.modelHex,
      });
    });
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.editorUi.addListener('openColorPicker', (ui, event) => {
      const optios = event.getProperty('options');
      this.color = optios.color;
      this.selectColor(optios.color, false);
      this.colorPickerType = optios.type;
      this.show = true;

      setTimeout(() => {
        function dragElement(elmnt) {
          let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
          if (document.getElementById(elmnt.id + 'header')) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
          } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
          }

          function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
            elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
          }

          function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
          }
        }
        dragElement(document.getElementById('color_picker'));
      }, 2000);
    });
  },
  methods: {
    openColorPicker() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    apply() {
      if (this.colorPickerType === 'Background') {
        this.editorUi.setGraphBackgroundColor(this.hexString);
      } else if (this.colorPickerType === 'Grid') {
        this.editorUi.setGridColor(this.hexString);
      } else if (this.colorPickerType === 'Fill') {
        this.editorUi.setShapeColor('fillColor', this.hexString);
      } else if (this.colorPickerType === 'Gradient') {
        this.editorUi.setShapeColor('gradientColor', this.hexString);
      } else if (this.colorPickerType === 'Line') {
        this.editorUi.setShapeColor('strokeColor', this.hexString);
      } else if (this.colorPickerType === 'Font Color') {
        this.editorUi.setShapeColor('fontColor', this.hexString);
      } else if (this.colorPickerType === 'Background Color') {
        this.editorUi.setShapeColor('labelBackgroundColor', this.hexString);
      }
      this.close();
    },
    selectSaturation(color) {
      const { r, g, b, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, h, s, v });
      this.setText();
    },
    selectHue(color) {
      const { r, g, b, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, h, s, v });
      this.setText();
      this.$nextTick(() => {
        this.$refs.saturation.renderColor();
        this.$refs.saturation.renderSlide();
      });
    },
    selectAlpha(a) {
      this.a = a;
      this.setText();
    },
    inputHex(color) {
      const { r, g, b, a, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, a, h, s, v });
      this.modelHex = color;
      this.modelRgba = this.rgbaStringShort;
      this.$nextTick(() => {
        this.$refs.saturation.renderColor();
        this.$refs.saturation.renderSlide();
        this.$refs.hue.renderSlide();
      });
    },
    inputRgba(color) {
      const { r, g, b, a, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, a, h, s, v });
      this.modelHex = this.hexString;
      this.modelRgba = color;
      this.$nextTick(() => {
        this.$refs.saturation.renderColor();
        this.$refs.saturation.renderSlide();
        this.$refs.hue.renderSlide();
      });
    },
    setText() {
      this.modelHex = this.hexString;
      this.modelRgba = this.rgbaStringShort;
    },
    openSucker(isOpen) {
      this.$emit('openSucker', isOpen);
    },
    selectSucker(color) {
      const { r, g, b, a, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, a, h, s, v });
      this.setText();
      this.$nextTick(() => {
        this.$refs.saturation.renderColor();
        this.$refs.saturation.renderSlide();
        this.$refs.hue.renderSlide();
      });
    },
    selectColor(color, isNextTick = true) {
      // eslint-disable-next-line vue/no-mutating-props
      this.color = color;
      const { r, g, b, a, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, a, h, s, v });
      this.setText();
      if (isNextTick) {
        this.$nextTick(() => {
          this.$refs.saturation.renderColor();
          this.$refs.saturation.renderSlide();
          this.$refs.hue.renderSlide();
        });
      }
    },
  },
};
</script>

<template lang="pug">
b-modal#color_picker(
  :visible='show',
  no-close-on-backdrop='',
  @close='close',
  @hide='close',
  no-fade=''
)
  .hu-color-picker(:class='{ light: isLightTheme }', :style='{ width: totalWidth + "px" }')
    .color-set
      saturation(
        ref='saturation',
        :color='rgbString',
        :hsv='hsv',
        :size='hueHeight',
        @selectSaturation='selectSaturation'
      )
      hue(ref='hue', :hsv='hsv', :width='hueWidth', :height='hueHeight', @selectHue='selectHue')
      alpha(
        ref='alpha',
        :color='rgbString',
        :rgba='rgba',
        :width='hueWidth',
        :height='hueHeight',
        @selectAlpha='selectAlpha'
      )
    .color-show(:style='{ height: previewHeight + "px" }')
      preview(:color='rgbaString', :width='previewWidth', :height='previewHeight')
        sucker(
          v-if='!suckerHide',
          :sucker-canvas='suckerCanvas',
          :sucker-area='suckerArea',
          @openSucker='openSucker',
          @selectSucker='selectSucker'
        )
    box(name='HEX', :color='modelHex', @inputcolor='inputHex')
    box(name='RGBA', :color='modelRgba', @inputcolor='inputRgba')
    colors(
      :color='rgbaString',
      :colors-default='colorsDefault',
      :colors-history-key='colorsHistoryKey',
      @selectColor='selectColor'
    )
  template(v-slot:modal-footer)
    button.btn.btn-grey(@click='close') Cancel
    button.btn.btn-primary(@click='apply') Apply
</template>

<style lang="scss">
.hu-color-picker {
  padding: 10px;
  background: #1d2024;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
  z-index: 1;
  &.light {
    background: #f7f8f9;
    .color-show {
      .sucker {
        background: #eceef0;
      }
    }
    .color-type {
      .name {
        background: #e7e8e9;
      }
      .value {
        color: #666;
        background: #eceef0;
      }
    }
    .colors.history {
      border-top: 1px solid #eee;
    }
  }
  canvas {
    vertical-align: top;
  }
  .color-set {
    display: flex;
  }
  .color-show {
    margin-top: 8px;
    display: flex;
  }
}
</style>
