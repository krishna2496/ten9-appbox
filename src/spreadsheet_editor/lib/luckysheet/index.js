import './utils/math'
import { luckysheet } from './core'
import __firefox from './utils/polyfill'

import './css/iconCustom.css';
import './css/luckysheet-cellFormat.css';
import './css/luckysheet-core.css';
import './css/luckysheet-print.css';
import './css/luckysheet-protection.css';
import './css/luckysheet-zoom.css';
import './plugins/css/spectrum.min.css';
import './assets/iconfont/iconfont.css';

// Prevent gulp warning: 'Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification'
// window.evall = window.eval;
// polyfill event in firefox
if(window.addEventListener && (navigator.userAgent.indexOf('Firefox') > 0)){
    __firefox();
}

export default luckysheet;