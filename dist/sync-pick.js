!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var s=e();for(var i in s)("object"==typeof exports?exports:t)[i]=s[i]}}(window,(function(){return function(t){var e={};function s(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}return s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SyncPick=void 0,s(1);var i=l(s(2)),n=l(s(4)),o=l(s(5));function l(t){return t&&t.__esModule?t:{default:t}}i.default.i18n={de:n.default,en:o.default},e.SyncPick=i.default},function(t,e,s){},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=l;var i,n=s(3),o=(i=n)&&i.__esModule?i:{default:i};function l(t){return this.id=t.id,this.label=document.querySelector('label[for="'+this.id+'"]'),this.isInitialized()&&l.elements[this.id].destroy(),this.element=document.getElementById(this.id),this.language=t.language||document.documentElement.lang||"en",this.i18n=l.i18n?l.i18n[this.language]:{},this.textProp=t.textProp||"name",this.subtextProp=t.subtextProp||"subtext",this.buttonClasses=t.buttonClasses||[],this.emptySelectButtonText=t.emptySelectButtonText||this.i18n.emptySelectButtonText||"Select",this.buttonDisabledClasses=t.buttonDisabledClasses||[],this.buttonIconClasses=t.buttonIconClasses||["fas","fa-fw","fa-caret-down"],this.checkedIconClasses=t.checkedIconClasses||["fas","fa-fw","fa-check"],this.listClasses=t.listClasses||[],this.selectedTextFormat=t.selectedTextFormat||null,this.selectedTextVariable=t.selectedTextVariable||"%num%",this.selectedText=t.selectedText||this.i18n.selectedText||this.selectedTextVariable+" selected",this.container=t.container||null,this.dropdownAlignRight=!!t.dropdownAlignRight,this.popupWidth=t.popupWidth||"300px",this.values=t.values||null,this.dropdownValues=t.dropdownValues||null,this.debug=t.debug||!1,this.customDebugHandler=t.customDebugHandler||null,this.disabled=!!this.element.disabled||!!t.disabled,this.blankOption={},this.open=!1,this.initialize(),this.logDebugMessage("initialized with options:",this),this}l.elements={},l.prototype.initialize=function(){if(this.markup=this.buildMarkup(),this.disabled||(this.addHandlers(),this.addEvents()),this.setupValues(),this.setupBlankOption(),!this.disabled){var t=this.markup.appendEntries(this.dropdownValues);this.addEventListenersForPage(t)}this.register(),this.markup.setButtonText(this.values)},l.prototype.buildMarkup=function(){return new o.default({element:this.element,disabled:this.disabled,textProp:this.textProp,subtextProp:this.subtextProp,buttonClasses:this.buttonClasses,buttonDisabledClasses:this.buttonDisabledClasses,emptySelectButtonText:this.emptySelectButtonText,buttonIconClasses:this.buttonIconClasses,checkedIconClasses:this.checkedIconClasses,listClasses:this.listClasses,selectedTextFormat:this.selectedTextFormat,selectedTextVariable:this.selectedTextVariable,selectedText:this.selectedText,noResultsText:this.noResultsText,dividerText:this.dividerText,container:this.container,dropdownAlignRight:this.dropdownAlignRight,popupWidth:this.popupWidth})},l.prototype.addHandlers=function(){this.togglePopupHandler=this.togglePopup.bind(this),this.closePopupHandler=this.closePopup.bind(this),this.selectHandler=this.select.bind(this),this.stopPropagationHandler=function(t){t.stopPropagation()},this.buttonKeyHandler=this.onButtonKeyDown.bind(this),this.markupKeyHandler=this.onMarkupKeyDown.bind(this),this.labelClickHandler=function(t){t.preventDefault(),this.markup.button.focus()}.bind(this),this.containerPositionHandler=this.markup.positionPopup.bind(this.markup)},l.prototype.onButtonKeyDown=function(t){13===t.keyCode&&(t.preventDefault(),this.togglePopup(t))},l.prototype.onMarkupKeyDown=function(t){if(9===t.keyCode||27===t.keyCode)this.closePopupAndFocus();else if(40===t.keyCode)this.markup.focusNextEntry();else if(38===t.keyCode)this.markup.focusPreviousEntry();else if(13===t.keyCode){t.preventDefault();var e=this.markup.getSelected();e&&this.select({currentTarget:e})}},l.prototype.addEvents=function(){this.markup.button.addEventListener("click",this.togglePopupHandler),this.markup.popup.addEventListener("click",this.stopPropagationHandler),this.markup.button.addEventListener("keydown",this.buttonKeyHandler),this.markup.popup.addEventListener("keydown",this.markupKeyHandler),document.addEventListener("click",this.closePopupHandler),window.addEventListener("resize",this.containerPositionHandler),window.addEventListener("scroll",this.containerPositionHandler),this.label&&this.label.addEventListener("click",this.labelClickHandler);var t,e,s,i=this;t=this.markup.element,e=function(){i.destroy()},(s=new MutationObserver((function(){(function t(e){return e.parentNode!==document&&(null===e.parentNode||t(e.parentNode))})(t)&&(s.disconnect(),e())}))).observe(document,{childList:!0,subtree:!0})},l.prototype.removeEvents=function(){var t=this;this.markup.button.removeEventListener("click",this.togglePopupHandler),Array.apply(null,this.markup.resultsWrapper.querySelectorAll("li")).forEach((function(e){e.removeEventListener("click",t.selectHandler)})),this.markup.popup.removeEventListener("click",this.stopPropagationHandler),this.markup.button.removeEventListener("keydown",this.buttonKeyHandler),this.markup.popup.removeEventListener("keydown",this.markupKeyHandler),document.removeEventListener("click",this.closePopupHandler),window.removeEventListener("resize",this.containerPositionHandler),window.removeEventListener("scroll",this.containerPositionHandler),this.label&&this.label.removeEventListener("click",this.labelClickHandler)},l.prototype.setupValues=function(){if(!this.values){this.values={},this.dropdownValues={};var t=this;Array.apply(null,this.element.options).filter((function(t){return t.selected})).forEach((function(e){t.values[e.value]=t.buildValue(e.innerHTML,e.getAttribute("data-subtext"),e.selected.toString())})),Array.apply(null,this.element.options).forEach((function(e){t.dropdownValues[e.value]=t.buildValue(e.innerHTML,e.getAttribute("data-subtext"),e.selected.toString())}))}},l.prototype.setupBlankOption=function(){var t=Array.apply(null,this.element.options).filter((function(t){return""===t.value}))[0];t&&(this.blankOption[""]=t.innerHTML)},l.prototype.togglePopup=function(){this.open?this.closePopupAndFocus():this.openPopup()},l.prototype.openPopup=function(){this.markup.popup.classList.add("ap__popup--visible"),this.open=!0,this.markup.open=!0,this.markup.positionPopup()},l.prototype.closePopupAndFocus=function(t){this.closePopup(t),this.markup.button.focus()},l.prototype.closePopup=function(t){var e=t&&(t.target===this.markup.button||t.target.parentElement===this.markup.button);this.open&&!e&&(this.markup.popup.classList.remove("ap__popup--visible"),this.open=!1,this.markup.open=!1)},l.prototype.addEventListenersForPage=function(t){var e=this;Array.apply(null,t.querySelectorAll("li.ap__results-list__item")).forEach((function(t){t.addEventListener("click",e.selectHandler)}))},l.prototype.select=function(t){var e=t.currentTarget,s=e.getAttribute("data-value"),i=e.getAttribute("data-text"),n=e.getAttribute("data-subtext"),o=this.buildValue(i,n);this.toggleValue(s,o),this.markup.setButtonText(this.values),this.triggerChange()},l.prototype.triggerChange=function(){var t=new CustomEvent("Event",{detail:this.values});t.initEvent("change",!0,!0),this.element.dispatchEvent(t)},l.prototype.toggleValue=function(t,e){this.values[t]?this.removeValue(t):this.addValue(t,e)},l.prototype.addValue=function(t,e){this.values[t]=e;var s=this.markup.selectItem(t,e);s&&s.addEventListener("click",this.selectHandler),this.logDebugMessage("Value added:",e)},l.prototype.removeValue=function(t){delete this.values[t];var e=this.markup.deselectItem(t);e&&e.removeEventListener("click",this.selectHandler),this.logDebugMessage("Value removed:",t)},l.prototype.buildValue=function(t,e,s){var i={};return i[this.textProp]=t,i[this.subtextProp]=e,i.selected="true"===s,i},l.prototype.logDebugMessage=function(t,e){this.debug&&(t&&console.log("SyncPick#"+this.id,t),e&&console.log(e),"function"==typeof this.customDebugHandler&&this.customDebugHandler(this))},l.prototype.register=function(){l.elements[this.id]=this},l.prototype.isInitialized=function(){return void 0!==window.SyncPick&&!!l.elements[this.id]},l.prototype.destroy=function(){this.disabled||this.removeEvents(),this.markup.destroy(),this.values={},this.dropdownValues={},delete this.markup,delete l.elements[this.id]},l.prototype.reload=function(){this.destroy(),this.disabled=!!this.element.disabled,this.values=null,this.initialize()}},function(t,e,s){"use strict";function i(t){this.element=t.element,this.multiple=t.multiple||!1,this.disabled=t.disabled||!1,this.valueProp=t.valueProp,this.textProp=t.textProp,this.subtextProp=t.subtextProp,this.buttonClasses=t.buttonClasses,this.buttonDisabledClasses=t.buttonDisabledClasses,this.emptySelectButtonText=t.emptySelectButtonText,this.buttonIconClasses=t.buttonIconClasses,this.checkedIconClasses=t.checkedIconClasses,this.listClasses=t.listClasses,this.selectedTextFormat=t.selectedTextFormat,this.selectedTextVariable=t.selectedTextVariable,this.selectedText=t.selectedText,this.noResultsText=t.noResultsText,this.dividerText=t.dividerText,this.container=t.container,this.dropdownAlignRight=t.dropdownAlignRight,this.popupWidth=t.popupWidth,this.open=!1,this.wrapper=this.buildWrapper(),this.button=this.buildButton(),this.disabled||(this.popup=this.buildPopup()),this.hideOriginalSelect(),this.assemble()}function n(t,e){var s=[];return Object.keys(t).forEach((function(i){s.push(t[i][e])})),s.join(", ")}function o(t){var e=t.text,s=t.value,i=t.subtext,n=document.createElement("li"),o=document.createElement("span");if(o.classList.add("ap__results-list__item__text"),o.innerHTML=e,null!=s&&n.setAttribute("data-value",s),null!=e&&(n.setAttribute("aria-label",e),n.setAttribute("title",o.innerText),n.setAttribute("data-text",e)),null!=i){n.setAttribute("data-subtext",i);var r=document.createElement("small");r.innerHTML=i,r.classList.add("ap__results-list__item__subtext"),o.appendChild(r)}return n.setAttribute("aria-role","listitem"),n.classList.add("ap__results-list__item"),n.appendChild(o),t.selected&&l(n,!0,t.checkedIconClasses),n}function l(t,e,s){if(e){var i=document.createElement("i");s.forEach((function(t){i.classList.add(t)})),i.classList.add("ap__results-list__item__check-mark"),t.appendChild(i)}else{var n=t.querySelector(".ap__results-list__item__check-mark");n&&t.removeChild(n)}}function r(t){var e=document.documentElement;return{top:t.top+(window.pageYOffset||e.scrollTop)-(e.clientTop||0),left:t.left+(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}}Object.defineProperty(e,"__esModule",{value:!0}),e.default=i,i.prototype.hideOriginalSelect=function(){this.element.style.display="none"},i.prototype.showOriginalSelect=function(){this.element.style.display="initial"},i.prototype.assemble=function(){if(this.wrapper.appendChild(this.button),!this.disabled)if(this.container){var t=document.querySelector(this.container);t&&(t.appendChild(this.popup),this.popup.style.position="absolute",this.popup.style.top="0")}else this.wrapper.appendChild(this.popup);this.element.parentNode.insertBefore(this.wrapper,this.element.nextSibling)},i.prototype.positionPopup=function(){if(this.open)if(this.container){var t=this.wrapper.getBoundingClientRect(),e=r(t),s=e.top+this.wrapper.offsetHeight;if(this.shouldDropUp()?this.popup.style.top=(s-this.popup.offsetHeight-this.button.offsetHeight-parseInt(window.getComputedStyle(this.popup).marginTop)).toString()+"px":this.popup.style.top=s.toString()+"px",this.dropdownAlignRight){var i=window.innerWidth-t.left-this.wrapper.offsetWidth;this.popup.style.right=i+"px"}else this.popup.style.left=e.left.toString()+"px";this.popup.style.minWidth=this.wrapper.offsetWidth+"px",this.popup.style.width=this.popupWidth,this.popup.style.position="absolute"}else this.shouldDropUp()?(this.popup.style.top="auto",this.popup.style.bottom=(this.button.offsetHeight+parseInt(window.getComputedStyle(this.popup).marginTop)).toString()+"px"):(this.popup.style.top="100%",this.popup.style.bottom="auto")},i.prototype.shouldDropUp=function(){var t=r(this.button.getBoundingClientRect()).top-document.documentElement.scrollTop,e=window.innerHeight-t-this.button.offsetHeight;return t>e&&e<this.popup.offsetHeight},i.prototype.buildWrapper=function(){var t=document.createElement("div");t.classList.add("async-pick"),t.classList.add("async-pick--multiple");var e=this.element.classList;return Array.apply(null,e).forEach((function(e){t.classList.add(e)})),t},i.prototype.buildButton=function(){var t=document.createElement("button");if(t.setAttribute("type","button"),this.buttonClasses.forEach((function(e){t.classList.add(e)})),this.disabled&&this.buttonDisabledClasses.forEach((function(e){t.classList.add(e)})),this.buttonText=document.createElement("span"),this.buttonText.classList.add("ap__button-text"),this.buttonIconClasses&&this.buttonIconClasses.length>0){var e=document.createElement("i");this.buttonIconClasses.forEach((function(t){e.classList.add(t)})),t.appendChild(this.buttonText),t.appendChild(e)}else t.appendChild(this.buttonText);return t},i.prototype.buildPopup=function(){var t=document.createElement("div");return t.classList.add("ap__popup"),this.dropdownAlignRight&&t.classList.add("ap__popup--right"),t.appendChild(this.buildResultsScrollWrapper()),t},i.prototype.buildResultsScrollWrapper=function(){return this.resultsScrollWrapper=document.createElement("div"),this.resultsScrollWrapper.classList.add("ap__results-scroll-wrapper"),this.resultsWrapper=document.createElement("div"),this.resultsWrapper.classList.add("ap__results"),this.resultsWrapper.setAttribute("aria-role","list"),this.resultsScrollWrapper.appendChild(this.resultsWrapper),this.resultsScrollWrapper},i.prototype.appendEntries=function(t){var e=function(t){var e=document.createElement("ul");return e.classList.add("ap__results-list"),e.setAttribute("aria-role","listbox"),t.forEach((function(t){e.classList.add(t)})),e}(this.listClasses),s=Object.keys(t).map((function(e){return Object.assign({},t[e],{value:e})}));return this.renderNewEntries(s,e),this.resultsWrapper.appendChild(e),e},i.prototype.renderNewEntries=function(t,e){var s=this;if(t.length>0)t.forEach((function(t){var i=o({value:t.value,text:t[s.textProp],subtext:t[s.subtextProp],selected:t.selected,checkedIconClasses:s.checkedIconClasses});e.appendChild(i)}));else{var i=o({text:this.noResultsText});i.classList.add("ap__results-list__item"),e.appendChild(i)}},i.prototype.renderSelectedOption=function(t,e){var s=document.createElement("option");return s.value=t,s.innerHTML=e,s.selected=!0,s.setAttribute("selected",""),s},i.prototype.removeSelectedOption=function(){var t=this;Array.apply(null,this.element.options).forEach((function(e){t.element.removeChild(e)}))},i.prototype.selectItem=function(t,e){var s=this.renderSelectedOption(t,e[this.textProp]);this.element.appendChild(s),this.addSelectedClassByValue(t)},i.prototype.deselectItem=function(t){this.removeSelectedOption(t),this.removeSelectedClassByValue(t)},i.prototype.addSelectedClassByValue=function(t){var e=this.resultsWrapper.querySelector('li[data-value="'+t+'"]');e&&l(e,!0,this.checkedIconClasses)},i.prototype.removeSelectedClassByValue=function(t){var e=this.resultsWrapper.querySelector('li[data-value="'+t+'"]');e&&l(e,!1,this.checkedIconClasses)},i.prototype.destroy=function(){if(this.showOriginalSelect(),this.container){var t=document.querySelector(this.container);t&&t.removeChild(this.popup)}this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.wrapper)},i.prototype.getSelected=function(){return this.resultsWrapper.querySelectorAll("li.ap__results-list__item--selected")[0]},i.prototype.focusPreviousEntry=function(){var t=this.getSelected();if(t){var e=t.previousSibling||t.parentNode&&t.parentNode.previousSibling&&t.parentNode.previousSibling.lastChild;e&&(t.classList.remove("ap__results-list__item--selected"),e.classList.add("ap__results-list__item--selected"),this.scrollEntryIntoView(e))}else{var s=this.resultsWrapper.querySelectorAll("li.ap__results-list__item[data-value]")[0];s.classList.add("ap__results-list__item--selected"),this.scrollEntryIntoView(s)}},i.prototype.focusNextEntry=function(){var t=this.getSelected();if(t){var e=t.nextSibling||t.parentNode&&t.parentNode.nextSibling&&t.parentNode.nextSibling.firstChild;e&&(t.classList.remove("ap__results-list__item--selected"),e.classList.add("ap__results-list__item--selected"),this.scrollEntryIntoView(e))}else{var s=this.resultsWrapper.querySelectorAll("li.ap__results-list__item[data-value]")[0];s.classList.add("ap__results-list__item--selected"),this.scrollEntryIntoView(s)}},i.prototype.scrollEntryIntoView=function(t){var e=t.offsetTop-this.resultsScrollWrapper.offsetTop,s=this.resultsScrollWrapper.offsetHeight+this.resultsScrollWrapper.scrollTop<e+t.offsetHeight,i=e<this.resultsScrollWrapper.scrollTop;s?this.resultsScrollWrapper.scrollTop=e-this.resultsScrollWrapper.offsetHeight+t.offsetHeight:i&&(this.resultsScrollWrapper.scrollTop=e)},i.prototype.setButtonText=function(t){t&&Object.keys(t).length>0?this.buttonText.innerHTML=this.renderButtonText(t):this.buttonText.innerHTML=this.emptySelectButtonText},i.prototype.renderButtonText=function(t){if(this.selectedTextFormat){var e=this.selectedTextFormat.match(/count\s?>\s?([0-9]*)/),s=e&&e[1]&&parseInt(e[1]);return s&&s<Object.keys(t).length?this.selectedText.replace(this.selectedTextVariable,Object.keys(t).length):n(t,this.textProp)}return n(t,this.textProp)}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={searchPlaceholder:"Suchen",emptySelectButtonText:"Alle anzeigen",noResultsText:"Keine Ergebnisse gefunden",selectedText:"%num% Einträge ausgewählt",dividerText:"Ausgewählte Einträge:"}},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={searchPlaceholder:"Search",emptySelectButtonText:"Show all",noResultsText:"No results found",selectedText:"%num% selected",dividerText:"Selected entries:"}}])}));