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

import AsyncError from './AsyncError.vue';
import AsyncLoading from './AsyncLoading.vue';
import { AsyncComponent } from 'vue';
import { PropType } from '@vue/composition-api';

export const defaultAsyncComponentOptions = {
  loading: AsyncLoading,
  error: AsyncError,
  delay: 100,
  timeout: 10000,
};

export interface ExtensionInfo {
  ext: string;
  binary: boolean;
}

export type Ten9AppAsyncComponent = AsyncComponent & {
  getContentType?(): string;
  insertFile?(file: File, url?: string, event?: MouseEvent): unknown;
  insertImage?(uri: string, event?: MouseEvent): Promise<unknown>;
  updateImage?(imageResult: unknown, newUrl: string, width?: number, height?: number): void;
  resize?(): void;

  // TODO: Convert these to props and events?
  getContent?(): string | Blob;
  loadContent?(content: string | Blob): void;
  loadContentFromFile?(file: File): void;
};
export interface AppInfo {
  uniqueAppId: string;
  documentName: string;
  defaultExtension: ExtensionInfo;
  dropContainer: string;
  supportedExtensions: ExtensionInfo[];
  canLoadContent(content: string | ArrayBuffer): boolean;
  // TODO: Use a better type here
  asyncComponent(): Record<string, unknown>;
}
export interface RefreshedLinkInfo {
  url?: string;
  width?: number;
  height?: number;
}
export interface CommonAppProps {
  content: string | Blob;
  isEditing?: boolean; // this is the Preview Mode boolean.  isEditing === !isEditing
  refreshLinkHandler?(url: string): Promise<RefreshedLinkInfo> | null;
}

export const CommonAppPropsOptions = {
  content: {
    type: [String, Blob] as PropType<string | Blob>,
    required: false,
    default: null as string,
  },
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
};

export async function canLoadFile(appInfo: AppInfo, file: File): Promise<boolean> {
  if (!file || !file.name || file.name.indexOf('.') < 0) {
    return false;
  }

  const ext = `.${file.name.split('.').pop()}`;

  for (let i = 0; i < appInfo.supportedExtensions.length; i++) {
    const extInfo = appInfo.supportedExtensions[i];
    if (extInfo.ext === ext) {
      if (extInfo.binary) {
        // Extension check is good enough here for binary formats
        return true;
      } else {
        // eslint-disable-next-line no-await-in-loop
        return appInfo.canLoadContent(await file.text());
      }
    }
  }

  return false;
}
