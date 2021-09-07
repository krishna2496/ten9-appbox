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
import { mxEventSource, mxUtils } from '../../lib/jgraph/mxClient';
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api';
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

    const cell = ref(null);

    const names = ref<string[]>([]);

    const propertyValue = ref<string[]>([]);

    const count = ref<number>(0);

    function closeModal() {
      show.value = false;
      propertyName.value = '';
      cell.value = null;
      names.value = [];
      count.value = 0;
      propertyValue.value = [];
    }

    function setProperty() {
      const doc = mxUtils.createXmlDocument();
      let obj = doc.createElement('object');

      // Clones and updates the value
      obj = obj.cloneNode(true);
      let removeLabel = false;

      for (let i = 0; i < names.value.length; i++) {
        const data: HTMLInputElement = document.getElementById(`val${i}`) as HTMLInputElement;
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
        const isLayer = props.editorUi.getCellParent(cell.value) == props.editorUi.getPageRoot();

        if (attrs != undefined) {
          for (let i = 0; i < attrs.length; i++) {
            if ((isLayer || attrs[i].nodeName != 'label') && attrs[i].nodeName != 'placeholders') {
              names.value.push(attrs[i].nodeName);
              propertyValue.value.push(attrs[i].nodeValue);
            }
          }
        }
      }
    }

    function addProperty() {
      if (propertyName.value.indexOf(' ') >= 0) {
        throw new Error('InvalidCharacterError: Failed to execute setAttribute');
      }

      names.value.push(propertyName.value);
      propertyName.value = '';
      disable.value = true;
      propertyValue.value.push('');
    }

    function removeProperty(index: number) {
      names.value.splice(index, 1);
      propertyValue.value.splice(index, 1);
    }

    onMounted(() => {
      props.editorUi.addListener('editData', editData);
    });

    onBeforeUnmount(() => {
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
      names,
      pageId,
      propertyName,
      propertyValue,
      removeProperty,
      setProperty,
      show,
    };
  },
});
</script>

<template lang="pug">
b-modal#modal(:visible='show', no-close-on-backdrop='', no-fade, size='lg', @hide='closeModal')
  template(v-slot:modal-header)
    h6 Edit Data
    i.fa.fa-times(aria-hidden='true', @click='closeModal')
  .mw-100
  .row.ml-3
    label ID:
    label.ml-5 {{ pageId }}
  .row
    template(v-for='(name, index) in names')
      .col-sm-11
        .row.ml-2
          label.mt-1 {{ name }}
          b-form-input.b-txt-input.ml-2.mb-2(:id='`val${index}`', :value='propertyValue[index]')
      .col-sm-1
        label.pointer(@click='removeProperty(index)') X
  .row.ml-3
    input.txt-input.w-70(type='text', v-model='propertyName')
    b-button.btn.ml-3(:class='{ disable: disable }', @click='addProperty') Add Property
  template(#modal-footer='')
    b-form-checkbox.label-centers Placeholders
    b-button.btn.btn-grey(@click='closeModal')
      | Cancel
    b-button.btn.btn-primary(@click='setProperty')
      | Apply
</template>
