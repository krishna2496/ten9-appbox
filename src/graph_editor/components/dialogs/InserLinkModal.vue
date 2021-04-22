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
import {
  mxCell,
  mxEventObject,
  mxEventSource,
  mxGeometry,
  mxUtils,
} from '../../lib/jgraph/mxClient.js';
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';

interface InsertLinkObject {
  cell?: typeof mxCell;
  value?: string;
}

interface InsertLinkEvent {
  getProperty?(propName: string): InsertLinkObject;
}

export default defineComponent({
  name: 'InsertLinkModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const type = ref<string>('');

    const show = ref<boolean>(false);

    const link = ref<string>('');
    // TODO: Use type here
    const pages = ref(null);

    const pageId = ref<string>('');

    const option = ref<string>('customLink');
    // TODO: Use type here
    const cell = ref(null);

    function insertLink(url: string) {
      const { editor } = props.editorUi;
      const { graph } = editor;
      const newUrl = mxUtils.trim(url);
      if (newUrl.length > 0) {
        const title: string = graph.getLinkTitle(newUrl);

        const pt = graph.getFreeInsertPoint();
        const style = 'fontColor=#0000EE;fontStyle=4;rounded=1;overflow=hidden;spacing=10;';
        const height = 100;
        const width = 40;
        let linkCell = new mxCell(title, new mxGeometry(pt.x, pt.y, height, width), style);
        linkCell.vertex = true;

        graph.setLinkForCell(linkCell, newUrl);
        graph.cellSizeUpdated(linkCell, true);

        graph.getModel().beginUpdate();
        try {
          linkCell = graph.addCell(linkCell);
          graph.fireEvent(new mxEventObject('cellsInserted', 'cells', [linkCell]));
        } finally {
          graph.getModel().endUpdate();
        }

        graph.setSelectionCell(linkCell);
        graph.scrollCellToVisible(graph.getSelectionCell());
      }
    }

    function closeModal() {
      show.value = false;
      cell.value = null;
      link.value = '';
    }

    function updateCell(url: string) {
      props.editorUi.setCellLink(cell.value, url.length > 0 ? url : null);
    }

    function setLink() {
      if (type.value == 'insert') {
        if (option.value === 'customLink') {
          if (link.value !== '') {
            insertLink(link.value);
          }
        } else {
          const docLink = 'data:page/id,' + pageId.value;
          insertLink(docLink);
        }
      } else {
        if (option.value === 'customLink') {
          if (link.value !== '') {
            updateCell(link.value);
          }
        } else {
          const docLink = 'data:page/id,' + pageId.value;
          updateCell(docLink);
        }
      }

      closeModal();
    }

    function openInsertLink() {
      type.value = 'insert';
      show.value = true;
      pages.value = props.editorUi.pages;
      pageId.value = pages.value[0].getId();
    }

    function openEditLink(_sender: typeof mxEventSource, event: InsertLinkEvent) {
      type.value = 'update';
      show.value = true;

      const cells: InsertLinkObject = event.getProperty('cells');
      link.value = cells.value;
      cell.value = cells.cell;
      pages.value = props.editorUi.pages;
      pageId.value = pages.value[0].getId();

      if (link.value.startsWith('data:page')) {
        option.value = 'pageLink';
        link.value = '';
      } else {
        option.value = 'customLink';
      }
    }

    onMounted(() => {
      props.editorUi.addListener('openInsertLink', openInsertLink);
      props.editorUi.addListener('openEditLink', openEditLink);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openInsertLink);
      props.editorUi.removeListener(openEditLink);
    });

    return {
      closeModal,
      option,
      pageId,
      pages,
      link,
      setLink,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(:visible='show', no-close-on-backdrop='', no-fade, @hide='closeModal')
  template(v-slot:modal-header)
    h6 Edit Link
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3
    label Edit Link:
  .row.ml-3.form-inline
    input.mr-4.radio-btn(type='radio', name='option', value='customLink', v-model='option')
    input.txt-input.w-90(type='text', v-model='link')
  .row.ml-3.mt-2.form-inline
    input(type='radio', name='option', value='pageLink', v-model='option')
    select.form-control.ml-4.w-90(v-model='pageId')
      option(v-for='(page, index) in pages', :value='page.getId()') {{ page.getName() }}
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setLink')
      | Ok
</template>
