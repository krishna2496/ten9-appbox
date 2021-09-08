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

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';
import { codemirror } from 'vue-codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/xml-fold.js';

const { mxResources, mxUtils } = require('../../lib/jgraph/mxClient');

export default defineComponent({
  name: 'EditDiagramModal',
  components: {
    codemirror,
  },
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const code = ref(null);

    const show = ref<boolean>(false);

    const xml = ref<string>('');

    const cmRef = ref(null);

    const cmOptions = ref({
      autofocus: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      htmlMode: false,
      line: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'application/xml',
      tabSize: 4,
      theme: 'neat',
    });

    function openEditDiagram() {
      show.value = true;
      xml.value = mxUtils.getPrettyXml(props.editorUi.getGraphXml());
    }

    function onShown() {
      cmRef.value.refresh();
    }

    function closeModal() {
      show.value = false;
    }

    function setGraphData(xmlData: string) {
      if (xmlData !== null && xmlData !== '') {
        try {
          props.editorUi.setGraphData(xmlData);
          closeModal();
        } catch {
          throw new Error(mxResources.get('notADiagramFile'));
        }
      } else {
        throw new Error(mxResources.get('notADiagramFile'));
      }
    }

    onMounted(() => {
      props.editorUi.addListener('openEditDiagram', openEditDiagram);
    });

    onBeforeUnmount(() => {
      props.editorUi.removeListener(openEditDiagram);
    });

    return {
      closeModal,
      cmOptions,
      cmRef,
      code,
      onShown,
      setGraphData,
      show,
      xml,
    };
  },
});
</script>

<template lang="pug">
b-modal(
  :visible='show',
  no-close-on-backdrop='',
  modal-class='edit-diagram-modal',
  size='lg',
  @close='closeModal',
  @hide='closeModal',
  @shown='onShown',
  no-fade
)
  template(v-slot:modal-header)
    h6 Edit Diagram
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .textarea-container
    codemirror(v-model='xml', ref='cmRef', :options='cmOptions')
  template(v-slot:modal-footer)
    b-button.btn.btn-grey(@click='closeModal') Cancel
    b-button.btn.btn-primary(@click='setGraphData(xml)') OK
</template>

<style lang="scss" scoped>
.edit-diagram-modal {
  .xml {
    overflow: auto;
    font-family: monospace;
    resize: none;
    width: 100%;
    height: 360px;
    font-size: 14px;
  }
}
</style>
