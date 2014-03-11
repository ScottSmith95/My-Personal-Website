/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.0
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */
function FastClick(e){"use strict";function t(e,t){return function(){return e.apply(t,arguments)}}var n;this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=10,this.layer=e,FastClick.notNeeded(e)||(deviceIsAndroid&&(e.addEventListener("mouseover",t(this.onMouse,this),!0),e.addEventListener("mousedown",t(this.onMouse,this),!0),e.addEventListener("mouseup",t(this.onMouse,this),!0)),e.addEventListener("click",t(this.onClick,this),!0),e.addEventListener("touchstart",t(this.onTouchStart,this),!1),e.addEventListener("touchmove",t(this.onTouchMove,this),!1),e.addEventListener("touchend",t(this.onTouchEnd,this),!1),e.addEventListener("touchcancel",t(this.onTouchCancel,this),!1),Event.prototype.stopImmediatePropagation||(e.removeEventListener=function(t,n,i){var r=Node.prototype.removeEventListener;"click"===t?r.call(e,t,n.hijacked||n,i):r.call(e,t,n,i)},e.addEventListener=function(t,n,i){var r=Node.prototype.addEventListener;"click"===t?r.call(e,t,n.hijacked||(n.hijacked=function(e){e.propagationStopped||n(e)}),i):r.call(e,t,n,i)}),"function"==typeof e.onclick&&(n=e.onclick,e.addEventListener("click",function(e){n(e)},!1),e.onclick=null))}var deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),deviceIsIOS4=deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),deviceIsIOSWithBadTarget=deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);FastClick.prototype.needsClick=function(e){"use strict";switch(e.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(e.disabled)return!0;break;case"input":if(deviceIsIOS&&"file"===e.type||e.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(e.className)},FastClick.prototype.needsFocus=function(e){"use strict";switch(e.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!deviceIsAndroid;case"input":switch(e.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!e.disabled&&!e.readOnly;default:return/\bneedsfocus\b/.test(e.className)}},FastClick.prototype.sendClick=function(e,t){"use strict";var n,i;document.activeElement&&document.activeElement!==e&&document.activeElement.blur(),i=t.changedTouches[0],n=document.createEvent("MouseEvents"),n.initMouseEvent(this.determineEventType(e),!0,!0,window,1,i.screenX,i.screenY,i.clientX,i.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,e.dispatchEvent(n)},FastClick.prototype.determineEventType=function(e){"use strict";return deviceIsAndroid&&"select"===e.tagName.toLowerCase()?"mousedown":"click"},FastClick.prototype.focus=function(e){"use strict";var t;deviceIsIOS&&e.setSelectionRange&&0!==e.type.indexOf("date")&&"time"!==e.type?(t=e.value.length,e.setSelectionRange(t,t)):e.focus()},FastClick.prototype.updateScrollParent=function(e){"use strict";var t,n;if(t=e.fastClickScrollParent,!t||!t.contains(e)){n=e;do{if(n.scrollHeight>n.offsetHeight){t=n,e.fastClickScrollParent=n;break}n=n.parentElement}while(n)}t&&(t.fastClickLastScrollTop=t.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(e){"use strict";return e.nodeType===Node.TEXT_NODE?e.parentNode:e},FastClick.prototype.onTouchStart=function(e){"use strict";var t,n,i;if(e.targetTouches.length>1)return!0;if(t=this.getTargetElementFromEventTarget(e.target),n=e.targetTouches[0],deviceIsIOS){if(i=window.getSelection(),i.rangeCount&&!i.isCollapsed)return!0;if(!deviceIsIOS4){if(n.identifier===this.lastTouchIdentifier)return e.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(t)}}return this.trackingClick=!0,this.trackingClickStart=e.timeStamp,this.targetElement=t,this.touchStartX=n.pageX,this.touchStartY=n.pageY,e.timeStamp-this.lastClickTime<200&&e.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(e){"use strict";var t=e.changedTouches[0],n=this.touchBoundary;return Math.abs(t.pageX-this.touchStartX)>n||Math.abs(t.pageY-this.touchStartY)>n?!0:!1},FastClick.prototype.onTouchMove=function(e){"use strict";return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(e.target)||this.touchHasMoved(e))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},FastClick.prototype.findControl=function(e){"use strict";return void 0!==e.control?e.control:e.htmlFor?document.getElementById(e.htmlFor):e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(e){"use strict";var t,n,i,r,o,c=this.targetElement;if(!this.trackingClick)return!0;if(e.timeStamp-this.lastClickTime<200)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=e.timeStamp,n=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,deviceIsIOSWithBadTarget&&(o=e.changedTouches[0],c=document.elementFromPoint(o.pageX-window.pageXOffset,o.pageY-window.pageYOffset)||c,c.fastClickScrollParent=this.targetElement.fastClickScrollParent),i=c.tagName.toLowerCase(),"label"===i){if(t=this.findControl(c)){if(this.focus(c),deviceIsAndroid)return!1;c=t}}else if(this.needsFocus(c))return e.timeStamp-n>100||deviceIsIOS&&window.top!==window&&"input"===i?(this.targetElement=null,!1):(this.focus(c),this.sendClick(c,e),deviceIsIOS4&&"select"===i||(this.targetElement=null,e.preventDefault()),!1);return deviceIsIOS&&!deviceIsIOS4&&(r=c.fastClickScrollParent,r&&r.fastClickLastScrollTop!==r.scrollTop)?!0:(this.needsClick(c)||(e.preventDefault(),this.sendClick(c,e)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(e){"use strict";return this.targetElement?e.forwardedTouchEvent?!0:e.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(e.stopImmediatePropagation?e.stopImmediatePropagation():e.propagationStopped=!0,e.stopPropagation(),e.preventDefault(),!1):!0:!0:!0},FastClick.prototype.onClick=function(e){"use strict";var t;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===e.target.type&&0===e.detail?!0:(t=this.onMouse(e),t||(this.targetElement=null),t)},FastClick.prototype.destroy=function(){"use strict";var e=this.layer;deviceIsAndroid&&(e.removeEventListener("mouseover",this.onMouse,!0),e.removeEventListener("mousedown",this.onMouse,!0),e.removeEventListener("mouseup",this.onMouse,!0)),e.removeEventListener("click",this.onClick,!0),e.removeEventListener("touchstart",this.onTouchStart,!1),e.removeEventListener("touchmove",this.onTouchMove,!1),e.removeEventListener("touchend",this.onTouchEnd,!1),e.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(e){"use strict";var t,n;if("undefined"==typeof window.ontouchstart)return!0;if(n=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!deviceIsAndroid)return!0;if(t=document.querySelector("meta[name=viewport]")){if(-1!==t.content.indexOf("user-scalable=no"))return!0;if(n>31&&window.innerWidth<=window.screen.width)return!0}}return"none"===e.style.msTouchAction?!0:!1},FastClick.attach=function(e){"use strict";return new FastClick(e)},"undefined"!=typeof define&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick,window.Modernizr=function(e,t,n){function i(e){v.cssText=e}function r(e,t){return i(C.join(e+";")+(t||""))}function o(e,t){return typeof e===t}function c(e,t){return!!~(""+e).indexOf(t)}function s(e,t){for(var i in e){var r=e[i];if(!c(r,"-")&&v[r]!==n)return"pfx"==t?r:!0}return!1}function a(e,t,i){for(var r in e){var c=t[e[r]];if(c!==n)return i===!1?e[r]:o(c,"function")?c.bind(i||t):c}return!1}function l(e,t,n){var i=e.charAt(0).toUpperCase()+e.slice(1),r=(e+" "+y.join(i+" ")+i).split(" ");return o(t,"string")||o(t,"undefined")?s(r,t):(r=(e+" "+S.join(i+" ")+i).split(" "),a(r,t,n))}var u="2.7.1",d={},h=!0,f=t.documentElement,p="modernizr",m=t.createElement(p),v=m.style,g,k={}.toString,C=" -webkit- -moz- -o- -ms- ".split(" "),E="Webkit Moz O ms",y=E.split(" "),S=E.toLowerCase().split(" "),w={svg:"http://www.w3.org/2000/svg"},T={},F={},b={},I=[],L=I.slice,N,x=function(e,n,i,r){var o,c,s,a,l=t.createElement("div"),u=t.body,d=u||t.createElement("body");if(parseInt(i,10))for(;i--;)s=t.createElement("div"),s.id=r?r[i]:p+(i+1),l.appendChild(s);return o=["&#173;",'<style id="s',p,'">',e,"</style>"].join(""),l.id=p,(u?l:d).innerHTML+=o,d.appendChild(l),u||(d.style.background="",d.style.overflow="hidden",a=f.style.overflow,f.style.overflow="hidden",f.appendChild(d)),c=n(l,e),u?l.parentNode.removeChild(l):(d.parentNode.removeChild(d),f.style.overflow=a),!!c},O={}.hasOwnProperty,M;M=o(O,"undefined")||o(O.call,"undefined")?function(e,t){return t in e&&o(e.constructor.prototype[t],"undefined")}:function(e,t){return O.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function j(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=L.call(arguments,1),i=function(){if(this instanceof i){var r=function(){};r.prototype=t.prototype;var o=new r,c=t.apply(o,n.concat(L.call(arguments)));return Object(c)===c?c:o}return t.apply(e,n.concat(L.call(arguments)))};return i}),T.flexbox=function(){return l("flexWrap")},T.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:x(["@media (",C.join("touch-enabled),("),p,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=9===e.offsetTop}),n},T.cssanimations=function(){return l("animationName")},T.csscolumns=function(){return l("columnCount")},T.svg=function(){return!!t.createElementNS&&!!t.createElementNS(w.svg,"svg").createSVGRect};for(var P in T)M(T,P)&&(N=P.toLowerCase(),d[N]=T[P](),I.push((d[N]?"":"no-")+N));return d.addTest=function(e,t){if("object"==typeof e)for(var i in e)M(e,i)&&d.addTest(i,e[i]);else{if(e=e.toLowerCase(),d[e]!==n)return d;t="function"==typeof t?t():t,"undefined"!=typeof h&&h&&(f.className+=" "+(t?"":"no-")+e),d[e]=t}return d},i(""),m=g=null,function(e,t){function n(e,t){var n=e.createElement("p"),i=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",i.insertBefore(n.lastChild,i.firstChild)}function i(){var e=k.elements;return"string"==typeof e?e.split(" "):e}function r(e){var t=v[e[p]];return t||(t={},m++,e[p]=m,v[m]=t),t}function o(e,n,i){if(n||(n=t),g)return n.createElement(e);i||(i=r(n));var o;return o=i.cache[e]?i.cache[e].cloneNode():h.test(e)?(i.cache[e]=i.createElem(e)).cloneNode():i.createElem(e),!o.canHaveChildren||d.test(e)||o.tagUrn?o:i.frag.appendChild(o)}function c(e,n){if(e||(e=t),g)return e.createDocumentFragment();n=n||r(e);for(var o=n.frag.cloneNode(),c=0,s=i(),a=s.length;a>c;c++)o.createElement(s[c]);return o}function s(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return k.shivMethods?o(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+i().join().replace(/[\w\-]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(k,t.frag)}function a(e){e||(e=t);var i=r(e);return!k.shivCSS||f||i.hasCSS||(i.hasCSS=!!n(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),g||s(e,i),e}var l="3.7.0",u=e.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,p="_html5shiv",m=0,v={},g;!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",f="hidden"in e,g=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(n){f=!0,g=!0}}();var k={elements:u.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:l,shivCSS:u.shivCSS!==!1,supportsUnknownElements:g,shivMethods:u.shivMethods!==!1,type:"default",shivDocument:a,createElement:o,createDocumentFragment:c};e.html5=k,a(t)}(this,t),d._version=u,d._prefixes=C,d._domPrefixes=S,d._cssomPrefixes=y,d.testProp=function(e){return s([e])},d.testAllProps=l,d.testStyles=x,f.className=f.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(h?" js "+I.join(" "):""),d}(this,this.document),window.addEventListener("load",function(){FastClick.attach(document.body)},!1);
//# sourceMappingURL=./main.map