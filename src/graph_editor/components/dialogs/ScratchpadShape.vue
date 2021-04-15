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
import { defineComponent, onMounted, PropType, ref } from '@vue/composition-api';
import {
  mxCell,
  mxClient,
  mxResources,
  mxUtils,
  mxUrlConverter,
} from '../../lib/jgraph/mxClient.js';
import { Graph } from '../../lib/jgraph/Graph.js';
interface imageData {
  data: string;
  w: number;
  h: number;
  aspect: string;
  title: string;
  xml?: string;
}
export default defineComponent({
  name: 'ScratchpadShape',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
    shape: {
      type: Object as PropType<imageData>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  setup(props, ctx) {
    const title = ref<string>('');
    function addButton(data: string, mimeType: string, w: number, h: number, img: imageData) {
      // // Ignores duplicates
      try {
        props.editorUi.spinner.stop();
        const converter = new mxUrlConverter();
        const entries = {};
        const ew = 100;
        const eh = 100;
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

        const wrapper: HTMLDivElement = document.createElement('div');
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
              // eslint-disable-next-line no-param-reassign
              w *= s;
              // eslint-disable-next-line no-param-reassign
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

                const firstChild = wrapper.firstChild as HTMLElement;

                // Needs inline block on SVG for delete icon to appear on same line
                firstChild.style.display = mxClient.IS_QUIRKS ? 'inline' : 'inline-block';
                firstChild.style.cursor = '';
              }
            }

            wrapper.style.marginBottom = '30px';
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
                props.editorUi.getBoundingBoxFromGeometry(cells);
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
        return wrapper;
      } catch (e) {
        // ignore
        return null;
      }
    }

    onMounted(() => {
      const image: imageData = props.shape;
      const temp: HTMLDivElement = addButton(image.data, null, image.w, image.h, image);
      temp.className = 'shape-svg';
      const tmpNode = document.createElement('div');
      tmpNode.className = 'col-sm-4 col-md-2 mt-4 m-2';
      tmpNode.appendChild(temp.cloneNode(true));
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      document.getElementById('shape' + props.index).appendChild(temp);
      title.value = image.title;
    });

    function removeShape() {
      ctx.emit('removeShape', props.index);
    }
    return {
      addButton,
      removeShape,
      title,
    };
  },
});
</script>

<template lang="pug">
.shape(:id='`shape${index}`')
  .shape-close
    i.fa.fa-times(aria-hidden='true', @click='removeShape')
  .shape-title
    b-form-input(:id='`txt${index}`', placeholder='Enter your name', v-model='title')
</template>
