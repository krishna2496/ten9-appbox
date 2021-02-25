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
import { mxCell, mxEventSource } from '../../lib/jgraph/mxClient.js';
interface InsertLinkObject {
  length: number;
  cell?: typeof mxCell;
  value?: string;
}

interface ScratchpadData {
  getProperty?(propName: string): InsertLinkObject;
}

interface imageData {
  data: string;
  w: number;
  h: number;
  aspect: string;
  title: string;
}

export default defineComponent({
  name: 'ScratchpadModal',
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

    function closeModal() {
      show.value = false;
    }

    function setPageScale() {
      if (pageScaleValue.value != 0 && pageScaleValue.value != '') {
        props.editorUi.setPageScale(pageScaleValue.value / scaleValue);
      }
      closeModal();
    }

    function addButton(
      data: string,
      mimeType: string,
      x: number,
      y: number,
      w: number,
      h: number,
      img: any,
      aspect: any,
      title: string,
    ) {
      console.log(data);
      console.log(mimeType);
      console.log(x);
      console.log(y);
      console.log(w);
      console.log(h);
      console.log(img);
      console.log(aspect);
      console.log(title);

      // // Ignores duplicates
      //     try {
      //     props.editorUi.spinner.stop();
      //         let entries = {};
      //     if (mimeType == null || mimeType.substring(0, 6) == 'image/') {
      //         if ((data == null && img != null) || entries[data] == null) {
      //         div.style.backgroundImage = '';
      //         bg.style.display = 'none';

      //         var iw = w;
      //         var ih = h;

      //         if (w > editorUi.maxImageSize || h > editorUi.maxImageSize) {
      //             var s = Math.min(
      //             1,
      //             Math.min(editorUi.maxImageSize / Math.max(1, w)),
      //             editorUi.maxImageSize / Math.max(1, h),
      //             );
      //             w *= s;
      //             h *= s;
      //         }

      //         if (iw > ih) {
      //             ih = Math.round((ih * ew) / iw);
      //             iw = ew;
      //         } else {
      //             iw = Math.round((iw * eh) / ih);
      //             ih = eh;
      //         }

      //         var wrapper = document.createElement('div');
      //         // TEN9: remove drag
      //         //wrapper.setAttribute('draggable', 'true');
      //         wrapper.style.display = mxClient.IS_QUIRKS ? 'inline' : 'inline-block';
      //         wrapper.style.position = 'relative';
      //         // TEN9: remove drag
      //         //wrapper.style.cursor = 'move';
      //         mxUtils.setPrefixedStyle(wrapper.style, 'transition', 'transform .1s ease-in-out');

      //         if (data != null) {
      //             var elt = document.createElement('img');
      //             elt.setAttribute('src', converter.convert(data));
      //             elt.style.width = iw + 'px';
      //             elt.style.height = ih + 'px';
      //             elt.style.margin = '10px';

      //             elt.style.paddingBottom = Math.floor((eh - ih) / 2) + 'px';
      //             elt.style.paddingLeft = Math.floor((ew - iw) / 2) + 'px';

      //             wrapper.appendChild(elt);
      //         } else if (img != null) {
      //             var cells = editorUi.stringToCells(Graph.decompress(img.xml));

      //             if (cells.length > 0) {
      //             editorUi.sidebar.createThumb(cells, ew, eh, wrapper, null, true, false);

      //             // Needs inline block on SVG for delete icon to appear on same line
      //             wrapper.firstChild.style.display = mxClient.IS_QUIRKS ? 'inline' : 'inline-block';
      //             wrapper.firstChild.style.cursor = '';
      //             }
      //         }

      //         var rem = document.createElement('img');
      //         rem.setAttribute('src', Editor.closeImage);
      //         rem.setAttribute('border', '0');
      //         rem.setAttribute('title', mxResources.get('delete'));
      //         rem.setAttribute('align', 'top');
      //         rem.style.paddingTop = '4px';
      //         rem.style.position = 'absolute';
      //         rem.style.marginLeft = '-12px';
      //         rem.style.zIndex = '1';
      //         rem.style.cursor = 'pointer';

      //         // Blocks dragging of remove icon
      //         mxEvent.addListener(rem, 'dragstart', function (evt) {
      //             mxEvent.consume(evt);
      //         });

      //         (function (wrapperDiv, dataParam, imgParam) {
      //             mxEvent.addListener(rem, 'click', function (evt) {
      //             entries[dataParam] = null;

      //             for (var i = 0; i < images.length; i++) {
      //                 if (
      //                 (images[i].data != null && images[i].data == dataParam) ||
      //                 (images[i].xml != null && imgParam != null && images[i].xml == imgParam.xml)
      //                 ) {
      //                 images.splice(i, 1);
      //                 break;
      //                 }
      //             }

      //             wrapper.parentNode.removeChild(wrapperDiv);

      //             if (images.length == 0) {
      //                 div.style.backgroundImage = "url('" + IMAGE_PATH + "/droptarget.png')";
      //                 bg.style.display = '';
      //             }

      //             mxEvent.consume(evt);
      //             });
      //             // Workaround for accidental select all
      //             mxEvent.addListener(rem, 'dblclick', function (evt) {
      //             mxEvent.consume(evt);
      //             });
      //         })(wrapper, data, img);

      //         wrapper.appendChild(rem);
      //         wrapper.style.marginBottom = '30px';

      //         var label = document.createElement('div');
      //         label.style.position = 'absolute';
      //         label.style.boxSizing = 'border-box';
      //         label.style.bottom = '-18px';
      //         label.style.left = '10px';
      //         label.style.right = '10px';
      //         label.style.backgroundColor = uiTheme == 'dark' ? '#2a2a2a' : '#ffffff';
      //         label.style.overflow = 'hidden';
      //         label.style.textAlign = 'center';

      //         var entry = null;

      //         if (data != null) {
      //             entry = { data: data, w: w, h: h, title: title };

      //             if (aspect != null) {
      //             entry.aspect = aspect;
      //             }

      //             entries[data] = elt;
      //             images.push(entry);
      //         } else if (img != null) {
      //             img.aspect = 'fixed';
      //             images.push(img);
      //             entry = img;
      //         }

      //         wrapper.appendChild(label);

      //         // Blocks dragging of label

      //         mxEvent.addListener(label, 'click', startEditing);
      //         mxEvent.addListener(wrapper, 'dblclick', startEditing);

      //         div.appendChild(wrapper);

      //         } else if (!errorShowed) {
      //         errorShowed = true;
      //         editorUi.handleError({ message: mxResources.get('fileExists') });
      //         }
      //     } else {
      //         var done = false;

      //         try {
      //         var doc = mxUtils.parseXml(data);

      //         if (doc.documentElement.nodeName == 'mxlibrary') {
      //             var temp = JSON.parse(mxUtils.getTextContent(doc.documentElement));

      //             if (temp != null && temp.length > 0) {
      //             for (var i = 0; i < temp.length; i++) {
      //                 if (temp[i].xml != null) {
      //                 addButton(null, null, 0, 0, 0, 0, temp[i]);
      //                 } else {
      //                 addButton(
      //                     temp[i].data,
      //                     null,
      //                     0,
      //                     0,
      //                     temp[i].w,
      //                     temp[i].h,
      //                     null,
      //                     'fixed',
      //                     temp[i].title,
      //                 );
      //                 }
      //             }
      //             }

      //             done = true;
      //         } else if (doc.documentElement.nodeName == 'mxfile') {
      //             var pages = doc.documentElement.getElementsByTagName('diagram');

      //             for (var i = 0; i < pages.length; i++) {
      //             var temp = mxUtils.getTextContent(pages[i]);
      //             var cells = editorUi.stringToCells(Graph.decompress(temp));
      //             var size = editorUi.editor.graph.getBoundingBoxFromGeometry(cells);
      //             addButton(null, null, 0, 0, 0, 0, { xml: temp, w: size.width, h: size.height });
      //             }

      //             done = true;
      //         }
      //         } catch (e) {
      //         // ignore
      //         }

      //         if (!done) {
      //         editorUi.spinner.stop();
      //         editorUi.handleError({ message: mxResources.get('errorLoadingFile') });
      //         }
      //     }
      //     } catch (e) {
      //     // ignore
      //     }

      //     return null;
    }

    function scratchpadModal(_sender: typeof mxEventSource, event: ScratchpadData) {
      show.value = true;
      const images = event.getProperty('scratchpad');

      if (images != null) {
        for (let i = 0; i < images.length; i++) {
          const img: imageData = images[i];
          addButton(img.data, null, 0, 0, img.w, img.h, img, img.aspect, img.title);
        }
      }
    }

    onMounted(() => {
      props.editorUi.addListener('scratchpadModal', scratchpadModal);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(scratchpadModal);
    });

    return {
      addButton,
      closeModal,
      pageScaleValue,
      setPageScale,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  no-close-on-backdrop='',
  ref='scratchpad',
  no-fade,
  @hide='closeModal'
)
  template(v-slot:modal-header)
    h4 Scratchpad Data
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setPageScale')
      | Apply
</template>
