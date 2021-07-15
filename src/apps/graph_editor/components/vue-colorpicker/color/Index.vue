<!--
* ten9, Inc
* Copyright (c) 2015 - 2021 ten9, Inc
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

<script>
import mixin from './mixin';
import Saturation from './Saturation.vue';
import Hue from './Hue.vue';
import Alpha from './Alpha.vue';
import Preview from './Preview.vue';
import Sucker from './Sucker.vue';
import Box from './Box.vue';
import Colors from './Colors.vue';

// TEN9: imports
import WindowHeader from '../../windows/Header.vue';
import { mxEventObject } from '../../../lib/jgraph/mxClient';
const { dragElement, bringWindowToFront } = require('../../windows/utils.ts');
const graphUtils = require('../../../lib/jgraph/graph_utils.js');

export default {
  components: {
    Saturation,
    // TEN9: Add Window header
    WindowHeader,
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
      // TEN9: Changed from dark to light
      default: 'light',
    },
    suckerHide: {
      type: Boolean,
      default: true,
    },
    suckerCanvas: {
      type: HTMLCanvasElement, // HTMLCanvasElement
      default: null,
    },
    suckerArea: {
      type: Array,
      default: () => [950, 700, 900, 700],
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
    // TEN9: add editorUi as prop to use its functionality
    editorUi: {
      type: Object,
      default: {},
    },
    // TEN9: to get recent colors from app
    recentColors: {
      required: false,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // TEN9: Changed hueWidth from 15 to 18
      hueWidth: 18,
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
      // TEN9: new datas
      alphaHexString: '',
      previousAlphaHexString:'',
      applyFn: null,
      colorPickerType: '',
      show: false,
      isMin: false,
      recentColorsArray:[],
    };
  },
  computed: {
    isLightTheme() {
      return this.theme === 'light';
    },
    totalWidth() {
      // TEN9: Added even more spacing (from 8 to 27) to account for ten9 UX reqs
      return this.hueHeight + (this.hueWidth + 27) * 2;
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
    this.setText();

    // 避免初始化时，也会触发changeColor事件
    this.$watch('rgba', () => {

      // TEN9: Update new var too
      this.alphaHexString = this.rgba2hex(
        `rgb(${this.r}, ${this.g}, ${this.b}), ${this.a}`,
        this.a,
      );
      this.$emit('changeColor', {
        rgba: this.rgba,
        hsv: this.hsv,
        hex: this.modelHex,
      });
    });
  },
  // TEN9: add mounted property
  mounted() {
    this.editorUi.addListener('openColorPicker', (ui, event) => {
      const ele = this.$refs.colorWindow;
      // Add drag property on layer window.
      dragElement(ele, 0);

      const options = event.getProperty('options');

      if (this.colorPickerType != options.type) {
        this.applyFn = options.applyFn;

        this.selectSaturation(options.color)
        this.selectHue(options.color)
        this.inputHex(options.color)

        this.selectColor(options.color, false);
        this.colorPickerType = options.type;
        this.show = true;
        this.alphaHexString = options.color;
        this.$nextTick(()=> {
          this.previousAlphaHexString = this.alphaHexString;
        });

        const alpha = this.hex2rgba(this.alphaHexString);
        if (alpha != undefined) {
          this.a = alpha;
        }
      } else {
        this.colorPickerType = '';
        this.buttonInactive();
      }

      bringWindowToFront(0);
      this.editorUi.colorPicker = true;
      this.editorUi.selectedColorPicker =  this.colorPickerType;
    });

    this.editorUi.addListener('openColorWindow',() => {
      const ele = this.$refs.colorWindow;

      // Add drag property on color window.
      dragElement(ele, 0);

      this.show = true;

      bringWindowToFront(0);
      this.editorUi.colorPicker = true;
    });

    this.editorUi.addListener('closeColorWindow', () => {
      this.close();
    });

    this.editorUi.addListener('inactiveColorButton', () => {
      this.buttonInactive();
      if(this.colorPickerType != '') {
        this.colorPickerType = '';
        this.applyFn = null;

        if(this.alphaHexString != this.previousAlphaHexString && this.recentColorsArray[0] != `#${this.alphaHexString}`) {
          Array.prototype.move = function(from,to){
            this.splice(to,0,this.splice(from,1)[0]);
            return this;
          };
          if(this.recentColorsArray.indexOf(`#${this.alphaHexString}`) != -1) {
            this.recentColorsArray.move(this.recentColorsArray.indexOf(`#${this.alphaHexString}`),0)
          }
          else {
            if(this.recentColorsArray.length == 8) {
              this.recentColorsArray.splice(-1,1);
            }
              this.recentColorsArray.unshift(`#${this.alphaHexString}`);
          }

          this.$emit('recent-colors-changed', this.recentColorsArray.toString())
        }
        this.previousAlphaHexString = this.alphaHexString;
      }
    });

    this.$nextTick(() => {
        const colorWindow = this.$refs.colorWindow;
        const containerRect = graphUtils.getDocumentContainerRect();
        const formatPanelWidth = parseInt(this.editorUi.formatContainer.style.width);
        const rightPadding = 25;
        const topPadding = 10;
        const colorWindowWidth = 240;
        colorWindow.style.left = `${containerRect.width -  formatPanelWidth - colorWindowWidth - rightPadding}px`;
        colorWindow.style.top = `${this.editorUi.menubarHeight + this.editorUi.toolbarHeight + topPadding}px`;
        if (!this.$props.recentColors) {
          this.recentColorsArray = [];
        } else {
          this.recentColorsArray = this.$props.recentColors.split(",");
        }
    });
  },
  methods: {
    selectSaturation(color) {
      const { r, g, b, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, h, s, v });
      this.setText();
      // TEN9: Added apply in nextTick
      this.$nextTick(() => {
        this.apply();
      });
    },
    selectHue(color) {
      const { r, g, b, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, h, s, v });
      this.setText();
      this.$nextTick(() => {
        this.$refs.saturation.renderColor();
        this.$refs.saturation.renderSlide();
        // TEN9: Added apply
        this.apply();
      });
    },
    selectAlpha(a) {
      this.a = a;
      this.setText();
      // TEN9: Added apply in nextTick
      this.$nextTick(() => {
        this.apply();
      });
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
        this.apply();
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
        this.apply();
      });
    },
    setText() {
      this.modelHex = this.hexString;
      this.modelRgba = this.rgbaStringShort;
    },
    openSucker(isOpen) {
      this.$emit('openSucker', isOpen);
      this.suckerCanvas = document.createElement('canvas');
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
      const { r, g, b, a, h, s, v } = this.setColorValue(color);
      Object.assign(this, { r, g, b, a, h, s, v });
      this.setText();
      if (isNextTick) {
        this.$nextTick(() => {
          this.$refs.saturation.renderColor();
          this.$refs.saturation.renderSlide();
          this.$refs.hue.renderSlide();
          this.apply();
        });
      }
    },
    // TEN9: add function to change the window minimize functionality
    changeMinStatus() {
      this.isMin = !this.isMin;
    },
    // TEN9: add function to open the color picker
    openColorPicker() {
      this.show = true;
    },
    // TEN9: add function to inactive the button
    buttonInactive() {
      var element = document.getElementsByClassName('geColorBtn');
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove('active_button');
        element[i].blur();
      }
    },
    // TEN9: add function to close the window
    close() {
      this.editorUi.fireEvent(new mxEventObject('inactiveColorButton'));
      this.buttonInactive();
      this.colorPickerType = '';
      this.show = false;
      this.applyFn = null;
      this.editorUi.colorPicker = false;
      this.editorUi.selectedColorPicker = '';
      // TEN9: change menubar and toolbar check icon value
      this.editorUi.fireEvent(new mxEventObject('changeMenuStatus', 'type', 'color', 'value', false));
    },
    // TEN9: add function to apply the color when we select form the color picker
    apply() {
      if (this.applyFn && this.alphaHexString != this.previousAlphaHexString && this.alphaHexString != '') {
        this.editorUi.colorPickerEvent = true;
        if(this.alphaHexString.charAt(0) == '#') {
          this.applyFn(this.alphaHexString);
        } else {
          this.applyFn(`#${this.alphaHexString}`);
        }
      }
    },
  },
  watch:{
    recentColors(newVal, oldVal) {
      if(newVal != '') {
        this.recentColorsArray = newVal.split(",");
      } else {
        this.recentColorsArray = [];
      }
    }
  }
};
</script>

