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
import PopupMenu from './menu/PopupMenu.vue';
import PagesFooterPopupMenu from './menu/PagesFooterPopupMenu.vue';
import { defineComponent } from '@vue/composition-api';

import '../styles/modals.scss';

export default defineComponent({
  name: 'Menus',
  components: {
    PopupMenu,
    PagesFooterPopupMenu,
  },
  props: {
    editorUi: {
      type: Object,
      required: false,
      default: null,
    },
  },
});
</script>

<template lang="pug">
.menu-container(v-if='editorUi')
  popup-menu(:editorUi='editorUi')
  pages-footer-popup-menu(:editorUi='editorUi')
  //- page-popup-menu(:editorUi='editorUi')
</template>
