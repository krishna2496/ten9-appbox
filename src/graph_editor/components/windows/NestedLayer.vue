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
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    });
    const realValue = computed(() => {
      return props.value ? props.value : props.list;
    });
    // const instance = getCurrentInstance();
    // console.log(instance.parent.parent);
    // // const selectedLayer = computed(() => store.getters['nested/getSelectedLayer']);
    // const selectedLayer = 1;

    // function emitter(value: any) {
    //   // context.emit('input', value);
    // }
    function changeSelectedLayer(id: number) {
      context.emit('changeSelectedLayer', id);
    }
    function editLayer(id: number, name: string) {
      context.emit('editLayer', id, name);
    }

    function sortDown(id: number, key: number) {
      context.emit('sortDown', id, key);
    }

    function sortUp(id: number, key: number) {
      context.emit('sortUp', id, key);
    }

    return {
      changeSelectedLayer,
      dragOptions,
      editLayer,
      // emitter,
      realValue,
      sortDown,
      sortUp,
    };
  },
});
</script>

<template lang="pug">
draggable.item-container(v-bind='dragOptions', tag='div', :list='list')
  .item-group(:key='key', v-for='(el, key) in realValue')
    .item(:class='{ active: el.id === selectedLayer }')
      .check
        span(@click='el.checked = !el.checked', title='Hide/Show')
          i.fa.fa-eye.ml-2(v-if='el.checked')
          i.fa.fa-eye-slash.ml-2(v-else)
      .layer_name(
        @click='changeSelectedLayer(el.id)',
        @dblclick='editLayer(el.id, el.name)',
        :title='el.name'
      )
        span.ml-2 {{ el.name }}
      .lock
        span.cursor-pointer(@click='el.lock = !el.lock', title='Lock/Unlock')
          i.fa.fa-lock.mr-2(v-if='el.lock')
          i.fa.fa-unlock.mr-2(v-else)
</template>

<style lang="scss" scoped>
.item-container {
  margin: 0;
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