<!-- // TEN9: Converted template to pug and relocated to below script -->
<template lang="pug">
b-card.mb-2.color-card(
  tag='article',
  style='max-width: 20rem',
  no-body,
  :class='isMin ? "minimize" : ""'
  v-show='show',
  ref='colorWindow'
)
  template.row(#header='')
    window-header.color-picker(
      title='Colors',
      @close-window='close',
      :isMin='isMin',
      @change-min-status='changeMinStatus'
    )
  .card-body.p-0
    .hu-color-picker(
      :class='{ light: isLightTheme }',
      :style='{ width: totalWidth + "px", margin: "auto" }'
    )
      .color-set
        saturation(
          ref='saturation',
          :color='rgbString',
          :hsv='hsv',
          :size='hueHeight',
          @selectSaturation='selectSaturation'
        )
        hue(
          ref='hue',
          :hsv='hsv',
          :width='hueWidth',
          :height='hueHeight',
          @selectHue='selectHue'
        )
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
      box(name='HEX', :color='modelHex', @inputColor='inputHex')
      box(name='RGBA', :color='modelRgba', @inputColor='inputRgba')
      colors(
        :color='rgbaString',
        :colors-default='colorsDefault',
        :colors-history-key='colorsHistoryKey',
        :colors-history='recentColorsArray'
        @selectColor='selectColor'
      )
</template>

<!-- // TEN9: Added scoped styling -->
<style lang="scss" scoped>
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
    // TEN9: Spacing between
    justify-content: space-between;
  }

  .color-show {
    margin-top: 8px;
    display: flex;
  }
}
// TEN9: add close button css
.cross-icon {
  height: 5px;
  margin-top: -7px;
}

// TEN9: add padding to the recent colors section
.m-10 {
  margin-top: 10px;
  margin-bottom: 0;
}
</style>
