import './utils/math'
import { luckysheet } from './core'
import __firefox from './utils/polyfill'

import "./plugins/css/pluginsCss.css";
import "./plugins/plugins.css";
import "./css/luckysheet.css";
import "./assets/iconfont/iconfont.css";

// Prevent gulp warning: 'Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification'
// window.evall = window.eval;
// polyfill event in firefox
if(window.addEventListener && (navigator.userAgent.indexOf("Firefox") > 0)){
    __firefox();
}

export default luckysheet;