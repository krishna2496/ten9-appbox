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
  <div class="color-type">
    <span class="name">
      {{ name }}
    </span>
    <input v-model="modelColor" class="value" />
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    modelColor: {
      get() {
        return this.color;
      },
      set(val) {
        this.$emit('inputColor', val);
      },
    },
  },
};
</script>

<style lang="scss">
.color-type {
  display: flex;
  margin-top: 8px;
  font-size: 12px;

  .name {
    width: 60px;
    height: 30px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    // TEN9: Updated color for our UX reqs
    // background: #252930;
    background: #e3e5e6;
  }

  .value {
    flex: 1;
    height: 30px;
    min-width: 100px; // 可以让flex起作用
    padding: 0 12px;
    border: 0;
    // TEN9: Updated color for our UX reqs
    // color: #fff;
    // background: #2e333a;
    color: #000;
    background: #e9ebee;
    box-sizing: border-box;
  }
}
</style>
