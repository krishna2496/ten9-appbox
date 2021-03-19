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
import { mxEventSource, mxUtils } from '../../lib/jgraph/mxClient';
interface CustomEvent {
  getProperty: FunctionStringCallback;
}

interface node {
  nodeName: string;
  nodeValue: string;
}
interface Tag {
  attributes: Array<node>;
}

export default defineComponent({
  name: 'EditDataModal',
  props: {
    editorUi: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const show = ref<boolean>(false);

    const disable = ref<boolean>(true);

    const propertyName = ref<string>(null);

    const pageId = ref<string>('');
    // TODO: Use type here
    const cell = ref(null);

    const innerHtml = ref<string[]>([]);

    const names = ref<string[]>([]);

    const count = ref<number>(0);

    const idTrack = ref<Array<number>>([]);

    function closeModal() {
      show.value = false;
      propertyName.value = '';
      cell.value = null;
      innerHtml.value = [];
      names.value = [];
      count.value = 0;
    }

    function setProperty() {
      const doc = mxUtils.createXmlDocument();
      let obj = doc.createElement('object');

      // Clones and updates the value
      obj = obj.cloneNode(true);
      let removeLabel = false;

      for (let i = 0; i < names.value.length; i++) {
        const data: HTMLInputElement = document.getElementById(
          `val${idTrack.value[i]}`,
        ) as HTMLInputElement;
        if (data.value == null) {
          obj.removeAttribute(names.value[i]);
        } else {
          obj.setAttribute(names.value[i], data.value);
          removeLabel =
            removeLabel ||
            (names.value[i] == 'placeholder' && obj.getAttribute('placeholders') == '1');
        }
      }

      // Removes label if placeholder is assigned
      if (removeLabel) {
        obj.removeAttribute('label');
      }

      // Updates the value of the cell (undoable)
      props.editorUi.setCellValue(cell.value, obj);
      closeModal();
    }

    function editData(_sender: typeof mxEventSource, event: CustomEvent) {
      show.value = true;
      cell.value = event.getProperty('cell');
      pageId.value = cell.value.getId();
      if (pageId.value == '0') {
        pageId.value = props.editorUi.pages[0].node.id;
      }
      const value: Tag = props.editorUi.getCellValue(cell.value);

      if (value != undefined) {
        const attrs = value.attributes;
        //let temp = [];
        const isLayer = props.editorUi.getCellParent(cell.value) == props.editorUi.getPageRoot();

        if (attrs != undefined) {
          for (let i = 0; i < attrs.length; i++) {
            if ((isLayer || attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders') {
              //temp.push({ name: attrs[i].nodeName, value: attrs[i].nodeValue });
              names.value.push(attrs[i].nodeName);
              const temp = `<div class="row ml-2 mb-3"><label class="col-sm-3">${attrs[i].nodeName}:</label><input type="text" id="val${count.value}"  class="txt-input col-sm-9"value="${attrs[i].nodeValue}" ></div>`;
              innerHtml.value.push(temp);
              count.value += 1;
            }
          }
        }
      }
    }

    function addProperty() {
      if (propertyName.value.indexOf(' ') >= 0) {
        alert('InvalidCharacterError: Failed to execute setAttribute');
        return;
      }
      const temp = `<div class="row ml-2 mb-3"><label class="col-sm-3">${propertyName.value}:</label><input type="text" id="val${count.value}" r class="txt-input col-sm-9" ></div>`;
      innerHtml.value.push(temp);
      names.value.push(propertyName.value);
      propertyName.value = '';
      disable.value = true;
      idTrack.value.push(count.value);
      count.value += 1;
    }

    function removeProperty(index: number) {
      innerHtml.value.splice(index, 1);
      names.value.splice(index, 1);
      const value = idTrack.value.indexOf(index);
      const indexValue = -1;
      if (value > indexValue) {
        idTrack.value.splice(value, 1);
      }
    }

    onMounted(() => {
      props.editorUi.addListener('editData', editData);
    });

    onUnmounted(() => {
      props.editorUi.removeListener(editData);
    });

    watch(
      () => propertyName.value,
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
      idTrack,
      innerHtml,
      names,
      pageId,
      propertyName,
      removeProperty,
      setProperty,
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
  size='lg',
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
      .col-sm-11(v-html='div')
      .col-sm-1
        label.pointer(@click='removeProperty(index)') X
  .row.ml-3
    input.txt-input.w-70(type='text', v-model='propertyName')
    button.btn.ml-3(type='button', :class='{ disable: disable }', @click='addProperty') Add Property
  template(#modal-footer='')
    input(type='checkbox')
    label Placeholders
    button.btn.btn-grey(type='button', @click='closeModal')
      | Cancel
    button.btn.btn-primary(type='button', @click='setProperty')
      | Apply
</template>
