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

const path = require('path');
const OUTPUT_DIR = 'dist';

module.exports = {
  publicPath: '/',
  outputDir: OUTPUT_DIR,
  lintOnSave: false,
  chainWebpack: config => {

    config
      .plugin('copy')
      .tap(args => {
        args[0].push(
          {
            from: path.resolve(__dirname, 'node_modules/vue-graph-editor/dist/public'),
            to: path.resolve(__dirname, OUTPUT_DIR),
            toType: 'dir',
            ignore: [
              '.DS_Store',
            ],
          });
        return args;
      });

    config.module
      .rule('source-map-loader')
        .enforce('pre')
        .test(/vue-graph-editor.min\.js$/)
        .use('source-map-loader')
          .loader('source-map-loader')
          .end()
  },
};
