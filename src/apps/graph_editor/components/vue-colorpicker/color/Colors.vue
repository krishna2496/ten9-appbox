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

<template>
  <div>
    <ul class="colors">
      <!-- // TEN9: Added key as index as best practice -->
      <li v-for="(item,index) in colorsDefault" :key="index" class="item" @click="selectColor(item)">
        <div :style="{ background: `url(${imgAlphaBase64})` }" class="alpha" />
        <div :style="{ background: item }" class="color" />
      </li>
    </ul>
    <ul v-if="colorsHistory.length" class="colors history">
      <li v-for="item in colorsHistory" :key="item" class="item" @click="selectColor(item)">
        <div :style="{ background: `url(${imgAlphaBase64})` }" class="alpha" />
        <div :style="{ background: item }" class="color" />
      </li>
    </ul>
  </div>
</template>

<script>
import mixin from './mixin';
export default {
  mixins: [mixin],
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    colorsDefault: {
      type: Array,
      default: () => [],
    },
    colorsHistoryKey: {
      type: String,
      default: '',
    },
    colorsHistory : {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      imgAlphaBase64: '',
      //colorsHistory: JSON.parse(localStorage.getItem(this.colorsHistoryKey)) || [],
    };
  },
  created() {
    this.imgAlphaBase64 = this.createAlphaSquare(4).toDataURL();
  },
  destroyed() {
    this.setColorsHistory(this.color);
  },
  methods: {
    selectColor(color) {
      this.$emit('selectColor', color);
    },
    setColorsHistory(color) {
      if (!color) {
        return;
      }
      const colors = this.colorsHistory;
      const index = colors.indexOf(color);
      if (index >= 0) {
        colors.splice(index, 1);
      }
      if (colors.length >= 8) {
        colors.length = 7;
      }
      colors.unshift(color);
      this.colorsHistory = colors;
      localStorage.setItem(this.colorsHistoryKey, JSON.stringify(colors));
    },
  },
};
</script>

<style lang="scss">
.colors {
  padding: 0;
  margin: 0;

  &.history {
    margin-top: 10px;
    border-top: 1px solid #2e333a;
  }

  .item {
    position: relative;
    // TEN9: Adding border for better look
    border: 1px solid #000;
    width: 16px;
    height: 16px;
    // TEN9: Forcing with !important to ensure change
    // margin: 10px 0 0 10px;
    margin: 10px 0 0 10px !important;
    border-radius: 3px;
    box-sizing: border-box;
    vertical-align: top;
    display: inline-block;
    transition: all 0.1s;
    cursor: pointer;

    &:nth-child(8n + 1) {
      margin-left: 0;
    }

    &:hover {
      transform: scale(1.4);
    }

    .alpha {
      height: 100%;
      border-radius: 4px; // ?????????????????????????????????????????????
    }

    .color {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
}
</style>
