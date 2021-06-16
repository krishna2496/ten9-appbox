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

import { AsyncComponent } from 'vue';
import { PropType } from '@vue/composition-api';

export type Ten9AppAsyncComponent = AsyncComponent & {
  getContent?(): string | Blob;
  getContentType?(): string;
  insertFile?(file: File, url?: string): void;
  insertImage?(uri: string, event?: MouseEvent): Promise<unknown>;
  updateImage?(imageResult: unknown, newUrl: string): void;
  loadContent?(content: string | Blob): void;
  loadContentFromFile?(file: File): void;
  resize?(): void;
};

export interface AppInfo {
  uniqueAppId: string;
  documentName: string;
  defaultExtension: string;
  supportedExtensions: string[];
  canLoadContent(content: string): boolean;
  asyncComponent: Ten9AppAsyncComponent;
}

export interface RefreshedLinkInfo {
  url?: string;
  width?: number;
  height?: number;
}

export interface CommonAppProps {
  isEditing?: boolean; // this is the Preview Mode boolean.  isEditing === !isEditing
  refreshLinkHandler?(url: string): Promise<RefreshedLinkInfo> | null;
  userData?: Record<string, unknown>;
}

export const CommonAppPropsOptions = {
  isEditing: {
    type: Boolean,
    required: false,
    default: false,
  },
  refreshLinkHandler: {
    type: Function as PropType<(url: string) => Promise<RefreshedLinkInfo>>,
    required: false,
    default: () => ({}),
  },
  userData: {
    type: Object,
    required: false,
    default: {},
  },
};

export async function canLoadFile(appData: AppInfo, file: File): Promise<boolean> {
  if (file.name.indexOf('.') < 0) {
    return false;
  }

  const ext = `.${file.name.split('.').pop()}`;

  if (!appData.supportedExtensions.includes(ext)) {
    return false;
  }

  return appData.canLoadContent(await file.text());
}
