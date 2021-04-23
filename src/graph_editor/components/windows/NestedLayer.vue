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
import { computed, defineComponent } from '@vue/composition-api';
import draggable from 'vuedraggable';

interface simpleInt {
  id: string;
  style: string;
  value: string;
  visible: boolean;
}

type LayerProperty = simpleInt[];

interface dragInt {
  newIndex: number;
  oldIndex: number;
}

export default defineComponent({
  name: 'NestedLayers',
  components: {
    draggable,
  },
  props: {
    value: {
      required: false,
      default: null,
      type: Array,
    },
    list: {
      required: false,
      type: Array,
      default: null,
    },
    selectedLayer: {
      required: false,
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    // Define drag option for layers
    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    });

    // Get layer listing
    const realValue = computed(() => {
      return props.value ? props.value : props.list;
    });

    // Change selected layer
    function changeSelectedLayer(id: number) {
      context.emit('change-selected-layer', id);
    }

    // Edit selected layer
    function editLayer(id: number) {
      context.emit('edit-layer', id);
    }

    // Sorting down layer
    function sortDown(id: number, key: number) {
      context.emit('sort-down', id, key);
    }

    // Sorting up layer
    function sortUp(id: number, key: number) {
      context.emit('sort-up', id, key);
    }

    // Lock/Unlock selected layer
    function lockLayer(layer: LayerProperty) {
      let locked: boolean;

      // check if layer is lock or unlock
      if (layer['style'] && layer['style'].includes('locked=1;')) {
        locked = false;
      } else {
        locked = true;
      }
      context.emit('lock-layer', layer['id'], locked);
    }

    // Check/Uncheck layer
    function checkLayer(layer: LayerProperty) {
      let checked: boolean;

      // check if layer is check or uncheck
      if (!Object.prototype.hasOwnProperty.call(layer, 'visible')) {
        checked = false;
      } else {
        if (layer['visible'] === true) {
          checked = false;
        } else {
          checked = true;
        }
      }
      context.emit('check-layer', layer['id'], checked);
    }

    // Drag layers
    function dragLayer(evt: dragInt) {
      // On layer drop get dropped index
      const { newIndex: newIndex } = evt;
      context.emit('drag-layer', newIndex);
      return true;
    }

    return {
      changeSelectedLayer,
      checkLayer,
      dragLayer,
      dragOptions,
      editLayer,
      lockLayer,
      realValue,
      sortDown,
      sortUp,
    };
  },
});
</script>

<template lang="pug">
draggable.item-container(v-bind='dragOptions', tag='div', :list='realValue', @end='dragLayer')
  .item-group(:key='el.id', v-for='(el, key) in realValue')
    .item(:class='{ active: el.id === selectedLayer }')
      .check
        span(@click='checkLayer(el)', title='Hide/Show')
          i.fa.fa-eye.ml-2(v-if='el["visible"] == undefined || el.visible')
          i.fa.fa-eye-slash.ml-2(v-else)
      .layer_name(
        @click='changeSelectedLayer(el.id)',
        @dblclick='editLayer(el.id)',
        :title='el.value'
      )
        span.ml-2 {{ el.value }}
      .lock
        span.cursor-pointer(@click='lockLayer(el)', title='Lock/Unlock')
          i.fa.fa-lock.mr-2(v-if='el["style"]')
          i.fa.fa-unlock.mr-2(v-else)
</template>

<style lang="scss" scoped>
.item-container {
  margin: 0;
  display: flex;
  flex-direction: column-reverse;
}

.item {
  padding: 5px;
  background-color: #fefefe;
  text-align: left;
  border-bottom: solid 1px #e6e6e6;
  width: 100%;
  display: inline-flex;
}

.item-sub {
  margin: 0 0 0 1rem;
}

.item.active {
  background-color: rgb(230, 239, 248);
  font-weight: bold;

  /* color: rgb(230, 239, 248); */
}

.cursor-pointer {
  padding-left: 6px !important;
}

.item input {
  vertical-align: middle;
}

.item span {
  vertical-align: middle;
}

.layer_name {
  flex-grow: 100;
  cursor: move;
  padding: 5px 0;
}

.sortDown,
.sortUp {
  color: gray;
  float: right;
  padding-right: 3px;
  cursor: pointer;
}

.sortDown {
  padding-right: 6px;
}

.sortDown:hover,
.sortUp:hover {
  color: black;
}

.sortBtns {
  float: right;
}

.check {
  margin: auto 0;
  color: gray;

  /* padding: 5px 0; */
}

.lock {
  float: right;
  margin: auto 0;
  color: gray;
}
</style>
