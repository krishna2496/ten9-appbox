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
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';
import VClamp from 'vue-clamp';
const graphUtils = require('../../lib/jgraph/graph_utils.js');

import '../../styles/popupmenu.scss';

export default defineComponent({
  name: 'PagePopupMenu',
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
      props.editorUi.addListener('openPagePopup', openPopupMenu);
      props.editorUi.addListener('closePopupMenu', close);
      props.editorUi.editor.graph.refresh();
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(openPopupMenu);
      props.editorUi.removeListener(close);
    });

    return {
      close,
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
    b-list-group-item.none-border(@click='insertPage')
      span.item-name Insert
    b-list-group-item.none-border(@click='deletePage')
      span.item-name Delete
    b-list-group-item.none-border(@click='renamePage')
      span.item-name Rename
    hr.popup-dropdown-divider(role='separator', aria-orientation='horizontal')
    b-list-group-item.none-border(@click='duplicatePage')
      span.item-name Duplicate
</template>
