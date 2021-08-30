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
import { mxClient, mxEventObject, mxEventSource, mxUtils } from '../../lib/jgraph/mxClient.js';

import { usePageActions } from '../composition/pages';

import {
  defineComponent,
  nextTick,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
} from '@vue/composition-api';
import VClamp from 'vue-clamp';
const graphUtils = require('../../lib/jgraph/graph_utils.js');

import '../../styles/popupmenu.scss';

export default defineComponent({
  name: 'PagesFooterPopupMenu',
  components: {
    VClamp,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const popupMenuRef = ref<HTMLElement>(null);

    const pages = ref(['Page-1']);

    function getCurrentPageName() {
      return props.editorUi.getCurrentPage().getName();
    }

    function close() {
      show.value = false;
    }

    function updatePosition(evt: MouseEvent) {
      const offset = mxUtils.getOffset(mxClient.getDocumentContainer());
      popupMenuRef.value.style.left = `${evt.clientX - offset.x}px`;
      popupMenuRef.value.style.top = `${evt.clientY - offset.y}px`;
      graphUtils.fit(popupMenuRef.value, mxClient.getDocumentContainer());
    }

    function openPopupMenu(_sender: typeof mxEventSource, event: mxEventObject) {
      const evt = event.getProperty('event');
      show.value = true;
      nextTick(() => {
        updatePosition(evt);
      });
    }

    onMounted(() => {
      props.editorUi.addListener('openPagesFooterPopup', openPopupMenu);
      props.editorUi.addListener('closePopupMenu', close);
      props.editorUi.editor.graph.refresh();
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(openPopupMenu);
      props.editorUi.removeListener(close);
    });

    function updatePages() {
      pages.value = [];
      for (let i = 0; i < props.editorUi.pages.length; i++) {
        pages.value.push(props.editorUi.pages[i].getName());
      }
    }

    watch(
      () => props.editorUi.pages,
      () => {
        updatePages();
      },
    );

    return {
      close,
      getCurrentPageName,
      pages,
      popupMenuRef,
      show,
      ...usePageActions(props.editorUi),
    };
  },
});
</script>

<template lang="pug">
div
  b-list-group.w-15.position-absolute.cursor-pointer(ref='popupMenuRef', v-show='show')
    b-list-group-item.none-border(
      v-for='(item, index) in pages',
      :key='index',
      @click='selectPage(index)'
    )
      span.material-icons.menu-icons(v-show='isCurrentPage(index)') done
      v-clamp.item-name(autoresize, :max-lines='1', :class='[isCurrentPage(index) ? "" : "pl-20"]') {{ item }}
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='insertPage')
      span.item-name Insert page
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='deletePage')
      v-clamp.item-name(autoresize, :max-lines='1') Remove {{ getCurrentPageName() }}
    b-list-group-item.none-border(@click='renamePage')
      v-clamp.item-name(autoresize, :max-lines='1') Rename {{ getCurrentPageName() }}
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='duplicatePage')
      v-clamp.item-name(autoresize, :max-lines='1') Duplicate {{ getCurrentPageName() }}
</template>
