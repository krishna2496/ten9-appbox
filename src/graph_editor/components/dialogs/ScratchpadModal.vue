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
import {
  mxCell,
  mxClient,
  mxEvent,
  mxEventSource,
  mxResources,
  mxUtils,
  mxUrlConverter,
} from '../../lib/jgraph/mxClient.js';
import { Editor } from '../../lib/jgraph/Editor.js';
import { Graph } from '../../lib/jgraph/Graph.js';
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

    const shapes = ref([]);

    const shapesHtml = ref([]);

    const IMAGE_PATH = '../../../../public/images';

    function closeModal() {
      show.value = false;
    }

    function setPageScale() {
      if (pageScaleValue.value != 0 && pageScaleValue.value != '') {
        props.editorUi.setPageScale(pageScaleValue.value / scaleValue);
      }
      closeModal();
    }

    function enableText(index: number) {
      alert(index);
    }

    function addButton(data: string, mimeType: string, w: any, h: any, img: any) {
      // // Ignores duplicates
      try {
        props.editorUi.spinner.stop();
        const converter = new mxUrlConverter();
        const entries = {};
        const ew = 100;
        const eh = 100;
        const images: any[] = [];
        const div: HTMLDivElement = document.createElement('div');
        // TEN9: remove the top border of the box
        // div.style.borderWidth = '1px 0px 1px 0px';
        div.style.borderWidth = '0px 0px 1px 0px';
        div.style.borderColor = '#d3d3d3';
        div.style.borderStyle = 'solid';
        div.style.marginTop = '6px';
        div.style.overflow = 'auto';
        div.style.height = '340px';
        div.style.backgroundPosition = 'center center';
        div.style.backgroundRepeat = 'no-repeat';

        const bg: HTMLDivElement = document.createElement('div');
        bg.style.position = 'absolute';
        bg.style.width = '640px';
        bg.style.top = '260px';
        bg.style.textAlign = 'center';
        bg.style.fontSize = '22px';
        bg.style.color = '#a0c3ff';

        var wrapper: any = document.createElement('div');
        if (mimeType == null || mimeType.startsWith('image/')) {
          if ((data == null && img != null) || entries[data] == null) {
            div.style.backgroundImage = '';
            bg.style.display = 'none';

            let iw = w;
            let ih = h;

            if (w > props.editorUi.maxImageSize || h > props.editorUi.maxImageSize) {
              const s = Math.min(
                1,
                Math.min(props.editorUi.maxImageSize / Math.max(1, w)),
                props.editorUi.maxImageSize / Math.max(1, h),
              );
              w *= s;
              h *= s;
            }

            if (iw > ih) {
              ih = Math.round((ih * ew) / iw);
              iw = ew;
            } else {
              iw = Math.round((iw * eh) / ih);
              ih = eh;
            }
            const outer: HTMLDivElement = document.createElement('div');
            outer.style.height = '100%';

            // TEN9: change placeholder text for the scratchpad save dailog
            //mxUtils.write(bg, mxResources.get('dragImagesHere'));
            mxUtils.write(bg, 'Scratchpad is empty');
            outer.appendChild(bg);

            wrapper.style.display = mxClient.IS_QUIRKS ? 'inline' : 'inline-block';
            wrapper.style.position = 'relative';

            mxUtils.setPrefixedStyle(wrapper.style, 'transition', 'transform .1s ease-in-out');

            if (data != null) {
              const elt: HTMLDivElement = document.createElement('img');
              elt.setAttribute('src', converter.convert(data));
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              elt.style.width = iw + 'px';
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              elt.style.height = ih + 'px';
              elt.style.margin = '10px';

              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              elt.style.paddingBottom = Math.floor((eh - ih) / 2) + 'px';
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              elt.style.paddingLeft = Math.floor((ew - iw) / 2) + 'px';

              wrapper.appendChild(elt);
            } else if (img != null) {
              // eslint-disable-next-line no-undef
              const cells: typeof mxCell = props.editorUi.stringToCells(Graph.decompress(img.xml));

              if (cells.length > 0) {
                props.editorUi.sidebar.createThumb(cells, ew, eh, wrapper, null, true, false);

                // Needs inline block on SVG for delete icon to appear on same line
                wrapper.firstChild.style.display = mxClient.IS_QUIRKS ? 'inline' : 'inline-block';
                wrapper.firstChild.style.cursor = '';
              }
            }

            const rem: HTMLImageElement = document.createElement('img');
            rem.setAttribute('src', Editor.closeImage);
            rem.setAttribute('border', '0');
            rem.setAttribute('title', mxResources.get('delete'));
            rem.setAttribute('align', 'top');
            rem.style.paddingTop = '4px';
            rem.style.position = 'absolute';
            rem.style.marginLeft = '-12px';
            rem.style.zIndex = '1';
            rem.style.cursor = 'pointer';

            wrapper.appendChild(rem);
            wrapper.style.marginBottom = '30px';

            ((wrapperDiv, dataParam, imgParam) => {
              mxEvent.addListener(rem, 'click', () => {
                entries[dataParam] = null;

                for (let i = 0; i < images.length; i++) {
                  if (
                    (images[i].data != null && images[i].data == dataParam) ||
                    (images[i].xml != null && imgParam != null && images[i].xml == imgParam.xml)
                  ) {
                    images.splice(i, 1);
                    break;
                  }
                }

                wrapper.parentNode.removeChild(wrapperDiv);

                if (images.length == 0) {
                  div.style.backgroundImage = "url('" + IMAGE_PATH + "/droptarget.png')";
                  bg.style.display = '';
                }
              });
            })(wrapper, data, img);
          }
          //else if (!errorShowed) {
          // //errorShowed = true;
          // props.editorUi.handleError({ message: mxResources.get('fileExists') });
          // }
        } else {
          let done = false;

          try {
            const doc: HTMLDocument = mxUtils.parseXml(data);

            if (doc.documentElement.nodeName == 'mxlibrary') {
              const temp = JSON.parse(mxUtils.getTextContent(doc.documentElement));

              if (temp != null && temp.length > 0) {
                for (let i = 0; i < temp.length; i++) {
                  if (temp[i].xml != null) {
                    addButton(null, null, 0, 0, temp[i]);
                  } else {
                    addButton(temp[i].data, null, temp[i].w, temp[i].h, null);
                  }
                }
              }

              done = true;
            } else if (doc.documentElement.nodeName == 'mxfile') {
              const pages = doc.documentElement.getElementsByTagName('diagram');

              for (let i = 0; i < pages.length; i++) {
                const temp = mxUtils.getTextContent(pages[i]);
                const cells = props.editorUi.stringToCells(Graph.decompress(temp));
                props.editorUi.editor.graph.getBoundingBoxFromGeometry(cells);
                // let size = props.editorUi.editor.graph.getBoundingBoxFromGeometry(cells);
                //addButton(null, null, 0, 0, 0, 0, { xml: temp, w: size.width, h: size.height });
              }

              done = true;
            }
          } catch (e) {
            // ignore
          }

          if (!done) {
            props.editorUi.spinner.stop();
            props.editorUi.handleError({ message: mxResources.get('errorLoadingFile') });
          }
        }
      } catch (e) {
        // ignore
      }

      return wrapper;
    }

    function scratchpadModal(_sender: typeof mxEventSource, event: ScratchpadData) {
      show.value = true;
      const images = event.getProperty('scratchpad');

      if (images != null) {
        for (let i = 0; i < images.length; i++) {
          const img: imageData = images[i];
          shapes.value.push(img);
          const temp: HTMLDivElement = addButton(img.data, null, img.w, img.h, img);
          const tmpNode = document.createElement('div');
          tmpNode.appendChild(temp.cloneNode(true));
          let str = tmpNode.innerHTML;
          let label;
          if (img.title) {
            label = `<div><input type="text" value="${img.title}" class="w-90" disabled id="txt${i}"></div>`;
          } else {
            label = `<div><input type="text" placeholder="Untitled" class="w-90" disabled id="txt${i}"></div>`;
          }
          str = str + label;
          shapesHtml.value.push(str);
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
      enableText,
      pageScaleValue,
      setPageScale,
      shapesHtml,
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
  size='lg',
  @hide='closeModal'
)
  template(v-slot:modal-header)
    h4 Scratchpad Data
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row
    .col-sm-2(v-for='(div, index) in shapesHtml', v-html='div')
    br
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setPageScale')
      | Apply
</template>
