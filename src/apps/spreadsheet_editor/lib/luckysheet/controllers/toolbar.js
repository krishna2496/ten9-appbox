import locale from '../locale/locale';
import luckysheetConfigsetting from './luckysheetConfigsetting';

import { getObjType, camel2split } from '../utils/util';

// 默认的工具栏按钮
export const defaultToolbar = [
    'undo',
    'redo',
    /* TEN9: Print icon reordered */
    'print',
    'paintFormat',
    '|',
    'zoom',
    '|',
    'currencyFormat',
    'percentageFormat',
    'numberDecrease',
    'numberIncrease',
    'moreFormats',
    '|',

    'font',
    '|',
    'fontSize',
    '|',

    'bold',
    'italic',
    'strikethrough',
    //'underline',
    'textColor',
    '|',

    'fillColor',
    'border',
    'mergeCell',
    '|',
    'horizontalAlignMode',
    'verticalAlignMode',
    'textWrapMode',
    'textRotateMode',
    '|',

    /* TEN9: Image removed from toolbar
    'image', */
    'link',
    'postil',
    'chart',
    /* TEN9: pivotTable removed from toolbar
    'pivotTable', */
    // '|',
    'sortAndFilter',
    'function',
    /* TEN9: All below toolbar menu removed from toolbar
     'frozenMode',
      'conditionalFormat',
     'dataVerification',
     'splitColumn',
     'screenshot',
     'findAndReplace',
     'protection' */
];

// 工具栏按钮 id 关系
export const toolbarIdMap = {
    undo: '#luckysheet-icon-undo', //Undo redo
    redo: '#luckysheet-icon-redo',
    paintFormat: ['#luckysheet-icon-paintformat'], //Format brush
    /*  TEN9: Added for zoom dropdown */
    zoom: '#luckysheet-icon-zoom',
    currencyFormat: '#luckysheet-icon-currency', //currency format
    percentageFormat: '#luckysheet-icon-percent', //Percentage format
    numberDecrease: '#luckysheet-icon-fmt-decimal-decrease', //'Decrease the number of decimal places'
    numberIncrease: '#luckysheet-icon-fmt-decimal-increase', //'Increase the number of decimal places
    moreFormats: '#luckysheet-icon-fmt-other', //'More Formats'
    font: '#luckysheet-icon-font-family', //'font'
    fontSize: '#luckysheet-icon-font-size', //'Font size'
    bold: '#luckysheet-icon-bold', //'Bold (Ctrl+B)'
    italic: '#luckysheet-icon-italic', //'Italic (Ctrl+I)'
    strikethrough: '#luckysheet-icon-strikethrough', //'Strikethrough (Alt+Shift+5)'
    underline: '#luckysheet-icon-underline', //'Underline (Alt+Shift+6)'
    textColor: '#luckysheet-icon-text-color-menu', //'Text color'
    fillColor: '#luckysheet-icon-cell-color-menu', //'Cell color'
    border: '#luckysheet-icon-border-menu', //'border'
    mergeCell: ['#luckysheet-icon-merge-menu', '#luckysheet-icon-merge-menu'], //'Merge cells'
    horizontalAlignMode: '#luckysheet-icon-align-menu', //'Horizontal alignment'
    verticalAlignMode: '#luckysheet-icon-valign-menu', //'Vertical alignment'
    textWrapMode: '#luckysheet-icon-textwrap-menu', //'Wrap mode'
    textRotateMode: '#luckysheet-icon-rotation-menu', //'Text Rotation Mode'
    image: '#luckysheet-insertImg-btn-title', //'Insert link'
    link: '#luckysheet-insertLink-btn-title', //'Insert picture'
    chart: '#luckysheet-chart-btn-title', //'chart' (the icon is hidden, but if the chart plugin is configured, you can still create a new chart by right click)
    postil: '#luckysheet-icon-postil', //'comment'
    pivotTable: ['#luckysheet-pivot-btn-title'], //'PivotTable'
    function: ['#luckysheet-icon-function', '#luckysheet-icon-function-menu'], //'formula'
    frozenMode: ['#luckysheet-freezen-btn-horizontal', '#luckysheet-icon-freezen-menu'], //'freeze mode'
    sortAndFilter: '#luckysheet-icon-autofilter', //'sort and filter'
    conditionalFormat: '#luckysheet-icon-conditionformat', //'Conditional Format'
    dataVerification: '#luckysheet-dataVerification-btn-title', // 'Data Verification'
    splitColumn: '#luckysheet-splitColumn-btn-title', //'Split column'
    screenshot: '#luckysheet-chart-btn-screenshot', //'screenshot'
    findAndReplace: '#luckysheet-icon-seachmore', //'Find and Replace'
    protection: '#luckysheet-icon-protection', // 'Worksheet protection'
    print: '#luckysheet-icon-print' // 'print'
};

