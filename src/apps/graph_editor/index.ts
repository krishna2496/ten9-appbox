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

import { AppInfo } from '../app_api';
import { v4 as UUIDv4 } from 'uuid';

import { defineAsyncComponent } from '@vue/composition-api';

const uniqueAppId = UUIDv4();
const documentName = 'Diagram';
const defaultExtension = '.draw';
const otherSupportedExtensions = ['.drawio', '.xml'];
const supportedExtensions = [defaultExtension, ...otherSupportedExtensions];

function canLoadContent(content: string): boolean {
  return content.startsWith('<mxfile ') || content.startsWith('<mxGraphModel ');
}

export function getAppInfo(): AppInfo {
  return {
    uniqueAppId,
    documentName,
    defaultExtension,
    supportedExtensions,
    canLoadContent,
    asyncComponent: defineAsyncComponent(
      () => import('@/apps/graph_editor/components/GraphEditor.vue'),
    ),
  };
}
