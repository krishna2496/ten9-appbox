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
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api';
import { mxEventSource } from '../../lib/jgraph/mxClient';
interface CustomEvent {
  getProperty: FunctionStringCallback;
}

export default defineComponent({
  name: 'PageScaleModel',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const disable = ref<boolean>(true);

    const properyName = ref(null);

    const pageId = ref('');

    const cell = ref(null);

    const innerHtml = ref<Array>([]);

    function closeModal() {
      show.value = false;
    }

    function setPageScale() {
      //   if (properyName.value != 0 && properyName.value != '') {
      //     props.editorUi.setPageScale(properyName.value / scaleValue);
      //   }
      //   closeModal();
    }

    function editData(_sender: typeof mxEventSource, event: CustomEvent) {
      show.value = true;
      cell.value = event.getProperty('cell');
      pageId.value = cell.value.getId();
      //   properyName.value = props.editorUi.editor.graph.pageScale * scaleValue;
    }

    function addProperty() {
      const temp = `<div class="row ml-2 mb-3"><label class="col-sm-2">${properyName.value}</label><input type="text" class="txt-input col-sm-8" ></div>`;
      innerHtml.value.push(temp);
      properyName.value = '';
      disable.value = true;
    }

    function removeProperty(index) {
      innerHtml.value.splice(index, 1);
    }

    onMounted(() => {
      props.editorUi.addListener('editData', editData);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(editData);
    });

    watch(
      () => properyName.value,
      (val) => {
        if (val.length > 0) {
          disable.value = false;
        }
      },
    );

    return {
      addProperty,
      cell,
      closeModal,
      disable,
      innerHtml,
      pageId,
      properyName,
      removeProperty,
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
  ref='pageScale',
  no-fade,
  @hide='closeModal'
)
  template(v-slot:modal-header)
    h4 Edit Data
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3
    label ID:
    label.ml-5 {{ pageId }}
  .row
    template(v-for='(div, index) in innerHtml')
      .col-sm-10(v-html='div')
      .col-sm-2
        label(@click='removeProperty(index)') X
  .row.ml-3
    input.txt-input.w-70(type='text', v-model='properyName')
    button.btn.ml-3(type='button', :class='{ disable: disable }', @click='addProperty') Add Property
  template(#modal-footer='')
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setPageScale')
      | Apply
</template>