// 创建工具栏按钮的html
export function createToolbarHtml() {
    const toolbar = locale().toolbar;
    const fontarray = locale().fontarray;
    /*  TEN9: Added for zoom dropdown */
    const zoomarray = locale().zoomarray;
    const defaultFmtArray = locale().defaultFmt;
    const htmlMap = {
        undo: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.undo}"
        id="luckysheet-icon-undo" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-undo iconfont luckysheet-iconfont-qianjin"
                        style="user-select: none;">${ /* TEN9: material design undo icon added */'' }<span class="material-icons">undo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        redo: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.redo}"
        id="luckysheet-icon-redo" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-redo iconfont luckysheet-iconfont-houtui"
                        style="user-select: none;">${ /* TEN9: material design redo icon added */'' }<span class="material-icons">redo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        paintFormat: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.paintFormat}"
        id="luckysheet-icon-paintformat" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        ${ /* <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont luckysheet-iconfont-geshishua"
                        style="user-select: none;">
                         TEN9: material icon added for paint and font-size:15px added */'' }
                        <i class="ten9-font ten9-icon-paint-format" style="font-size:16px"></i>
                        ${ /* </div> */'' }
                    </div>
                </div>
            </div>
        </div>`,
        /* TEN9: zoom dropdown added 
        zoom:`<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.zoom}" id="luckysheet-icon-zoom" role="button" style="user-select: none;margin-left:3px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <input type="text" value="${zoomarray[3]}" style="width:30px;border:0px;" id="zoom-dropdown"></input>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>`,*/

        zoom: `<div class="luckysheet-toolbar-select luckysheet-toolbar-zoom-combobox luckysheet-toolbar-combo-button luckysheet-inline-block"
        data-tips="${toolbar.zoom}" id="luckysheet-icon-zoom" style="user-select: none;width:60px">
            <div class="luckysheet-toolbar-combo-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-combo-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    ${/* TEN9 : line-height:2.5 added */'' }
                    <div aria-posinset="4" aria-setsize="7" class="luckysheet-inline-block luckysheet-toolbar-combo-button-caption"
                    style="user-select: none;line-height:2.5">
                        <input aria-label="${zoomarray[3]}" class="luckysheet-toolbar-combo-button-input luckysheet-toolbar-textinput"
                        role="combobox" id="dropdown-zoom" style="user-select: none;font-size:12px;width:40px" tabindex="-1" type="text" value="100%"
                        />
                    </div>
                    ${/* TEN9: margin-left: 8px added */'' }
                    <div class="luckysheet-toolbar-combo-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;margin-left: 13px;">
                    </div>
                </div>
            </div>
        </div>`, //'Font size'
        currencyFormat: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.currencyFormat}"
        id="luckysheet-icon-currency" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont luckysheet-iconfont-jine"
                        style="user-select: none;">
                        ${/* TEN9: material design icon added for currency */'' }
                        <span class="material-icons" style="font-size: 16px;">attach_money</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        percentageFormat: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.percentageFormat}"
        id="luckysheet-icon-percent" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        ${ /* <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont luckysheet-iconfont-baifenhao"
                        style="user-select: none;">
                        TEN9: Font awesome icon added for percentage */'' }
                        <i class="fa-solid fa-percent" style="font-size: 12px; margin-right: 2px;"></i>
                        ${ /* </div> */'' }
                    </div>
                </div>
            </div>
        </div>`, //Percentage format
        numberDecrease: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.numberDecrease}"
        id="luckysheet-icon-fmt-decimal-decrease" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block toolbar-decimal-icon"
                    style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-decimal-decrease iconfont luckysheet-iconfont-jianxiaoxiaoshuwei"
                        style="user-select: none;">
                        ${ /* TEN9: Font awesome icon added for decimal decrease */'' }
                        <i class="ten9-font ten9-icon-decimal-decrease"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Decrease the number of decimal places'
        numberIncrease: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.numberIncrease}"
        id="luckysheet-icon-fmt-decimal-increase" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block toolbar-decimal-icon"
                    style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-decimal-increase iconfont luckysheet-iconfont-zengjiaxiaoshuwei"
                        style="user-select: none;">
                        ${ /* TEN9: Font awesome icon added for decimal increase */'' }
                        <i class="ten9-font ten9-icon-decimal-increase"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Increase the number of decimal places
        moreFormats: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block" data-tips="${toolbar.moreFormats}"
        id="luckysheet-icon-fmt-other" role="button" style="user-select: none;margin-left: 3px;margin-right: 1px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;line-height: 2.3;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;font-size: 12px;">
                    ${ /* TEN9: Replaced with 123 as default text
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        ${ /*defaultFmtArray[0].text }
                    </div>
                    */'' } 123
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>`, //'More Formats'
        font: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.font}" id="luckysheet-icon-font-family" role="button" style="user-select: none;width:104px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;line-height: 2.5">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    ${/* TEN9 : font-size :12px added  */'' }
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="width: 80px;user-select: none;font-size:12px;padding: 0px 2px 0px 2px;">
                        ${fontarray[0]}
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;"><div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige" style="user-select: none;margin-left: 0px;margin-right: 4px;">
                    </div>
                    </div>
                </div>
            </div>
        </div>`, //'font'
        fontSize: `<div class="luckysheet-toolbar-select luckysheet-toolbar-zoom-combobox luckysheet-toolbar-combo-button luckysheet-inline-block"
        data-tips="${toolbar.fontSize}" id="luckysheet-icon-font-size" style="user-select: none;width:58px">
            <div class="luckysheet-toolbar-combo-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-combo-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div aria-posinset="4" aria-setsize="7" class="luckysheet-inline-block luckysheet-toolbar-combo-button-caption"
                    style="user-select: none;">
                        <input aria-label="${toolbar.fontSize}" class="luckysheet-toolbar-combo-button-input luckysheet-toolbar-textinput"
                        role="combobox" style="user-select: none;" tabindex="-1" type="text" value="10"
                        />
                    </div>
                    <div class="luckysheet-toolbar-combo-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>`, //'Font size'
        bold: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.bold}"
        id="luckysheet-icon-bold" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-bold iconfont luckysheet-iconfont-jiacu"
                        style="user-select: none;">
                        ${ /* TEN9: Material design icons bold icon added */'' }
                        <span class="material-icons">format_bold</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Bold (Ctrl+B)'
        italic: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.italic}"
        id="luckysheet-icon-italic" role="button" style="user-select: none;margin-right: 0px;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-italic iconfont luckysheet-iconfont-wenbenqingxie1"
                        style="user-select: none;">
                        ${ /* TEN9: Material design icons italic icon added */'' }
                        <span class="material-icons">format_italic</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${ /* TEN9: line break added to resolve flicker issue */'' }
        <br/>`, //'Italic (Ctrl+I)'
        strikethrough: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.strikethrough}"
        id="luckysheet-icon-strikethrough" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-strikethrough iconfont luckysheet-iconfont-wenbenshanchuxian"
                        style="user-select: none;">
                        ${ /* TEN9: Material design icons strikethrough icon added */'' }
                        <span class="material-icons">strikethrough_s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Strikethrough (Alt+Shift+5)'
        underline: `<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="${toolbar.underline}"
        id="luckysheet-icon-underline" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-underline iconfont luckysheet-iconfont-wenbenxiahuaxian"
                        style="user-select: none;">
                        ${ /* TEN9: Material design icons underline icon added */'' }
                        <span class="material-icons">format_underlined</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Underline (Alt+Shift+6)'
        textColor: `${ /* <div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-text-color"
        data-tips="${toolbar.textColor}" id="luckysheet-icon-text-color-menu" role="button" style="user-select: none;margin-right: -1px;margin-left: 2px;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;line-height: 3.5;">
                        TEN9: Material design text color icon added 
                        <span class="material-icons">format_color_text</span>
                        <div class="luckysheet-color-menu-button-indicator" style="border-bottom-color: rgb(0, 0, 0); user-select: none;">
                            <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                                TEN9: Style added left: 4px;width: 19px;
                                    <div class="text-color-bar" style="background-color:${luckysheetConfigsetting.defaultTextColor};"></div>
                                    
                                <div class="text-color-bar" style="background-color:${luckysheetConfigsetting.defaultTextColor};left: 4px;width: 19px;"></div>
                                <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-text-color iconfont luckysheet-iconfont-wenbenyanse"
                                style="user-select: none;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>*/'' }

        <div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.textColor}..." id="luckysheet-icon-text-color-menu" role="button" style="user-select: none;
        margin-top: 5px;margin-right: -1px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block" id="text-textColor"
                style="user-select: none;"><span class="material-icons">format_color_text</span>
                   
                </div>
            </div>
        </div>

        ${ /* <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.chooseColor}..." id="luckysheet-icon-text-color-menu" role="button"
        style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>*/''}`, //'Text color'
        fillColor: ` ${ /*  <div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-cell-color"
        data-tips="${toolbar.fillColor}" id="luckysheet-icon-cell-color" role="button" style="user-select: none;margin-left: 4px;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-color-menu-button-indicator" style="border-bottom-color: rgb(255, 255, 255); user-select: none;">
                            <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                                <div class="text-color-bar" style="background-color:${luckysheetConfigsetting.defaultCellColor}"></div>
                                <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-cell-color iconfont luckysheet-iconfont-tianchong"
                                style="user-select: none;">
                               TEN9: Material design icons fill color icon added
                                <span class="material-icons">format_color_fill</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.chooseColor}..." id="luckysheet-icon-cell-color-menu" role="button"
        style="user-select: none;top:2px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div> */'' }
        
        <div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.fillColor}..." id="luckysheet-icon-cell-color-menu" role="button" style="user-select: none;
        margin-top: 5px;margin-right: -6px;margin-left: -2px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block" id="text-fillColor"
                style="user-select: none;"><span class="material-icons">format_color_fill</span>
                </div>
            </div>
        </div>
        `, //'Cell color'
        border: `${ /* <div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-border-all"
        data-tips="${toolbar.border}" id="luckysheet-icon-border-all" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                     TEN9: luckysheet-iconfont-quanjiabiankuang class removed for better layout 
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-border-all iconfont"
                        style="user-select: none;">
                         TEN9: Font awesome border all icon added 
                        <span class="material-icons">border_all</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${/* TEN9 : 
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.borderStyle}..." id="luckysheet-icon-border-menu" role="button" style="user-select: none;top:2px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div> */'' }
        
        <div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.border}..." id="luckysheet-icon-border-menu" role="button" style="user-select: none;
        margin-top: 5px;padding-right: 2px;padding-left: 5px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block" id="text-fillColor"
                style="user-select: none;"><span class="material-icons">border_all</span>
                </div>
            </div>
        </div>
        
        `, //'border'
        mergeCell: `<div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.chooseMergeType}..." id="luckysheet-icon-merge-menu" role="button" style="user-select: none;margin-right: 3px;padding-right: 5px;
        padding-left: 4px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;"> <i class="ten9-font ten9-icon-merge-cell" style="font-size: 15px;
                line-height: 1.8;margin-right: 7px;"></i>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;line-height: 2.4;">
                    </div>
                </div>
            </div>
        </div>`, //'Merge cells'

        
        horizontalAlignMode: `${ /* TEN9: Structure changes to match google sheet  <div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-align"
        data-tips="${toolbar.horizontalAlign}" id="luckysheet-icon-align" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                             TEN9: id added
                                <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-align-left iconfont luckysheet-iconfont-wenbenzuoduiqi" 
                            <div aria-hidden="true" id="text-alignment" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-align-left iconfont luckysheet-iconfont-wenbenzuoduiqi"
                            style="user-select: none;">
                            TEN9: Material design icons added for align left 
                            <span class="material-icons">format_align_left</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.alignment}..." id="luckysheet-icon-align-menu" role="button" style="user-select: none;top:3px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div> */'' }
        
        <div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.horizontalAlign}..." id="luckysheet-icon-align-menu" role="button" style="user-select: none;
        margin-top: 5px;padding-right: 0px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block" id="text-alignment"
                style="user-select: none;"> <span class="material-icons">format_align_left</span>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;line-height: 2.4;left: -4px;">
                    </div>
                </div>
            </div>
        </div>
        `, //'Horizontal alignment'
        verticalAlignMode: `${ /*  TEN9: Structure changes to match google sheet 
        <div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-valign"
        data-tips="${toolbar.verticalAlign}" id="luckysheet-icon-valign" role="button" style="user-select: none;margin-left: 3px;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                             TEN9: line-height removed for better layout
                            <div aria-hidden="true" class="luckysheet-icon-img luckysheet-icon-valign-bottom iconfont luckysheet-iconfont-dibuduiqi"
                            style="user-select: none;font-size:20px;line-height: 1.3;">
                            TEN9: Material design icon added for vertical alignMode
                            <span class="material-icons">vertical_align_bottom</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        TEN9 : top:2px added for better layout 
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.alignment}..." id="luckysheet-icon-valign-menu" role="button" style="user-select: none;top:2px;margin-left: -4px;width:13px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>*/'' }
        <div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.verticalAlign}..." id="luckysheet-icon-valign-menu" role="button" style="user-select: none;
        margin-top: 5px;padding-right: 2px;padding-left: 5px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block" id="text-valignment"
                style="user-select: none;"><span class="material-icons">vertical_align_bottom</span>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;line-height: 2.4;left: -4px;">
                    </div>
                </div>
            </div>
        </div>
        `, //'Vertical alignment'
        textWrapMode: `${/* <div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-textwrap"
        data-tips="${toolbar.textWrap}" id="luckysheet-icon-textwrap" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                       TEN9: font-size:14px;style added
                         <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-textwrap-clip iconfont luckysheet-iconfont-jieduan"
                            style="user-select: none;">
                         
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-textwrap-clip iconfont luckysheet-iconfont-jieduan"
                            style="user-select: none;font-size:15px;">
                               TEN9: Font awesome wrap-overflow icon added 
                                <i class="ten9-icon-wrap-overflow"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        TEN9 : width:15px added for better layout 
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.textWrapMode}..." id="luckysheet-icon-textwrap-menu" role="button" style="user-select: none;width:15px;top:2px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;margin-left: -1px;line-height: 2;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>*/'' }
        <div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.textWrapMode}..." id="luckysheet-icon-textwrap-menu" role="button" style="user-select: none;
        margin-top: 5px;padding-right: 5px;padding-left: 7px;line-height: 1.7;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block" id="text-textWrapMode"
                style="user-select: none;font-size:15px;"><i class="ten9-icon-wrap-overflow"></i>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;line-height: 1.8;left: -2px;">
                    </div>
                </div>
            </div>
        </div>`, //'Wrap mode'
        textRotateMode: `${ /* <div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-rotation"
        data-tips="${toolbar.textRotate}" id="luckysheet-icon-rotation" role="button" style="user-select: none;margin-left: -10px;width: 23px;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                         TEN9: line-height : 1.8 removed for better layout 
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-wuxuanzhuang"
                            style="user-select: none;">
                            ${ /* TEN9: icon added for textRotateMode
                            <span class="material-icons" style="font-size:20px;line-height: 1.3;">text_rotation_none</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.textRotateMode}..." id="luckysheet-icon-rotation-menu" role="button" style="user-select: none;top:2px">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;line-height: 2;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div> */'' }

        <div class="luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.textRotate}..." id="luckysheet-icon-rotation-menu" role="button" style="user-select: none;
        margin-top: 5px;padding-left: 4px;line-height: 1.7;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block" id="text-textRotate"
                style="user-select: none;font-size:15px;"><span class="material-icons">text_rotation_none</span>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;line-height: 2.4;left: -4px;">
                    </div>
                </div>
            </div>
        </div>
        `, //'Text Rotation Mode'
        image: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.insertImage}" id="luckysheet-insertImg-btn-title" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-tupian"
                            style="user-select: none;">
                                <input id="luckysheet-imgUpload" type="file" accept="image/*" style="display:none;"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Insert picture'
        link: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.insertLink}" id="luckysheet-insertLink-btn-title" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-lianjie"
                            style="user-select: none;line-height: 1.8;">
                            ${/* TEN9: material design link icon added */''}
                            <span class="material-icons">link</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Insert link'(TODO)
        postil: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block" data-tips="${toolbar.postil}"
        id="luckysheet-icon-postil" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon-img-container luckysheet-toolbar-menu-button-caption luckysheet-inline-block iconfont luckysheet-iconfont-zhushi"
                    style="user-select: none;">
                    </div>
                    ${/* <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div> */'' }
                </div>
            </div>
        </div>`, //'comment'
        chart: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.chart}" id="luckysheet-chart-btn-title" role="button" style="user-select: none;margin-top: -1px;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-tubiao"
                            style="user-select: none;"><i class="ten9-font ten9-icon-icon-chart"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'chart' (the icon is hidden, but if the chart plugin is configured, you can still create a new chart by right click)
        postil: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block" data-tips="${toolbar.postil}"
        id="luckysheet-icon-postil" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    ${/* TEN9 :margin-top: 3px added for better layout */'' }
                    <div class="luckysheet-icon-img-container luckysheet-toolbar-menu-button-caption luckysheet-inline-block iconfont luckysheet-iconfont-zhushi"
                    style="user-select: none;margin-right: 1px;margin-left: 6px;">
                    ${/* TEN9: Material-icon comment icon added */''}
                    <i class="ten9-font ten9-icon-insert-comment"></i>
                    </div>
                    ${/*  <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div> */''}
                </div>
            </div>
        </div>
        ${ /* TEN9: line break added to resolve flicker issue */'' }
        <br/>`, //'comment'
        pivotTable: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.pivotTable}" id="luckysheet-pivot-btn-title" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-shujutoushi"
                            style="user-select: none;">
                            ${/* TEN9: Material-icon chart icon added */''}
                            <span class="material-icons">insert_chart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'PivotTable'
        function: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-icon-function"
        data-tips="${toolbar.autoSum}" id="luckysheet-icon-function" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-function iconfont luckysheet-iconfont-jisuan"
                        style="user-select: none;margin-left: 2px;">
                        ${/* TEN9: Material-icon sum icon added */''}
                        <span class="material-icons" style="line-height: 1.5;">functions</span>
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                    
                    </div>
                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.moreFunction}..." id="luckysheet-icon-function-menu" role="button" style="user-select: none;top:2px;margin-left: -6px;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;line-height: 2;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>`, //'formula'
        frozenMode: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block luckysheet-freezen-btn-horizontal"
        data-tips="${toolbar.freezeTopRow}" id="luckysheet-freezen-btn-horizontal" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">

                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-dongjie1"
                            style="user-select: none;">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="luckysheet-toolbar-button-split-right luckysheet-toolbar-menu-button luckysheet-inline-block"
        data-tips="${toolbar.moreOptions}..." id="luckysheet-icon-freezen-menu" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>`, //'freeze mode'
        sortAndFilter: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block" data-tips="${toolbar.sortAndFilter}"
        id="luckysheet-icon-autofilter" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont luckysheet-iconfont-shaixuan"
                        style="user-select: none;">
                        ${/* TEN9: Material-icons filter icon added */''}
                        <i class="ten9-font ten9-icon-auto-filter"></i>
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;margin-right: 7px;">
                    </div>
                </div>
            </div>
        </div>`, //'Sort and filter'
        conditionalFormat: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block" data-tips="${toolbar.conditionalFormat}"
        id="luckysheet-icon-conditionformat" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">

                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont luckysheet-iconfont-geshitiaojian"
                        style="user-select: none;line-height: 1.08;">
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;">
                    </div>
                </div>
            </div>
        </div>`, //'Conditional Format'
        dataVerification: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.dataVerification}" id="luckysheet-dataVerification-btn-title" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-shujuyanzheng"
                            style="user-select: none;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Data Verification'
        splitColumn: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.splitColumn}" id="luckysheet-splitColumn-btn-title" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-wenbenfenge"
                            style="user-select: none;"><i class="fa-solid fa-split"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'Split column'
        screenshot: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.screenshot}" id="luckysheet-chart-btn-screenshot" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-jieping"
                            style="user-select: none;"><i class="fa-solid fa-scissors"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, //'screenshot'
        findAndReplace: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block" data-tips="${toolbar.findAndReplace}"
        id="luckysheet-icon-seachmore" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">

                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont luckysheet-iconfont-sousuo"
                        style="user-select: none;"><i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                    <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;margin-left: 0px;margin-right: 4px;">
                    </div>
                </div>
            </div>
        </div>`, //'Find and Replace'
        protection: `<div class="luckysheet-toolbar-button-split-left luckysheet-toolbar-button luckysheet-inline-block"
        data-tips="${toolbar.protection}" id="luckysheet-icon-protection" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-menu-button-inner-box luckysheet-inline-block"
                style="user-select: none;">
                    <div class="luckysheet-toolbar-menu-button-caption luckysheet-inline-block"
                    style="user-select: none;">
                        <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                            <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-rotation-none iconfont luckysheet-iconfont-biaogesuoding"
                            style="user-select: none;"><i class="fa-solid fa-nfc-lock"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`, // 'Worksheet protection'
        print: `<div class="luckysheet-toolbar-select luckysheet-toolbar-menu-button luckysheet-inline-block" data-tips="${toolbar.print}"
        id="luckysheet-icon-print" role="button" style="user-select: none;">
            <div class="luckysheet-toolbar-menu-button-outer-box luckysheet-inline-block"
            style="user-select: none;">
                <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block"
                style="user-select: none;">

                    <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">
                        <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img luckysheet-icon-autofilter iconfont luckysheet-iconfont-dayin"
                        ${/* TEN9: Material-icons print icon added */''}
                        style="user-select: none;"><span class="material-icons" style="line-height: 1.5;">print</span>
                        </div>
                    </div>
                    ${/*  <div class="luckysheet-toolbar-menu-button-dropdown luckysheet-inline-block iconfont luckysheet-iconfont-xiayige"
                    style="user-select: none;margin-left: 0px;margin-right: 4px;">
                        </div> */'' }
                </div>
            </div>
        </div>`
    };

    const showtoolbar = luckysheetConfigsetting.showtoolbar;
    const showtoolbarConfig = luckysheetConfigsetting.showtoolbarConfig;

    const buttonHTML = ['<div class="luckysheet-toolbar-left-theme"></div>'];

    // 数组形式直接生成
    if (getObjType(showtoolbarConfig) === 'array') {
        // 此时不根据 showtoolbar=false，showtoolbarConfig为某几个进行适配，此时showtoolbarConfig本身就是全部要显示的按钮
        if (!showtoolbar) {
            return '';
        }
        let i = 0;
        showtoolbarConfig.forEach(function(key, i) {
            if (key === '|') {
                const nameKeys = showtoolbarConfig[i - 1]
                if(nameKeys !== '|') {
                    buttonHTML.push(
                        `<div id="toolbar-separator-${camel2split(nameKeys)}" class="luckysheet-toolbar-separator luckysheet-inline-block" style="user-select: none;"></div>`
                        );
                }
            } else {
                buttonHTML.push(htmlMap[key]);
            }
        });
        return buttonHTML.join('');
    }

    const config = defaultToolbar.reduce(function(total, curr) {
        if (curr !== '|') {
            total[curr] = true;
        }
        return total;
    }, {});

    if (!showtoolbar) {
        for (let s in config) {
            config[s] = false;
        }
    }

    // 对象模式 则从里面挑选 true 保留 false 删掉
    if (JSON.stringify(showtoolbarConfig) !== '{}') {
        if(showtoolbarConfig.hasOwnProperty('undoRedo')){
            config.undo = config.redo = showtoolbarConfig.undoRedo;
            // delete showtoolbarConfig.undoRedo;
        }
        Object.assign(config, showtoolbarConfig);
    }
    for (let i = 0; i < defaultToolbar.length; i++) {
        let key = defaultToolbar[i];
        if (!config[key] && key !== '|') {
            // 如果当前元素隐藏 按照之前的规则 后面紧跟的 | 分割也不需要显示了
            if (defaultToolbar[i + 1] === '|') {
                i++;
            }
            continue;
        }
        if (key === '|') {
            const nameKeys = defaultToolbar[i - 1]
            if(nameKeys !== '|') {
                buttonHTML.push(
                    `<div id="toolbar-separator-${camel2split(nameKeys)}" class="luckysheet-toolbar-separator luckysheet-inline-block" style="user-select: none;"></div>`
                );
            }
        } else {
            buttonHTML.push(htmlMap[key]);
        }
    }
    return buttonHTML.join('');
}
