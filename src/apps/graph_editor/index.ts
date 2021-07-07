/**
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
 */

import { AppInfo, defaultAsyncComponentOptions } from '@appsSupport/app_api';

export const DEFAULT_SHAPE_LIBRARIES = 'general;basic;arrows2;clipart;flowchart';
export const DEFAULT_SCRATCHPAD_DATA = '<mxlibrary>[]</mxlibrary>';
export const DEFAULT_THEME = 'kennedy';
export const DEFAULT_RECENT_COLORS = '';

const uniqueAppId = 'ten9-graph-editor';
const documentName = 'Diagram';
const defaultExtension = { ext: '.draw', binary: false };
const otherSupportedExtensions = [
  { ext: '.drawio', binary: false },
  { ext: '.xml', binary: false },
];
const supportedExtensions = [defaultExtension, ...otherSupportedExtensions];
const dropContainer = 'container';

function canLoadContent(content: string): boolean {
  return content.startsWith('<mxfile ') || content.startsWith('<mxGraphModel ');
}

export function getAppInfo(): AppInfo {
  return {
    uniqueAppId,
    documentName,
    defaultExtension,
    supportedExtensions,
    dropContainer,
    canLoadContent,
    asyncComponent: () => ({
      ...defaultAsyncComponentOptions,
      component: import('./components/GraphEditor.vue'),
    }),
  };
}
