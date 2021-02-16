<script lang="ts">
const { mxUtils } = require('../../lib/jgraph/mxClient');
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'EditDiagramModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const xml = ref('');

    function openEditDiagram() {
      show.value = true;
      xml.value = mxUtils.getPrettyXml(props.editorUi.editor.getGraphXml());
    }

    function close() {
      show.value = false;
    }

    function setGraphData(xml: string) {
      props.editorUi.editor.graph.model.beginUpdate();
      props.editorUi.editor.setGraphXml(mxUtils.parseXml(xml).documentElement);
      props.editorUi.editor.graph.model.endUpdate();

      close();
    }

    onMounted(() => {
      props.editorUi.addListener('openEditDiagram', openEditDiagram);
    });

    onUnmounted(() => {
      props.editorUi.removeListener('openEditDiagram', openEditDiagram);
    });

    return {
      xml,
      show,
      close,
      setGraphData,
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
  @close='close',
  @hide='close'
)
  template(v-slot:modal-header)
    h4 Edit Diagram
  .textarea-container
    textarea.xml(v-model='xml') {{ xml }}
  template(v-slot:modal-footer)
    button.btn.btn-default(@click='close') Close
    button.btn.btn-primary(@click='setGraphData(xml)') OK
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
