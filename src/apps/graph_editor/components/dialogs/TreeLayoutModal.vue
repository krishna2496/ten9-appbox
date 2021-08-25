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
  mxCompactTreeLayout,
  mxEventSource,
  mxFastOrganicLayout,
  mxRadialTreeLayout,
} from '../../lib/jgraph/mxClient.js';
import { defineComponent, onMounted, onUnmounted, ref } from '@vue/composition-api';

interface CustomEvent {
  getProperty?(propName: string): string;
}

export default defineComponent({
  name: 'TreeLayoutModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const spacingValue = ref(null);

    const treeType = ref<string>('');

    const spacingInput = ref<HTMLInputElement>(null);

    const { graph } = props.editorUi.editor;

    const cells = ref(null);

    const layout = ref(null);

    function closeModal() {
      show.value = false;
    }

    function getCompactTreeSpacing() {
      cells.value = graph.getSelectionCell();
      let roots = null;

      if (cells.value == null || graph.getModel().getChildCount(cells.value) == 0) {
        if (graph.getModel().getEdgeCount(cells.value) == 0) {
          roots = graph.findTreeRoots(graph.getDefaultParent());
        }
      } else {
        roots = graph.findTreeRoots(cells.value);
      }

      if (roots != null && roots.length > 0) {
        [cells.value] = roots;
      }

      if (cells.value != null) {
        spacingValue.value = 30;
      }
    }

    function setCompactTree() {
      if (treeType.value === 'Horizontal Tree') {
        layout.value = new mxCompactTreeLayout(graph, true);
      } else {
        layout.value = new mxCompactTreeLayout(graph, false);
      }
      layout.value.levelDistance = parseInt(spacingValue.value);
      props.editorUi.executeLayout(() => {
        layout.value.execute(graph.getDefaultParent(), cells.value);
      }, true);
    }

    function getRadialTree() {
      cells.value = graph.getSelectionCell();
      let roots = null;

      if (cells.value == null || graph.getModel().getChildCount(cells.value) == 0) {
        if (graph.getModel().getEdgeCount(cells.value) == 0) {
          roots = graph.findTreeRoots(graph.getDefaultParent());
        }
      } else {
        roots = graph.findTreeRoots(cells.value);
      }

      if (roots != null && roots.length > 0) {
        [cells.value] = roots;
      }

      if (cells.value != null) {
        spacingValue.value = 80;
      }
    }

    function setRadialTree() {
      layout.value = new mxRadialTreeLayout(graph);
      layout.value.levelDistance = parseInt(spacingValue.value);
      props.editorUi.executeLayout(() => {
        layout.value.execute(graph.getDefaultParent(), cells.value);

        if (!graph.isSelectionEmpty()) {
          cells.value = graph.getModel().getParent(cells.value);

          if (graph.getModel().isVertex(cells.value)) {
            graph.updateGroupBounds([cells.value], graph.gridSize * 2, true);
          }
        }
      }, true);
    }

    function getOrganic() {
      layout.value = new mxFastOrganicLayout(graph);
      spacingValue.value = layout.value.forceConstant;
    }

    function setOrganic() {
      layout.value = new mxFastOrganicLayout(graph);
      layout.value.forceConstant = parseInt(spacingValue.value);
      props.editorUi.executeLayout(() => {
        cells.value = graph.getSelectionCell();

        if (cells.value == null || graph.getModel().getChildCount(cells.value) == 0) {
          cells.value = graph.getDefaultParent();
        }

        layout.value.execute(cells.value);

        if (graph.getModel().isVertex(cells.value)) {
          graph.updateGroupBounds([cells.value], graph.gridSize * 2, true);
        }
      }, true);
    }

    function setSpacing() {
      closeModal();
      if (treeType.value === 'Horizontal Tree' || treeType.value === 'Vertical Tree') {
        setCompactTree();
      } else if (treeType.value === 'Radial Tree') {
        setRadialTree();
      } else if (treeType.value === 'Organic') {
        setOrganic();
      }
      spacingValue.value = null;
    }

    function openTreeLayout(_sender: typeof mxEventSource, event: CustomEvent) {
      treeType.value = event.getProperty('type');
      show.value = true;
      if (treeType.value === 'Horizontal Tree' || treeType.value === 'Vertical Tree') {
        getCompactTreeSpacing();
      } else if (treeType.value === 'Radial Tree') {
        getRadialTree();
      } else if (treeType.value === 'Organic') {
        getOrganic();
      }
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key == 'Enter') {
        setSpacing();
      }
    }

    function focusOnInput() {
      spacingInput.value?.select();
      spacingInput.value?.focus();
    }

    onMounted(() => {
      props.editorUi.addListener('openTreeLayout', openTreeLayout);
      document.addEventListener('keydown', onKeydown);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(openTreeLayout);
    });

    return {
      cells,
      closeModal,
      focusOnInput,
      getCompactTreeSpacing,
      getOrganic,
      getRadialTree,
      layout,
      onKeydown,
      spacingInput,
      spacingValue,
      setCompactTree,
      setOrganic,
      setRadialTree,
      setSpacing,
      show,
      treeType,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(
  :visible='show',
  no-close-on-backdrop='',
  ref='pageScale',
  no-fade,
  @hide='closeModal',
  @shown='focusOnInput'
)
  template(v-slot:modal-header)
    h6 {{ treeType }}
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3.mt-2
    label.mt-1 Spacing
    input.txt-input.ml-2(ref='spacingInput', type='number', v-model='spacingValue')
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setSpacing')
      | Apply
</template>
