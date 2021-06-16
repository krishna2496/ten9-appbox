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
import OpenFile from './components/OpenFile.vue';
// import { mxCell } from './apps/graph_editor/lib/jgraph/mxClient';

import { AppInfo, canLoadFile } from './apps/app_api';
import { getAppInfo as getGraphEditorAppInfo } from '@/apps/graph_editor/index';
import { getAppInfo as getSpreadsheetEditorAppInfo } from '@/apps/spreadsheet_editor/index';

import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
import { debounce } from 'lodash';

interface EventFileInfo {
  file?: File;
  size?: number;
  lastModified?: number;
  what?: string;
  imageData?: string;
}

interface FileLogEvent extends EventFileInfo {
  title: string;
}

export default defineComponent({
  name: 'App',
  components: {
    // GraphEditor,
    OpenFile,
    // SpreadsheetEditor,
  },

  setup() {
    const logs = ref([]);

    const apps = ref<Record<string, AppInfo>>({});

    const activeApp = ref<AppInfo | null>(null);

    const isEditing = ref(true);

    const isLoading = ref(false);

    const userData = ref<Record<string, unknown>>({});

    function userDataChanged(newUserData: unknown) {
      console.log(newUserData);
    }

    const contentChanged = ref(false);

    // const editor = ref(null);

    const shapeLibraries = ref('');

    const scratchpadData = ref('');

    const theme = ref('');

    const recentColors = ref('');

    // const editorType = ref(EditorList.None);

    const spreadsheet = ref(null);

    // TODO: Replace with user data
    function getShapeLibrariesFromStorage() {
      return window.localStorage.getItem('shapeLibraries');
    }

    function getScratchpadData() {
      return window.localStorage.getItem('scratchpadData');
    }

    function getThemeData() {
      return window.localStorage.getItem('theme');
    }

    function saveShapeLibrariesToStorage(libraries: string) {
      window.localStorage.setItem('shapeLibraries', libraries);
    }

    function saveScratchpadDataToStorage(xml: string) {
      window.localStorage.setItem('scratchpadData', xml);
    }

    function getRecentColorFromStorage() {
      return window.localStorage.getItem('recentColors');
    }

    function saveRecentColorsToStorage(colors: string) {
      window.localStorage.setItem('recentColors', colors);
    }

    const viewer = computed(() => {
      if (activeApp && activeApp.value && activeApp.value.asyncComponent) {
        return activeApp.value.asyncComponent;
      }
      return null;
    });

    function updateAppHeight() {
      const container = document.getElementById('container');
      const rect = container.getBoundingClientRect();
      const contentPadding = 20;
      const bottomMargin = 5;
      const newHeight = window.innerHeight - rect.top - contentPadding - bottomMargin;
      container.style.height = `${newHeight}px`;

      nextTick(() => {
        if (viewer && viewer.value && 'resize' in viewer.value) {
          viewer.value.resize();
        }

        // if (getEditorType() === EditorList.Spreadsheet) {
        //   const isLuckySheetLoaded = document.querySelector<HTMLElement>('.luckysheet');
        //   if (isLuckySheetLoaded) {
        //     spreadsheet.value.resizeEditor();
        //   }
        // } else if (getEditorType() === EditorList.Graph) {
        //   editor.value.editorUiRef.refresh();
        // }
      });
    }

    const debounceTime = 100;
    const onResize = debounce(() => {
      updateAppHeight();
    }, debounceTime);

    function addLog(fileLogEvent: FileLogEvent) {
      if (fileLogEvent.file) {
        logs.value.push(fileLogEvent.file);
      } else {
        logs.value.push(fileLogEvent);
      }

      nextTick(() => {
        const logsList = document.getElementById('logs-list');
        if (logsList) {
          logsList.scrollTop = logsList.scrollHeight;
        }
      });
    }

    // TODO: Reimplement insertImage as App Api
    function insertDummyImage(dataUri: string) {
      // TODO: Reimplement insertImage as App Api
      // add a dummy image to graph to emulate what will happen in production app
      viewer.value.insertImage(dataUri).then((result: unknown) => {
      // viewer.value.insertImage(dataUri).then((result: typeof mxCell) => {
      // editor.value.insertImage(dataUri).then((result: typeof mxCell) => {
        const waitingTime = 3000;
        setTimeout(() => {
          const newUrl = 'https://www.gettyimages.in/gi-resources/images/500px/983794168.jpg';
          // editor.value.updateCellImage(result, newUrl);
          viewer.value.updateImage(result, newUrl);
        }, waitingTime);
      });
    }

    function refreshLink(url: string): Promise<string> {
      return new Promise((resolve) => {
        const newUrl = new URL(url);
        newUrl.hash += 'a';
        resolve(newUrl.toString());
      });
    }

    function loadFileData(content: string) {
      if (viewer.value.loadContent) {
        viewer.value.loadContent(content);
      }
      // TODO: replace this with generic refresh
      // editor.value.fitCurrentPageWindow();
    }

    // TODO: Re-enable this when needed
    function onFileDropped(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'File Dropped',
        ...event,
      };

      addLog(fileLogEvent);
      const fileType = fileLogEvent.file.type.split('/');
      if (fileType[0] === 'image') {
        insertDummyImage(fileLogEvent.imageData);
      } else {
        const url = 'https://www.google.com';
        // TODO: Implement this as App API
        viewer.value.insertFile(fileLogEvent.file, url);
        // editor.value.insertFile(fileLogEvent.file, url);
      }
    }

    // TODO: Re-enable this when needed
    function onImagePasted(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'Image Pasted',
        ...event,
      };
      addLog(fileLogEvent);
      insertDummyImage(fileLogEvent.imageData);
    }

    function saveFile() {
      debugger;
      const content = viewer.value.getContent();
      const contentType = viewer.value.getContentType();
      const filename = activeApp.value.documentName.toLowerCase();
      const ext = activeApp.value.defaultExtension;

      const blob = new Blob([content], { type: contentType });

      const a = document.createElement('a');
      a.download = `${filename}.${ext}`;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = `${ext}:${a.download}:${a.href}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
      }, 0);
    }

    // TODO: Re-enable this when needed
    function onKeydown(event: KeyboardEvent) {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        saveFile();
      }
    }

    function onContentChanged(flag: boolean) {
      contentChanged.value = flag;

      let size = 0;
      if (viewer?.value?.getContent) {
        const content = viewer.value.getContent();
        if (typeof content === 'string') {
          size = content.length;
        } else {
          // Blob
          ({ size } = content);
        }
      }

      const fileLogEvent: FileLogEvent = {
        title: 'Content Changed',
        size,
        lastModified: Date.now(),
        what: 'TODO',
      };
      addLog(fileLogEvent);
    }

    onMounted(() => {
      window.addEventListener('resize', onResize);
      document.addEventListener('keydown', onKeydown);
      updateAppHeight();
    });

    function onRecentColorsChanged(colors: string) {
      saveRecentColorsToStorage(colors);
    }

    function onThemeChanged(themeName: string) {
      window.localStorage.setItem('theme', themeName);
    }

    function getImageData(file: Blob): Promise<string> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const src = reader.result as string;
          resolve(src);
        });
        reader.readAsDataURL(file);
      });
    }

    // TODO: Initialize the Graph stuff somewhere as part of App API update
    // function onGraphMounted() {
    //   updateAppHeight();

      // shapeLibraries.value = getShapeLibrariesFromStorage();
      // if (!shapeLibraries.value) {
        
      //   shapeLibraries.value = DEFAULT_SHAPE_LIBRARIES;
      //   saveShapeLibrariesToStorage(shapeLibraries.value);
      // }

      // scratchpadData.value = getScratchpadData();
      // if (!scratchpadData.value) {
      //   scratchpadData.value = DEFAULT_SCRATCHPAD_DATA;
      //   saveScratchpadDataToStorage(scratchpadData.value);
      // }

      // theme.value = getThemeData();
      // if (!theme.value) {
      //   theme.value = DEFAULT_THEME;
      //   onThemeChanged(theme.value);
      // }

      // recentColors.value = getRecentColorFromStorage();
      // if (!recentColors.value) {
      //   recentColors.value = '';
      //   saveRecentColorsToStorage(recentColors.value);
      // }

    //   const drag: HTMLElement = document.querySelector('.geEditor');

    //   drag.addEventListener('dragenter', (e: DragEvent) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //   });

    //   drag.addEventListener('dragleave', (e: DragEvent) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //   });

    //   drag.addEventListener('dragover', (e: DragEvent) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //   });

    //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //   drag.addEventListener('drop', (e: DragEvent) => {
    //     e.stopPropagation();
    //     e.preventDefault();

    //     // Don't allow drops in Preview Mode
    //     if (isEditing.value) {
    //       return;
    //     }

    //     // // TODO: Implement the canLoadFile below as part of App API
    //     // for (let i = 0; i < e.dataTransfer.items.length; i++) {
    //     //   const file = e.dataTransfer.items[i].getAsFile();
    //     //   // If the dropped item was not an editor file, process as attachment
    //     //   if (e.dataTransfer.items[i].kind === 'file') {
    //     //     editor.value.canLoadFile(file).then((canLoad: boolean) => {
    //     //       if (canLoad) {
    //     //         file.text().then((fileData) => {
    //     //           loadFileData(fileData);
    //     //         });
    //     //       } else {
    //     //         const fileInfo: EventFileInfo = {
    //     //           file,
    //     //           size: file.size,
    //     //           lastModified: file.lastModified,
    //     //         };
    //     //         getImageData(file).then((imageData: string) => {
    //     //           alert('in');
    //     //           fileInfo.imageData = imageData;
    //     //           onFileDropped(fileInfo);
    //     //         });
    //     //       }
    //     //     });
    //     //   }
    //     // }
    //   });

    //   // Add our own ctrl+v event listener
    //   drag.onpaste = (e) => {
    //     // Don't allow pasting files in Preview Mode
    //     if (isEditing.value) {
    //       return;
    //     }

    //     if (e.clipboardData.types.indexOf('text/plain') >= 0) {
    //       return;
    //     }

    //     // check if default clipboard have files or not
    //     if (e.clipboardData.files.length > 0) {
    //       for (let i = 0; i < e.clipboardData.files.length; i++) {
    //         const file = e.clipboardData.files[i];
    //         const fileInfo: EventFileInfo = {
    //           file,
    //           size: file.size,
    //           lastModified: file.lastModified,
    //         };
    //         getImageData(file).then((imageData: string) => {
    //           fileInfo.imageData = imageData;
    //           onImagePasted(fileInfo);
    //         });
    //       }
    //     } else {
    //       // if default clipboard doesn't have file then if act as normal paste
    //       const action = editor.value.editorUiRef.actions.get('paste');
    //       action.funct();
    //     }
    //   };

    //   editor.value.pagesToFit.add(editor.value.editorUiRef.getCurrentPage().getId());
    // }

    function registerApp(appInfo: AppInfo) {
      apps.value[appInfo.uniqueAppId] = appInfo;
    }

    function setActiveApp(appId: string) {
      activeApp.value = apps.value[appId];
    }

    function getSupportedExtensions() {
      const exts = new Set();
      for (const app of Object.values(apps)) {
        exts.add(app.supportedExtensions);
      }
      return exts;
    }

    function getSupportedExtensionsAsString() {
      return Array.from(getSupportedExtensions()).join(', ');
    }

    function init() {
      registerApp(getGraphEditorAppInfo());
      registerApp(getSpreadsheetEditorAppInfo());
    }

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize);
      document.addEventListener('keydown', onKeydown);
    });

    function getDateString(value: number): string {
      return new Date(value).toLocaleString();
    }

    function onFileOpened(file: File) {
      console.log(file);
      // TODO: Loop through the apps and see if we can open the file
      // TODO: Set the active app
      // TODO: Load the file
    }

    function onShapeLibrariesChanged(libraries: string) {
      saveShapeLibrariesToStorage(libraries);
      shapeLibraries.value = libraries;

      const fileLogEvent: FileLogEvent = {
        title: 'Shape Libraries Changed',
        size: libraries.length,
        lastModified: Date.now(),
      };
      addLog(fileLogEvent);
    }

    function onScratchpadDataChanged(xml: string) {
      saveScratchpadDataToStorage(xml);
      scratchpadData.value = xml;

      const fileLogEvent: FileLogEvent = {
        title: 'Scratchpad Data Changed',
        size: xml.length,
        lastModified: Date.now(),
      };
      addLog(fileLogEvent);
    }

    watch(
      () => theme.value,
      (val: string) => {
        if (val === 'min') {
          document.getElementById('page').classList.remove('col-md-10');
          document.getElementById('page').classList.add('col-md-12');
        }
      },
    );

    function appMounted() {
      isLoading.value = false;
      console.log('appMounted');

      const drag: HTMLElement = document.getElementById('container');
      // const drag: HTMLElement = document.querySelector('.geEditor');

      drag.addEventListener('dragenter', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });

      drag.addEventListener('dragleave', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });

      drag.addEventListener('dragover', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      drag.addEventListener('drop', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        // Don't allow drops unless we're Editing
        if (!isEditing.value) {
          return;
        }

        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const file = e.dataTransfer.items[i].getAsFile();
          // If the dropped item was not an editor file, process as attachment
          if (e.dataTransfer.items[i].kind === 'file') {
            canLoadFile(activeApp.value, file).then((canLoad: boolean) => {
              if (canLoad) {
                file.text().then((fileData) => {
                  loadFileData(fileData);
                });
              } else {
                // Process as an attachment
                const fileInfo: EventFileInfo = {
                  file,
                  size: file.size,
                  lastModified: file.lastModified,
                };

                // TODO: Do we assume image data here?
                getImageData(file).then((imageData: string) => {
                  fileInfo.imageData = imageData;
                  onFileDropped(fileInfo);
                });
              }
            });
          }
        }
      });

      // Add our own ctrl+v event listener
      drag.onpaste = (e) => {
        // Don't allow pasting files in Preview Mode
        if (isEditing.value) {
          return;
        }

        if (e.clipboardData.types.indexOf('text/plain') >= 0) {
          return;
        }

        // check if default clipboard have files or not
        if (e.clipboardData.files.length > 0) {
          for (let i = 0; i < e.clipboardData.files.length; i++) {
            const file = e.clipboardData.files[i];
            const fileInfo: EventFileInfo = {
              file,
              size: file.size,
              lastModified: file.lastModified,
            };
            getImageData(file).then((imageData: string) => {
              fileInfo.imageData = imageData;
              onImagePasted(fileInfo);
            });
          }
        } else {
          // TODO: Replace this with something generic from the App API
          // if default clipboard doesn't have file then if act as normal paste
          // const action = editor.value.editorUiRef.actions.get('paste');
          // action.funct();
        }
      };

      // TODO: Fix this cleanly with something from App API
      // editor.value.pagesToFit.add(editor.value.editorUiRef.getCurrentPage().getId());
    }

    init();

    return {
      addLog,
      activeApp,
      apps,
      appMounted,
      contentChanged,
      getDateString,
      getRecentColorFromStorage,
      getSupportedExtensions,
      getSupportedExtensionsAsString,
      isEditing,
      isLoading,
      logs,
      onContentChanged,
      onFileOpened,
      onRecentColorsChanged,
      onScratchpadDataChanged,
      onShapeLibrariesChanged,
      onThemeChanged,
      recentColors,
      refreshLink,
      saveFile,
      scratchpadData,
      setActiveApp,
      shapeLibraries,
      spreadsheet,
      theme,
      userData,
      userDataChanged,
      viewer,
    };
  },
});
</script>

<template lang="pug">
#app
  .row
    .col-md-2(v-if='theme != "min"')
      b-list-group#logs-list.custom-list-group
        template(v-for='(log, index) in logs')
          table.custom-table(:key='index')
            tr
              td.custom-header-background(colspan='2')
                b.text-center.custom-header {{ log.title }}
            tr(v-if='log.name')
              td.table-details
                b Filename
              td.table-details
                | {{ log.name }}
            tr(v-if='log.what')
              td.table-details
                b What
              td.table-details
                | {{ log.what }}
            tr(v-if='log.size')
              td.table-details
                b Size
              td.table-details
                | {{ log.size }}
            tr(v-if='log.type')
              td.table-details
                b Type
              td.table-details
                | {{ log.type }}
            tr(v-if='log.lastModified')
              td.table-details
                b Modified
              td.table-details
                | {{ getDateString(log.lastModified) }}
    #page.col-md-10
      .row-btn(v-if='theme != "min"')
        b-dropdown.ml-2(text='Create new...', variant='info')
          b-dropdown-item(
            v-for='item in apps',
            v-bind:title='item.documentName',
            v-bind:key='item.uniqueAppId',
            @click='setActiveApp(item.uniqueAppId)'
          )
            | {{ item.documentName }}
        b-button.ml-3(@click='saveFile', :disabled='!contentChanged', variant='info')
          | Save File
        open-file.ml-4(
          @file-opened='onFileOpened',
          :acceptExtensions='getSupportedExtensionsAsString()'
        )
        b-form-checkbox#preview.mt-1.ml-5(v-model='isEditing', switch, :disabled='!activeApp')
          | Edit Mode
      .row-btn(v-else)
        b-form-checkbox#preview.mt-1.ml-5(v-model='isEditing', switch, :disabled='!activeApp')
          | Edit Mode
      #container.ge-container
        #loadingDiv(v-if='isLoading')
          .loader
        h5(v-else-if='!activeApp')
          | Create a new file or open an existing one
        component(
          v-else,
          :is='viewer',
          :isEditing='isEditing',
          :refreshLinkHandler='refreshLink',
          :userData='userData',
          @hook:mounted='appMounted',
          @user-data-changed='userDataChanged',
          @content-changed='onContentChanged'
        )
</template>

<style lang="scss">
@import './styles/app.scss';
</style>

<!--
      #container.ge-container
        graph-editor(
          v-if='getEditorType() === EditorList.Graph',
          ref='editor',
          :enabled='!previewMode',
          :shapeLibraries='shapeLibraries',
          :scratchpadData='scratchpadData',
          :theme='theme',
          :refreshLinkHandler='refreshLink',
          :recentColors='recentColors',
          @graph-changed='onGraphChanged',
          @recent-colors-changed='onRecentColorsChanged',
          @scratchpad-data-changed='onScratchpadDataChanged',
          @shape-libraries-changed='onShapeLibrariesChanged',
          @theme-changed='onThemeChanged'
        )
        spreadsheet-editor(v-if='getEditorType() === EditorList.Spreadsheet', ref='spreadsheet')
        .col-md-12(
          v-if='getEditorType() !== EditorList.Graph && getEditorType() !== EditorList.Spreadsheet'
        )
          h1 Pick a mode */
-->
