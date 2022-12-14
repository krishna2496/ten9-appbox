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

const uniqueAppId = 'ten9-spreadsheet-editor-luckysheet';
const documentName = 'Spreadsheet';
const defaultExtension = { ext: '.sheet', binary: false };
const otherSupportedExtensions = [{ ext: '.xlsx', binary: true }];
const supportedExtensions = [defaultExtension, ...otherSupportedExtensions];
const dropContainer = 'luckysheet-cell-main';

function canLoadContent(content: string | ArrayBuffer): boolean {
  if (typeof content === 'string') {
    return content.startsWith('[{"name":');
  }
  return false;
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
      component: import('./components/SpreadsheetEditor.vue'),
    }),
  };
}
