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
  <!-- // TEN9: Setting to 100 explicitly for best UX -->
  <canvas style="max-width: 100%;"/>
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
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      alphaSize: 5,
    };
  },
  watch: {
    color() {
      this.renderColor();
    },
  },
  mounted() {
    this.renderColor();
  },
  methods: {
    renderColor() {
      const canvas = this.$el;
      const width = this.width;
      const height = this.height;
      const size = this.alphaSize;
      const canvasSquare = this.createAlphaSquare(size);

      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat');
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, width, height);
    },
  },
};
</script>
