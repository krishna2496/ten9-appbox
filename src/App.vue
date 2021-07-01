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
import {
  getAppInfo as getGraphEditorAppInfo,
  DEFAULT_RECENT_COLORS,
  DEFAULT_SCRATCHPAD_DATA,
  DEFAULT_SHAPE_LIBRARIES,
  DEFAULT_THEME,
} from '@/apps/graph_editor/index';
import { getAppInfo as getSpreadsheetEditorAppInfo } from '@/apps/spreadsheet_editor/index';
import { AppInfo, canLoadFile, RefreshedLinkInfo } from '@appsSupport/app_api';

// Uncomment the component imports to avoid async component loading
// import GraphEditor from '@/apps/graph_editor/components/GraphEditor.vue';
// import SpreadsheetEditor from '@/apps/spreadsheet_editor/components/SpreadsheetEditor.vue';

import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from '@vue/composition-api';
import { debounce } from 'lodash';

interface EventFileInfo {
  file?: File;
  size?: number;
  lastModified?: number;
  what?: string;
  dataUrl?: string;
}

interface FileLogEvent extends EventFileInfo {
  title: string;
}

export default defineComponent({
  name: 'App',
  components: {
    OpenFile,
    // TODO: Add LoadContentModal
  },

  setup() {
    const logs = ref([]);

    const apps = ref<Record<string, AppInfo>>({});

    const activeAppInfo = ref<AppInfo | null>(null);

    const activeAppRef = ref(null);

    const isEditing = ref(true);

    const saveScratchpadData = (scratchpadData: string) => {
      window.localStorage.setItem('scratchpadData', scratchpadData);
    };

    const scratchpadData = computed(() => {
      let value = window.localStorage.getItem('scratchpadData');
      if (value === null) {
        saveScratchpadData(DEFAULT_SCRATCHPAD_DATA);
        value = DEFAULT_SCRATCHPAD_DATA;
      }
      return value;
    });

    const saveShapeLibraries = (shapeLibraries: string) => {
      window.localStorage.setItem('shapeLibraries', shapeLibraries);
    };

    const shapeLibraries = computed(() => {
      let value = window.localStorage.getItem('shapeLibraries');
      if (value === null) {
        saveShapeLibraries(DEFAULT_SHAPE_LIBRARIES);
        value = DEFAULT_SHAPE_LIBRARIES;
      }
      return value;
    });

    const saveTheme = (theme: string) => {
      window.localStorage.setItem('theme', theme);
    };

    const theme = computed(() => {
      let value = window.localStorage.getItem('theme');
      if (value === null) {
        saveTheme(DEFAULT_THEME);
        value = DEFAULT_THEME;
      }
      return value;
    });

    const saveRecentColors = (recentColors: string) => {
      window.localStorage.setItem('recentColors', recentColors);
    };

    const recentColors = computed(() => {
      let value = window.localStorage.getItem('recentColors');
      if (value === null) {
        saveRecentColors(DEFAULT_RECENT_COLORS);
        value = DEFAULT_RECENT_COLORS;
      }
      return value;
    });

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

    const contentChanged = ref(false);

    const activeAppComponent = computed(() => {
      // Uncomment the switch statement below to avoid async component loading
      // switch (activeAppInfo.value.uniqueAppId) {
      //   case getGraphEditorAppInfo().uniqueAppId:
      //     return GraphEditor;
      //   case getSpreadsheetEditorAppInfo().uniqueAppId:
      //     return SpreadsheetEditor;
      //   default:
      //     return null;
      // }

      // Comment out the next line to avoid async component loading
      return activeAppInfo.value?.asyncComponent;
    });

    function updateAppHeight() {
      const container = document.getElementById('container');
      const rect = container.getBoundingClientRect();
      const contentPadding = 20;
      const bottomMargin = 5;
      const newHeight = window.innerHeight - rect.top - contentPadding - bottomMargin;
      container.style.height = `${newHeight}px`;

      nextTick(() => {
        activeAppRef.value?.resize();
      });
    }

    const debounceTime = 100;
    const onResize = debounce(() => {
      updateAppHeight();
    }, debounceTime);

    function insertDummyImage(dataUri: string) {
      // add a dummy image to graph to emulate what will happen in production app
      activeAppRef.value.insertImage(dataUri).then((result: unknown) => {
        const waitingTime = 3000;
        setTimeout(() => {
          const newUrl = 'https://www.gettyimages.in/gi-resources/images/500px/983794168.jpg';
          activeAppRef.value.updateImage(result, newUrl);
        }, waitingTime);
      });
    }

    function refreshLink(url: string): Promise<RefreshedLinkInfo> {
      return new Promise((resolve) => {
        if (url.startsWith('data:')) {
          resolve({ url: null });
        } else {
          const newUrl = new URL(url);
          newUrl.hash += 'a';
          resolve({ url: newUrl.toString() });
        }
      });
    }

    function onFileDropped(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'File Dropped',
        ...event,
      };

      addLog(fileLogEvent);
      const fileType = fileLogEvent.file.type.split('/');
      if (fileType[0] === 'image') {
        insertDummyImage(fileLogEvent.dataUrl);
      } else {
        const url = 'https://www.google.com';
        activeAppRef.value.insertFile(fileLogEvent.file, url);
      }
    }

    function onImagePasted(event: EventFileInfo) {
      const fileLogEvent: FileLogEvent = {
        title: 'Image Pasted',
        ...event,
      };
      addLog(fileLogEvent);
      insertDummyImage(fileLogEvent.dataUrl);
    }

    function saveFile() {
      const content = activeAppRef.value.getContent();
      const contentType = activeAppRef.value.getContentType();
      const filename = activeAppInfo.value.documentName.toLowerCase();
      const ext = activeAppInfo.value.defaultExtension;

      const blob = new Blob([content], { type: contentType });

      const a = document.createElement('a');
      a.download = `${filename} - ${new Date().toISOString().replaceAll(':', '')}${ext}`;
      a.href = URL.createObjectURL(blob);
      a.dataset.downloadurl = `${ext}:${a.download}:${a.href}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
      }, 0);
      contentChanged.value = false;
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        saveFile();
      }
    }

    function onContentChanged(flag: boolean) {
      contentChanged.value = flag;

      let size = 0;
      if (activeAppRef.value?.getContent) {
        const content = activeAppRef.value.getContent();
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
        what: 'content',
      };
      addLog(fileLogEvent);
    }

    function getFileAsDataURL(file: Blob): Promise<string> {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const src = reader.result as string;
          resolve(src);
        });
        reader.readAsDataURL(file);
      });
    }

    function initEventListeners(dropContainer: string) {
      const drag: HTMLElement = document.getElementById(dropContainer);
      if (drag != null) {
        const defaultDragHandler = (e: DragEvent) => {
          e.stopPropagation();
          e.preventDefault();
        };

        drag.addEventListener('dragenter', defaultDragHandler);
        drag.addEventListener('dragleave', defaultDragHandler);
        drag.addEventListener('dragover', defaultDragHandler);

        const dropHandler = (e: DragEvent) => {
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
              canLoadFile(activeAppInfo.value, file).then((canLoad: boolean) => {
                if (canLoad) {
                  file.text().then((content) => {
                    activeAppRef.value.loadContent(content);
                  });
                } else {
                  // Process as an attachment
                  const fileInfo: EventFileInfo = {
                    file,
                    size: file.size,
                    lastModified: file.lastModified,
                  };
                  getFileAsDataURL(file).then((dataUrl: string) => {
                    fileInfo.dataUrl = dataUrl;
                    onFileDropped(fileInfo);
                  });
                }
              });
            }
          }
        };

        const handlePaste = (e: ClipboardEvent) => {
          // Don't allow pasting files in Preview Mode
          if (!isEditing.value) {
            return;
          }
          const { files } = e.clipboardData;

          if (files.length <= 0) {
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
              getFileAsDataURL(file).then((dataUrl: string) => {
                fileInfo.dataUrl = dataUrl;
                onImagePasted(fileInfo);
              });
            }
          } else {
            // TODO: Do we need this?
            // TODO: Replace this with something generic from the App API
            // if default clipboard doesn't have file then if act as normal paste
            // const action = editor.value.editorUiRef.actions.get('paste');
            // action.funct();
          }
        };

        drag.addEventListener('drop', dropHandler);
        document.addEventListener('paste', (event) => {
          handlePaste(event);
        });

        // Add our own ctrl+v event listener
        drag.onpaste = (e) => {
          handlePaste(e);
        };
      }
    }

    onMounted(() => {
      window.addEventListener('resize', onResize);
      document.addEventListener('keydown', onKeydown);
      updateAppHeight();
    });

    function registerApp(appInfo: AppInfo) {
      apps.value[appInfo.uniqueAppId] = appInfo;
    }

    function setActiveApp(appId: string) {
      activeAppInfo.value = apps.value[appId];
    }

    function getSupportedExtensions() {
      const exts = new Set();
      for (const app of Object.values(apps.value)) {
        exts.add(app.supportedExtensions);
      }
      return exts;
    }

    function getSupportedExtensionsAsString() {
      return Array.from(getSupportedExtensions()).join(', ');
    }

    function getActiveAppSupportedExtensionsAsString() {
      // return '.draw';
      if (activeAppInfo.value) {
        return Array.from(activeAppInfo.value.supportedExtensions).join(', ');
      }
      return '';
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

    async function onFileOpened(file: File) {
      // TODO: Push this into the API instead of hardcoding this check
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // activeAppRef.value.loadContent(await file.arrayBuffer());
        activeAppRef.value.loadContentFromFile(file);
      } else {
        activeAppRef.value.loadContent(await file.text());
      }
    }

    function onActiveAppMounted() {
      nextTick(() => {
        initEventListeners(activeAppInfo.value.dropContainer);
      });
    }

    init();

    return {
      activeAppComponent,
      activeAppInfo,
      activeAppRef,
      apps,
      contentChanged,
      getActiveAppSupportedExtensionsAsString,
      getGraphEditorAppInfo,
      getDateString,
      getSpreadsheetEditorAppInfo,
      getSupportedExtensionsAsString,
      isEditing,
      logs,
      onContentChanged,
      onFileOpened,
      recentColors,
      refreshLink,
      saveFile,
      scratchpadData,
      setActiveApp,
      onActiveAppMounted,
      shapeLibraries,
      theme,
      saveScratchpadData,
      saveShapeLibraries,
      saveTheme,
      saveRecentColors,
    };
  },
});
</script>

<template lang="pug">
#app
  .row
    .col-md-2
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
      .row-btn
        b-dropdown.ml-3(text='Create new...', variant='info')
          b-dropdown-item(
            v-for='item in apps',
            v-bind:title='item.documentName',
            v-bind:key='item.uniqueAppId',
            @click='setActiveApp(item.uniqueAppId)'
          )
            | {{ item.documentName }}
        b-button.ml-3(@click='saveFile', :disabled='!contentChanged', variant='info')
          | Save File
        open-file.ml-3(
          @file-opened='onFileOpened',
          :acceptExtensions='getActiveAppSupportedExtensionsAsString()',
          :disabled='!activeAppInfo'
        )
        b-form-checkbox#preview.mt-1.ml-3(v-model='isEditing', switch, :disabled='!activeAppInfo')
          | Edit Mode
      #container
        div(v-if='!activeAppInfo')
          | Create a new file or open an existing one
        component(
          v-else-if='activeAppInfo.uniqueAppId === getGraphEditorAppInfo().uniqueAppId',
          ref='activeAppRef',
          :is='activeAppComponent',
          :isEditing='isEditing',
          :refreshLinkHandler='refreshLink',
          @content-changed='onContentChanged',
          :recentColors='recentColors',
          :scratchpadData='scratchpadData',
          :shapeLibraries='shapeLibraries',
          :theme='theme',
          @recent-colors-changed='saveRecentColors',
          @scratchpad-data-changed='saveScratchpadData',
          @shape-libraries-changed='saveShapeLibraries',
          @theme-changed='saveTheme',
          @hook:mounted='onActiveAppMounted'
        )
        component(
          v-else-if='activeAppInfo.uniqueAppId === getSpreadsheetEditorAppInfo().uniqueAppId',
          ref='activeAppRef',
          :is='activeAppComponent',
          :isEditing='isEditing',
          :refreshLinkHandler='refreshLink',
          @content-changed='onContentChanged',
          @hook:mounted='onActiveAppMounted'
        )
</template>

<style lang="scss">
@import './styles/app.scss';
</style>
