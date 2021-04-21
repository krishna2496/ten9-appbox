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

import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
import { BootstrapVue, IconsPlugin, VBModal } from 'bootstrap-vue';

Vue.use(VueCompositionAPI);

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.directive('b-modal', VBModal);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
