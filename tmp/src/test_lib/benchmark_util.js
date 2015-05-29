var browser_adapter_1 = require('angular2/src/dom/browser_adapter');
var browser_1 = require('angular2/src/facade/browser');
var lang_1 = require('angular2/src/facade/lang');
var DOM = new browser_adapter_1.BrowserDomAdapter();
function getIntParameter(name) {
    return lang_1.NumberWrapper.parseInt(getStringParameter(name), 10);
}
exports.getIntParameter = getIntParameter;
function getStringParameter(name) {
    var els = DOM.querySelectorAll(browser_1.document, "input[name=\"" + name + "\"]");
    var value;
    var el;
    for (var i = 0; i < els.length; i++) {
        el = els[i];
        var type = DOM.type(el);
        if ((type != 'radio' && type != 'checkbox') || DOM.getChecked(el)) {
            value = DOM.getValue(el);
            break;
        }
    }
    if (lang_1.isBlank(value)) {
        throw new lang_1.BaseException("Could not find and input field with name " + name);
    }
    return value;
}
exports.getStringParameter = getStringParameter;
function bindAction(selector, callback) {
    var el = DOM.querySelector(browser_1.document, selector);
    DOM.on(el, 'click', function (_) { callback(); });
}
exports.bindAction = bindAction;
function microBenchmark(name, iterationCount, callback) {
    var durationName = name + "/" + iterationCount;
    browser_1.window.console.time(durationName);
    callback();
    browser_1.window.console.timeEnd(durationName);
}
exports.microBenchmark = microBenchmark;
//# sourceMappingURL=benchmark_util.js.map
