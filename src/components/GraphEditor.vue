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

<template>
  <div class="geEditor" ref="container"/>
</template>

<script>
import { mxResources, mxClient } from '@/lib/jgraph/mxClient';
import EditorUi from '@/lib/jgraph/EditorUi';
import { Editor } from '@/lib/jgraph/Editor';
import{ ExportDialogXml, importXmlFile } from '@/lib/utils';
//import{ ExportDialog } from '@/lib/jgraph/Dialogs';
import Graph from '@/lib/jgraph/Graph';

import SaveFile from '@/components/SaveFile';


const defaultStyleXml = require('@/styles/default.xml');
const resourcesFile = require('@/locale/grapheditor.txt');

export default {
  name: 'GraphEditor',
  data() {
    return {
      editorUi: null,
    };
  },
  props:['isFileSave','importFile'],
  mounted() {
    mxResources.loadDefaultBundle = false;
    mxResources.parse(resourcesFile);

    const parser = new DOMParser();
    const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

    const themes = {};
    themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;
    this.editorUi = new EditorUi(new Editor(false, themes), this.$refs.container);
    mxClient.setContainer(this.editorUi.container);
  },
  methods:{
    saveFile()
    {
      new ExportDialogXml(this.editorUi);
    },
    exportXml(data)
    {
      new importXmlFile(this.editorUi,data);
    }
  },
  watch:{
    isFileSave(val)
    {
      if(val)
      {
        this.saveFile()
        this.$emit('fileSaved')
      }  
    },
    importFile(val)
    {
      if(val != '')
      {
        this.exportXml(val)
      }
    }
  }
};
</script>

<style lang="scss">
@import '../styles/grapheditor.css';
.btn{
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    margin-top: 10px;
}
.text-center{
    text-align: center!important;
}
</style>
