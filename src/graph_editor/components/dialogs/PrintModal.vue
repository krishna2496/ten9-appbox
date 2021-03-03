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
const { mxConstants, mxRectangle, mxUtils } = require('../../lib/jgraph/mxClient.js');
const { PrintDialog } = require('../../lib/jgraph/Editor.js');
import PageSize from '../../lib/PageSize.js';

export default defineComponent({
  name: 'PrintModel',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const pageScaleValue = ref(null);

    const scaleValue = 100;

    const printZoom = ref('adjust');

    const sheetsAcrossInput = ref('1');

    const sheetsDownInput = ref('1');

    const zoomInput = ref('100 %');

    const pageFormat = ref(null);

    const pageScaleInput = ref('100 %');

    function closeModal() {
      show.value = false;
      pageFormat.value = null;
    }

    // Overall scale for print-out to account for print borders in dialogs etc
    function preview(print: boolean) {
      let autoOrigin = false;
      // if (printZoom.value == 'fit') {
      //   autoOrigin = true;
      // }

      let printScale = parseInt(pageScaleInput.value) / scaleValue;

      if (isNaN(printScale)) {
        printScale = 1;
        pageScaleValue.value = '100%';
      }

      // Workaround to match available paper size in actual print output
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      printScale *= 0.75;
      const gb = props.editorUi.editor.graph.getGraphBounds();
      let scale = 1 / props.editorUi.editor.graph.pageScale;
      let pf = pageFormat.value || mxConstants.PAGE_FORMAT_A4_PORTRAIT;

      if (autoOrigin) {
        const h = parseInt(sheetsAcrossInput.value);
        const v = parseInt(sheetsDownInput.value);

        scale = Math.min(
          (pf.height * v) / (gb.height / props.editorUi.editor.graph.view.scale),
          (pf.width * h) / (gb.width / props.editorUi.editor.graph.view.scale),
        );
      } else {
        scale = parseInt(zoomInput.value) / (scaleValue * props.editorUi.editor.graph.pageScale);

        if (isNaN(scale)) {
          printScale = 1 / props.editorUi.editor.graph.pageScale;
          zoomInput.value = '100 %';
        }
      }

      if (autoOrigin) {
        const pageCount = parseInt(pageScaleValue.value);

        if (!isNaN(pageCount)) {
          scale = mxUtils.getScaleForPageCount(pageCount, props.editorUi.editor.graph, pf);
        }
      }

      // Negative coordinates are cropped or shifted if page visible
      const border = 0;
      let x0 = 0;
      let y0 = 0;

      // Applies print scale
      pf = mxRectangle.fromRectangle(pf);
      pf.width = Math.ceil(pf.width * printScale);
      pf.height = Math.ceil(pf.height * printScale);
      scale *= printScale;

      // Starts at first visible page
      if (!autoOrigin && props.editorUi.editor.graph.pageVisible) {
        const layout = props.editorUi.editor.graph.getPageLayout();
        x0 -= layout.x * pf.width;
        y0 -= layout.y * pf.height;
      } else {
        autoOrigin = true;
      }

      const printPreview = PrintDialog.createPrintPreview(
        props.editorUi.editor.graph,
        scale,
        pf,
        border,
        x0,
        y0,
        autoOrigin,
      );
      printPreview.open();

      if (print) {
        PrintDialog.printPreview(printPreview);
      }
      closeModal();
    }

    function setPageFormat(format: typeof mxRectangle) {
      pageFormat.value = format;
    }

    function openPrintModal() {
      show.value = true;
      pageScaleValue.value = props.editorUi.editor.graph.pageScale * scaleValue;
    }

    onMounted(() => {
      props.editorUi.addListener('openPrintModal', openPrintModal);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openPrintModal);
    });

    return {
      closeModal,
      pageFormat,
      pageScaleInput,
      pageScaleValue,
      PageSize,
      preview,
      printZoom,
      setPageFormat,
      sheetsAcrossInput,
      sheetsDownInput,
      show,
      zoomInput,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(:visible='show', no-close-on-backdrop='', no-fade, @hide='closeModal')
  template(v-slot:modal-header)
    h4 Print
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mb-3
    input(type='radio', name='printZoom', value='adjust', v-model='printZoom')
    label.ml-2 Adjust to
    input.ml-2.txt-input(type='text', v-model='zoomInput')
  .row.ml-3.mb-3
    input(type='radio', name='printZoom', value='fit', v-model='printZoom')
    label.ml-2 Fit to
    input.ml-2.txt-input(type='text', v-model='sheetsAcrossInput')
    label.ml-2 sheet(s) across
  .row.ml-5.mb-3
    label.ml-2 by
    input.ml-4.txt-input(type='text', v-model='sheetsDownInput')
    label.ml-2 sheet(s) down
  .row.bottom-border
    hr
  .row.ml-3.mb-3
    h5 Paper Size
  .row.ml-3.mb-3
    select.form-control.w-90(v-model='pageFormat')
      option(v-for='(page, index) in PageSize', :key='index', :value='page.format') {{ page.title }}
  .row.ml-3.mb-3
    input(type='radio', name='page_type')
    label.ml-2 Portrait
    input.ml-4(type='radio', name='page_type')
    label.ml-2 Landscape
  .row.ml-3.mb-3
    label.ml-2 Page Scale
    input.txt-input.ml-2(type='text', v-model='pageScaleInput')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-grey(type='button', @click='preview(false)')
      | Preview
    button.btn.btn-primary(type='button', @click='preview(true)')
      | Apply
</template>
