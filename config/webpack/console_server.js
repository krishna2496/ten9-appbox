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

/* eslint-disable no-console */

const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');

const compiler = webpack(webpackConfig);
const devServerOptions = webpackConfig.devServer;

portfinder.getPort(
  {
    port: devServerOptions.port,
    stopPort: devServerOptions.port,
  },
  (err) => {
    if (err) {
      // Could not get a free port, `err` contains the reason.
      console.log(`${err.toString()}`);
      console.log(`Action: run 'lsof -i :${devServerOptions.port}' for more details`); // add as a built-in to do automatically
    } else {
      const server = new WebpackDevServer(compiler, devServerOptions);
      server.listen(devServerOptions.port, devServerOptions.host);
    }
  },
);
