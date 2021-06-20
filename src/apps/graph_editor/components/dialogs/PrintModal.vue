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
import PageSize from '../../lib/PageSize.js';
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api';
const {
  mxConstants,
  mxClient,
  mxGraph,
  mxImage,
  mxPoint,
  mxPrintPreview,
  mxRectangle,
  mxResources,
  mxUtils,
} = require('../../lib/jgraph/mxClient.js');
const { Graph } = require('../../lib/jgraph/Graph.js');
const { PrintDialog } = require('../../lib/jgraph/Editor.js');

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
    // TODO: Use type here
    const pageScaleValue = ref(null);

    const scaleValue = 100;

    const printZoom = ref<string>('adjust');

    const sheetsAcrossInput = ref<string>('1');

    const sheetsDownInput = ref<string>('1');

    const zoomInput = ref<string>('100 %');
    // TODO: Use type here
    const pageFormat = ref(mxConstants.PAGE_FORMAT_A4_PORTRAIT);

    const pageScaleInput = ref<string>('100 %');

    const isMultiplePages = ref<boolean>(false);

    const pagesFromInput = ref<number>(1);

    const pagesToInput = ref<number>(1);

    const pageType = ref<string>('page');

    const maxPage = ref<number>(1);

    const currentPage = ref<number>(1);

    const pageStyle = ref<string>('portrait');

    const showCustomPaperSize = ref<boolean>(false);

    const customHeight = ref<number>(0);

    const customWidth = ref<number>(0);

    const scalePercentage = 0.75;

    const pageSizeDivider = 100;

    function closeModal() {
      show.value = false;
      pageFormat.value = mxConstants.PAGE_FORMAT_A4_PORTRAIT;
      pageScaleInput.value = '100 %';
    }

    function addFontToDoc(doc: HTMLDocument, fontName: string, fontUrl: string) {
      if (Graph.isCssFontUrl(fontUrl)) {
        doc.writeln(
          `<link rel="stylesheet" href="${mxUtils.htmlEntities(
            fontUrl,
          )}" charset="UTF-8" type="text/css">'`,
        );
      } else {
        doc.writeln('<style type="text/css">');
        doc.writeln(
          `@font-face {\nfont-family: "${mxUtils.htmlEntities(
            fontName,
          )}";\nsrc: url("${mxUtils.htmlEntities(fontUrl)}");\n}`,
        );
        doc.writeln('</style>');
      }
    }

    function printGraph(
      thisGraph: typeof mxGraph,
      pv: typeof mxPrintPreview,
      forcePageBreaks: boolean,
    ): typeof mxGraph {
      // Workaround for CSS transforms affecting the print output
      // is to disable during print output and restore after
      const prev = thisGraph.useCssTransforms;
      const prevTranslate = thisGraph.currentTranslate;
      const prevScale = thisGraph.currentScale;
      const prevViewTranslate = thisGraph.view.translate;
      const prevViewScale = thisGraph.view.scale;

      let printPreview: typeof mxPrintPreview = pv;

      if (thisGraph.useCssTransforms) {
        thisGraph.useCssTransforms = false;
        thisGraph.currentTranslate = new mxPoint(0, 0);
        thisGraph.currentScale = 1;
        thisGraph.view.translate = new mxPoint(0, 0);
        thisGraph.view.scale = 1;
      }

      // Negative coordinates are cropped or shifted if page visible
      const gb = thisGraph.getGraphBounds();
      const border = 0;
      let x0 = 0;
      let y0 = 0;

      let pf = pageFormat.value || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
      if (pageStyle.value == 'landscape') {
        const h = pf.height;
        const w = pf.width;
        pf.height = w;
        pf.width = h;
      } else if (pageStyle.value == 'custom') {
        const newPageFormat: typeof mxRectangle = new mxRectangle(
          0,
          0,
          customWidth.value * scaleValue,
          customHeight.value * scaleValue,
        );
        pf = new mxRectangle(0, 0, newPageFormat.height, newPageFormat.width);
      }
      let scale = 1 / thisGraph.pageScale;
      let autoOrigin = false;

      let printScale = parseInt(pageScaleInput.value) / scaleValue;
      if (printZoom.value == 'fit') {
        autoOrigin = true;
      }

      if (isNaN(printScale)) {
        printScale = 1;
        pageScaleValue.value = '100%';
      }

      // Workaround to match available paper size in actual print output
      printScale *= scalePercentage;

      if (autoOrigin) {
        const h = parseInt(sheetsAcrossInput.value);
        const v = parseInt(sheetsDownInput.value);

        scale = Math.min(
          (pf.height * v) / (gb.height / thisGraph.view.scale),
          (pf.width * h) / (gb.width / thisGraph.view.scale),
        );
      } else {
        const oneHundred = 100;
        scale = parseInt(zoomInput.value) / (oneHundred * thisGraph.pageScale);

        if (isNaN(scale)) {
          printScale = 1 / thisGraph.pageScale;
          zoomInput.value = '100 %';
        }
      }

      // Applies print scale
      pf = mxRectangle.fromRectangle(pf);
      pf.width = Math.ceil(pf.width * printScale);
      pf.height = Math.ceil(pf.height * printScale);
      scale *= printScale;

      // Starts at first visible page
      if (!autoOrigin && thisGraph.pageVisible) {
        const layout = thisGraph.getPageLayout();
        x0 -= layout.x * pf.width;
        y0 -= layout.y * pf.height;
      } else {
        autoOrigin = true;
      }

      if (printPreview == null) {
        printPreview = PrintDialog.createPrintPreview(
          thisGraph,
          scale,
          pf,
          border,
          x0,
          y0,
          autoOrigin,
        );
        printPreview.pageSelector = false;
        printPreview.mathEnabled = false;

        const file = props.editorUi.getCurrentFile();

        if (file != null) {
          printPreview.title = file.getTitle();
        }

        const { writeHead } = printPreview;

        // Overridden to add custom fonts
        printPreview.writeHead = function writeHeader(doc: HTMLDocument) {
          writeHead.apply(this, arguments);

          // Fixes clipping for transformed math
          if (mxClient.IS_GC || mxClient.IS_SF) {
            doc.writeln('<style type="text/css">');
            doc.writeln('div.MathJax_SVG_Display { position: static; }');
            doc.writeln('</style>');
          }

          // Fixes font weight for PDF export in Chrome
          if (mxClient.IS_GC) {
            doc.writeln('<style type="text/css">');
            doc.writeln('@media print {');
            doc.writeln('span.MathJax_SVG svg { shape-rendering: crispEdges; }');
            doc.writeln('}');
            doc.writeln('</style>');
          }

          if (props.editorUi.editor.fontCss != null) {
            doc.writeln('<style type="text/css">');
            doc.writeln(props.editorUi.editor.fontCss);
            doc.writeln('</style>');
          }

          const extFonts = thisGraph.getCustomFonts();

          for (let i = 0; i < extFonts.length; i++) {
            const fontName = extFonts[i].name;
            const fontUrl = extFonts[i].url;
            addFontToDoc(doc, fontName, fontUrl);
          }
        };

        // if (typeof(MathJax) !== 'undefined')
        // 	{
        // Adds class to ignore if math is disabled
        const printPreviewRenderPage = printPreview.renderPage;

        printPreview.renderPage = function renderPage() {
          const renderPagePrev = mxClient.NO_FO;
          mxClient.NO_FO =
            props.editorUi.editor.graph.mathEnabled &&
            !props.editorUi.editor.useForeignObjectForMath
              ? true
              : props.editorUi.editor.originalNoForeignObject;
          const result = printPreviewRenderPage.apply(this, arguments);
          mxClient.NO_FO = renderPagePrev;

          if (this.graph.mathEnabled) {
            this.mathEnabled = this.mathEnabled || true;
          } else {
            result.className = 'geDisableMathJax';
          }

          return result;
        };
        //	}

        // Switches stylesheet for print output in dark mode
        let temp = null;
        const { editorUi } = props;
        if (
          props.editorUi.editor.graph.themes != null &&
          props.editorUi.editor.graph.defaultThemeName == 'darkTheme'
        ) {
          temp = props.editorUi.editor.graph.stylesheet;
          editorUi.editor.graph.stylesheet = props.editorUi.editor.graph.getDefaultStylesheet();
          props.editorUi.editor.graph.refresh();
        }

        // Generates the print output
        printPreview.open(null, null, forcePageBreaks, true);

        // Restores the stylesheet
        if (temp != null) {
          editorUi.editor.graph.stylesheet = temp;
          props.editorUi.editor.graph.refresh();
        }
      } else {
        let bg = thisGraph.background;

        if (bg == null || bg == '' || bg == mxConstants.NONE) {
          bg = '#ffffff';
        }

        printPreview.backgroundColor = bg;
        printPreview.autoOrigin = autoOrigin;
        printPreview.appendGraph(thisGraph, scale, x0, y0, forcePageBreaks, true);

        const extFonts = thisGraph.getCustomFonts();

        if (printPreview.wnd != null) {
          for (let i = 0; i < extFonts.length; i++) {
            const fontName = extFonts[i].name;
            const fontUrl = extFonts[i].url;
            addFontToDoc(printPreview.wnd.document, fontName, fontUrl);
          }
        }
      }

      // Restores state if css transforms are used
      if (prev) {
        thisGraph.useCssTransforms = prev;
        thisGraph.currentTranslate = prevTranslate;
        thisGraph.currentScale = prevScale;
        thisGraph.view.translate = prevViewTranslate;
        thisGraph.view.scale = prevViewScale;
      }
      return printPreview;
    }

    // Overall scale for print-out to account for print borders in dialogs etc
    function preview(print: boolean) {
      let autoOrigin = false;
      let ignorePages = false;

      let pv = null;

      if (isMultiplePages.value) {
        if (pageType.value == 'page') {
          ignorePages = true;
        }

        if (ignorePages) {
          ignorePages =
            pagesFromInput.value == currentPage.value && pagesToInput.value == currentPage.value;
        }

        if (!ignorePages && props.editorUi.pages != null && props.editorUi.pages.length) {
          let i0 = 0;
          let imax = props.editorUi.pages.length - 1;

          if (pageType.value == 'page') {
            i0 = pagesFromInput.value - 1;
            imax = pagesToInput.value - 1;
          }

          for (let i = i0; i <= imax; i++) {
            const page = props.editorUi.pages[i];

            const tempGraph = props.editorUi.createTemporaryGraph(
              props.editorUi.editor.graph.stylesheet,
            ); //getStylesheet());

            // Restores graph settings that are relevant for printing
            let pageVisibleValue = true;
            let mathEnabledValue = false;
            let bg = null;
            let bgImage = null;

            if (page.viewState == null) {
              // Workaround to extract view state from XML node
              // This changes the state of the page and parses
              // the XML for the graph model even if not needed.
              if (page.root == null) {
                props.editorUi.updatePageRoot(page);
              }
            }

            if (page.viewState != null) {
              const { pageVisible } = page.viewState;
              pageVisibleValue = pageVisible;
              const { mathEnabled } = page.viewState;
              mathEnabledValue = mathEnabled;
              bg = page.viewState.background;
              bgImage = page.viewState.backgroundImage;
              tempGraph.extFonts = page.viewState.extFonts;
            }

            tempGraph.background = bg;
            tempGraph.backgroundImage =
              bgImage != null ? new mxImage(bgImage.src, bgImage.width, bgImage.height) : null;
            tempGraph.pageVisible = pageVisibleValue;
            tempGraph.mathEnabled = mathEnabledValue;

            // Redirects placeholders to current page
            const graphGetGlobalVariable = tempGraph.getGlobalVariable;

            tempGraph.getGlobalVariable = (name: string) => {
              if (name == 'page') {
                return page.getName();
              } else if (name == 'pagenumber') {
                return i + 1;
              } else if (name == 'pagecount') {
                return props.editorUi.pages != null ? props.editorUi.pages.length : 1;
              }

              return graphGetGlobalVariable.apply(tempGraph, arguments);
            };

            document.body.appendChild(tempGraph.container);
            props.editorUi.updatePageRoot(page);
            tempGraph.model.setRoot(page.root);

            pv = printGraph(tempGraph, pv, i != imax);

            if (tempGraph != props.editorUi.editor.graph) {
              tempGraph.container.parentNode.removeChild(tempGraph.container);
            }
          }
        } else {
          let scale = 1;
          let printScale = parseInt(pageScaleInput.value) / scaleValue;
          scale = parseInt(zoomInput.value) / (scaleValue * props.editorUi.editor.graph.pageScale);

          if (isNaN(scale)) {
            printScale = 1 / props.editorUi.editor.graph.pageScale;
            zoomInput.value = '100 %';
          }
          if (printZoom.value == 'fit') {
            autoOrigin = true;
          }

          if (isNaN(printScale)) {
            printScale = 1;
            pageScaleValue.value = '100%';
          }

          printScale *= scalePercentage;
          let pf = pageFormat.value || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
          if (pageStyle.value == 'landscape') {
            const h = pf.height;
            const w = pf.width;
            pf.height = w;
            pf.width = h;
          } else if (pageStyle.value == 'custom') {
            const newPageFormat: typeof mxRectangle = new mxRectangle(
              0,
              0,
              customWidth.value * scaleValue,
              customHeight.value * scaleValue,
            );
            pf = new mxRectangle(0, 0, newPageFormat.height, newPageFormat.width);
          }
          pf = mxRectangle.fromRectangle(pf);
          pf.width = Math.ceil(pf.width * printScale);
          pf.height = Math.ceil(pf.height * printScale);
          scale *= printScale;
          pv = PrintDialog.createPrintPreview(
            props.editorUi.editor.graph,
            scale,
            pf,
            0,
            0,
            0,
            autoOrigin,
          );
          pv.open();
          //pv = printGraph(props.editorUi.editor.graph, null, false);
        }

        if (pv == null) {
          props.editorUi.handleError({ message: mxResources.get('errorUpdatingPreview') });
        } else {
          if (print) {
            PrintDialog.printPreview(pv);
          }
        }
      } else {
        let printScale = parseInt(pageScaleInput.value) / scaleValue;
        if (printZoom.value == 'fit') {
          autoOrigin = true;
        }

        if (isNaN(printScale)) {
          printScale = 1;
          pageScaleValue.value = '100%';
        }

        // Workaround to match available paper size in actual print output
        printScale *= scalePercentage;
        const gb = props.editorUi.editor.graph.getGraphBounds();
        let scale = 1 / props.editorUi.editor.graph.pageScale;
        let pf = pageFormat.value || mxConstants.PAGE_FORMAT_A4_PORTRAIT;
        if (pageStyle.value == 'landscape') {
          const h = pf.height;
          const w = pf.width;
          pf.height = w;
          pf.width = h;
        } else if (pageStyle.value == 'custom') {
          const newPageFormat: typeof mxRectangle = new mxRectangle(
            0,
            0,
            customWidth.value * scaleValue,
            customHeight.value * scaleValue,
          );
          pf = new mxRectangle(0, 0, newPageFormat.height, newPageFormat.width);
        }
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
          const h = parseInt(sheetsAcrossInput.value);
          const v = parseInt(sheetsDownInput.value);

          scale = Math.min(
            (pf.height * v) / (gb.height / props.editorUi.editor.graph.view.scale),
            (pf.width * h) / (gb.width / props.editorUi.editor.graph.view.scale),
          );
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
      }

      closeModal();
    }

    function setPageFormat(format: typeof mxRectangle) {
      pageFormat.value = format;
    }

    function openPrintModal() {
      show.value = true;
      pageScaleValue.value = props.editorUi.editor.graph.pageScale * scaleValue;
      isMultiplePages.value = props.editorUi.pages.length > 1 ? true : false;
      const pageFDiamension = props.editorUi.editor.graph.pageFormat;
      maxPage.value = props.editorUi.pages.length;
      if (props.editorUi.pageStyle !== 'custom') {
        pageStyle.value = props.editorUi.pageStyle;
        if (pageStyle.value === 'landscape') {
          pageFormat.value = new mxRectangle(0, 0, pageFDiamension.height, pageFDiamension.width);
        } else {
          pageFormat.value = props.editorUi.editor.graph.pageFormat;
        }
      } else {
        pageStyle.value = props.editorUi.pageStyle;
        customWidth.value = pageFDiamension.width / pageSizeDivider;
        customHeight.value = pageFDiamension.height / pageSizeDivider;
        pageFormat.value = new mxRectangle(0, 0, 0, 0);
        showCustomPaperSize.value = true;
      }
      if (props.editorUi.pages.length > 1) {
        if (props.editorUi.getCurrentPage() != null) {
          for (let i = 0; i < props.editorUi.pages.length; i++) {
            if (props.editorUi.getCurrentPage() == props.editorUi.pages[i]) {
              currentPage.value = i + 1;
              pagesFromInput.value = i + 1;
              pagesToInput.value = i + 1;
              break;
            }
          }
        }
      }
    }

    function hideCustomPageSize() {
      if (pageFormat.value.height == 0) {
        pageStyle.value = 'custom';
      } else {
        showCustomPaperSize.value = false;
        if (pageStyle.value == 'custom') {
          pageStyle.value = 'portrait';
        }
      }
    }

    onMounted(() => {
      // window.localStorage.setItem('pageStyle', 'portrait');
      props.editorUi.addListener('openPrintModal', openPrintModal);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openPrintModal);
    });

    watch(
      () => pageStyle.value,
      (val) => {
        if (val == 'custom') {
          showCustomPaperSize.value = true;
          pageStyle.value = 'custom';
          customWidth.value = props.editorUi.editor.graph.pageFormat.width / pageSizeDivider;
          customHeight.value = props.editorUi.editor.graph.pageFormat.height / pageSizeDivider;
          pageFormat.value = new mxRectangle(0, 0, 0, 0);
        } else {
          showCustomPaperSize.value = false;
          pageStyle.value = val;
        }
      },
    );

    watch(
      () => pagesToInput.value,
      (val: number) => {
        if (val < pagesFromInput.value) {
          pagesToInput.value = Number(val) + 1;
        }
      },
    );

    return {
      closeModal,
      customHeight,
      customWidth,
      hideCustomPageSize,
      isMultiplePages,
      maxPage,
      pageFormat,
      pagesFromInput,
      pageScaleInput,
      pageScaleValue,
      PageSize,
      pageSizeDivider,
      pageType,
      pagesToInput,
      pageStyle,
      preview,
      printZoom,
      setPageFormat,
      sheetsAcrossInput,
      sheetsDownInput,
      show,
      showCustomPaperSize,
      zoomInput,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(:visible='show', no-close-on-backdrop='', no-fade, @hide='closeModal')
  template(v-slot:modal-header)
    h6 Print
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
    .pages(v-show='isMultiplePages')
      .row.ml-3.mb-3
        b-form-radio.label-center(v-model='pageType', name='page', value='all_page') Print All Pages
      .row.ml-3.mb-3
        b-form-radio.label-center(v-model='pageType', name='page', value='page') Pages
        input.ml-2.w-25(type='number', v-model='pagesFromInput', :max='maxPage', min='1')
        label.ml-2.mt-1 to
        input.ml-2.w-25(type='number', v-model='pagesToInput', :max='maxPage', min='1')
      .row.bottom-border
  .row.ml-3.mb-3.mt-4
    b-form-radio.label-center(v-model='printZoom', name='printZoom', value='adjust') Adjust to
    input.ml-2.txt-input(type='text', v-model='zoomInput')
  .row.ml-3.mb-3
    b-form-radio.label-center(v-model='printZoom', name='printZoom', value='fit') Fit to
    input.ml-2.txt-input(type='text', v-model='sheetsAcrossInput')
    label.ml-2.mt-1 sheet(s) across
  .row.ml-5.mb-3
    label.ml-2 by
    input.ml-4.txt-input(type='text', v-model='sheetsDownInput')
    label.ml-2 sheet(s) down
  .row.bottom-border
  .row.ml-3.mb-3.mt-3
    h5 Paper Size
  .row.ml-3.mb-3
    select.form-control.w-90(v-model='pageFormat', @change='hideCustomPageSize')
      option(v-for='(page, index) in PageSize', :key='index', :value='page.format') {{ page.title }}
  .row.ml-3.mb-3(v-show='showCustomPaperSize')
    input.mt-1.txt-input.w-30.ml-5(type='text', v-model='customWidth')
    label.ml-2.mt-2 in. x
    input.mt-1.txt-input.w-30.ml-2(type='text', v-model='customHeight')
    label.ml-2.mt-2 in.
  .row.ml-3.mb-3(v-show='!showCustomPaperSize')
    b-form-radio.label-center(v-model='pageStyle', name='page_type', value='portrait') Portrait
    b-form-radio.label-center.ml-2(v-model='pageStyle', name='page_type', value='landscape') Landscape
  .row.ml-3.mb-3
    label.ml-2.mt-2 Page Scale
    input.txt-input.ml-2(type='text', v-model='pageScaleInput')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-grey(type='button', @click='preview(false)')
      | Preview
    button.btn.btn-primary(type='button', @click='preview(true)')
      | Print
</template>
