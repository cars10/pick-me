function r(e){this.element=e.element,this.multiple=e.multiple||!1,this.disabled=e.disabled||!1,this.valueProp=e.valueProp,this.searchPlaceholder=e.searchPlaceholder,this.searchInputClasses=e.searchInputClasses,this.buttonClasses=e.buttonClasses,this.buttonDisabledClasses=e.buttonDisabledClasses,this.emptySelectButtonText=e.emptySelectButtonText,this.buttonIconClasses=e.buttonIconClasses,this.checkedIconClasses=e.checkedIconClasses,this.listClasses=e.listClasses,this.selectedTextFormat=e.selectedTextFormat,this.selectedTextVariable=e.selectedTextVariable,this.selectedText=e.selectedText,this.noResultsText=e.noResultsText,this.container=e.container,this.withSearch=e.withSearch,this.withSelectAllButton=e.withSelectAllButton,this.selectAllButtonClasses=e.selectAllButtonClasses,this.selectAllButtonGroupClasses=e.selectAllButtonGroupClasses,this.selectAllButtonText=e.selectAllButtonText,this.deselectAllButtonText=e.deselectAllButtonText,this.dropdownAlignRight=e.dropdownAlignRight,this.popupWidth=e.popupWidth,this.open=!1,this.wrapper=this.buildWrapper(),this.button=this.buildButton(),this.disabled||(this.popup=this.buildPopup()),this.hideOriginalSelect(),this.assemble()}r.prototype.hideOriginalSelect=function(){this.element.classList.add("visually-hidden"),this.element.setAttribute("tabindex","-1")};r.prototype.showOriginalSelect=function(){this.element.style.display="initial"};r.prototype.assemble=function(){if(this.wrapper.appendChild(this.button),!this.disabled)if(this.container){let e=document.querySelector(this.container);e&&(e.appendChild(this.popup),this.popup.style.position="absolute",this.popup.style.top="0")}else this.wrapper.appendChild(this.popup);this.element.parentNode.insertBefore(this.wrapper,this.element)};r.prototype.positionPopup=function(){if(!!this.open)if(this.container){let e=this.wrapper.getBoundingClientRect(),t=b(e),s=t.top+this.wrapper.offsetHeight;if(this.shouldDropUp()?this.popup.style.top=(s-this.popup.offsetHeight-this.button.offsetHeight-parseInt(window.getComputedStyle(this.popup).marginTop)).toString()+"px":this.popup.style.top=s.toString()+"px",this.dropdownAlignRight){let l=window.innerWidth-e.left-this.wrapper.offsetWidth;this.popup.style.right=l+"px"}else this.popup.style.left=t.left.toString()+"px";this.popup.style.minWidth=this.wrapper.offsetWidth+"px",this.popup.style.width=this.popupWidth,this.popup.style.position="absolute"}else this.shouldDropUp()?(this.popup.style.top="auto",this.popup.style.bottom=(this.button.offsetHeight+parseInt(window.getComputedStyle(this.popup).marginTop)).toString()+"px"):(this.popup.style.top="100%",this.popup.style.bottom="auto")};r.prototype.shouldDropUp=function(){let e=this.button.getBoundingClientRect(),s=b(e).top-document.documentElement.scrollTop,l=window.innerHeight-s-this.button.offsetHeight;return s>l&&l<this.popup.offsetHeight};r.prototype.buildWrapper=function(){let e=document.createElement("div");return e.classList.add("sync-pick"),this.multiple&&e.classList.add("sync-pick--multiple"),e};r.prototype.buildButton=function(){let e=document.createElement("button");if(e.setAttribute("type","button"),this.buttonClasses.forEach(function(t){e.classList.add(t)}),this.disabled&&(e.disabled=!0,this.buttonDisabledClasses.forEach(function(t){e.classList.add(t)})),this.buttonText=document.createElement("span"),this.buttonText.classList.add("sp__button-text"),this.buttonIconClasses&&this.buttonIconClasses.length>0){let t=document.createElement("i");this.buttonIconClasses.forEach(function(s){t.classList.add(s)}),e.appendChild(this.buttonText),e.appendChild(t)}else e.appendChild(this.buttonText);return e};r.prototype.buildPopup=function(){let e=document.createElement("div");return e.classList.add("sp__popup"),this.dropdownAlignRight&&e.classList.add("sp__popup--right"),this.withSearch&&e.appendChild(this.buildSearchInput()),this.withSelectAllButton&&e.appendChild(this.buildSelectAllButtons()),e.appendChild(this.buildResultsScrollWrapper()),e};r.prototype.buildSearchInput=function(){let e=document.createElement("div");e.classList.add("sp__search-input__wrapper"),this.searchInput=document.createElement("input"),this.searchInput.type="search",this.searchInput.setAttribute("placeholder",this.searchPlaceholder),this.searchInput.classList.add("sp__search-input");let t=this;return this.searchInputClasses.forEach(function(s){t.searchInput.classList.add(s)}),e.appendChild(this.searchInput),e};r.prototype.buildSelectAllButtons=function(){let e=document.createElement("div");this.selectAllButtonGroupClasses.forEach(function(s){e.classList.add(s)}),this.selectAllButton=document.createElement("button"),this.selectAllButton.setAttribute("type","button"),this.deselectAllButton=document.createElement("button"),this.deselectAllButton.setAttribute("type","button"),this.selectAllButton.innerHTML=this.selectAllButtonText,this.deselectAllButton.innerHTML=this.deselectAllButtonText;let t=this;return this.selectAllButtonClasses.forEach(function(s){t.selectAllButton.classList.add(s),t.deselectAllButton.classList.add(s)}),e.appendChild(this.selectAllButton),e.appendChild(this.deselectAllButton),e};r.prototype.buildResultsScrollWrapper=function(){return this.resultsScrollWrapper=document.createElement("div"),this.resultsScrollWrapper.classList.add("sp__results-scroll-wrapper"),this.resultsWrapper=document.createElement("div"),this.resultsWrapper.classList.add("sp__results"),this.resultsWrapper.setAttribute("aria-role","list"),this.resultsScrollWrapper.appendChild(this.resultsWrapper),this.resultsScrollWrapper};r.prototype.appendEntries=function(e,t,s){if(Object.keys(e).length>0)Object.entries(e).forEach(([l,n],o,u)=>{if(l&&l.length>0){let h=document.createElement("span");h.classList.add("sp__opt-group-label"),h.innerText=l,this.resultsWrapper.appendChild(h)}let a=f(this.listClasses);a.setAttribute("data-label",l);let c=s[l];if(this.renderNewEntries(n,a,t,c),this.resultsWrapper.appendChild(a),l&&l.length>0&&u[o+1]){let h=document.createElement("hr");h.classList.add("sp__hr"),this.resultsWrapper.appendChild(h)}});else{let l=m({text:this.noResultsText});l.classList.add("sp__results-list__item--muted");let n=f(this.listClasses);n.appendChild(l),this.resultsWrapper.appendChild(n)}};r.prototype.renderNewEntries=function(e,t,s,l){let n=this;l.forEach(o=>{let u=e[o];if(!u)return;let a=m({value:o,...u,selected:s.indexOf(o)>-1,multiple:n.multiple,checkedIconClasses:n.checkedIconClasses});t.appendChild(a)})};r.prototype.selectItem=function(e){let t=this.element.querySelector('option[value="'+e.replaceAll('"','\\"')+'"]');t.selected=!0,t.setAttribute("data-selected",""),this.addSelectedClassByValue(e)};r.prototype.deselectItem=function(e){let t=this.element.querySelector('option[value="'+e.replaceAll('"','\\"')+'"]');t.selected=!1,t.removeAttribute("data-selected"),this.removeSelectedClassByValue(e)};r.prototype.addSelectedClassByValue=function(e){let t=this.resultsWrapper.querySelector('li[data-value="'+e.replaceAll('"','\\"')+'"]');t&&d(t,!0,this.multiple,this.checkedIconClasses)};r.prototype.removeSelectedClassByValue=function(e){let t=this.resultsWrapper.querySelector('li[data-value="'+e.replaceAll('"','\\"')+'"]');t&&d(t,!1,this.multiple,this.checkedIconClasses)};r.prototype.destroy=function(){if(this.showOriginalSelect(),this.container){let e=document.querySelector(this.container);e&&e.removeChild(this.popup)}this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.wrapper)};r.prototype.getSelected=function(){return this.resultsWrapper.querySelectorAll("li.sp__results-list__item--selected")[0]};r.prototype.getHovered=function(){return this.hovered};r.prototype.focusPreviousEntry=function(){this.hovered||(this.hovered=this.getSelected());let e=Array.from(this.resultsWrapper.querySelectorAll("li.sp__results-list__item[data-value]"));if(this.hovered){let t=e.indexOf(this.hovered);t>0&&(this.hovered.classList.remove("sp__results-list__item--hover"),this.hovered=e[t-1],this.hovered.classList.add("sp__results-list__item--hover"),this.scrollEntryIntoView(this.hovered))}else{let t=e[0];if(!t)return;t.classList.add("sp__results-list__item--hover"),this.hovered=t,this.scrollEntryIntoView(t)}};r.prototype.focusNextEntry=function(){this.hovered||(this.hovered=this.getSelected());let e=Array.from(this.resultsWrapper.querySelectorAll("li.sp__results-list__item[data-value]"));if(this.hovered){let t=e.indexOf(this.hovered);t<e.length-1&&(this.hovered.classList.remove("sp__results-list__item--hover"),this.hovered=e[t+1],this.hovered.classList.add("sp__results-list__item--hover"),this.scrollEntryIntoView(this.hovered))}else{let t=e[0];if(!t)return;t.classList.add("sp__results-list__item--hover"),this.hovered=t,this.scrollEntryIntoView(t)}};r.prototype.scrollEntryIntoView=function(e){let t=e.offsetTop-this.resultsScrollWrapper.offsetTop,s=this.resultsScrollWrapper.offsetHeight+this.resultsScrollWrapper.scrollTop<t+e.offsetHeight,l=t<this.resultsScrollWrapper.scrollTop;s?this.resultsScrollWrapper.scrollTop=t-this.resultsScrollWrapper.offsetHeight+e.offsetHeight:l&&(this.resultsScrollWrapper.scrollTop=t)};r.prototype.setButtonText=function(e){e&&Object.keys(e).length>0?this.buttonText.innerHTML=this.renderButtonText(e):this.buttonText.innerHTML=this.emptySelectButtonText};r.prototype.renderButtonText=function(e){if(this.selectedTextFormat){let t=this.selectedTextFormat.match(/count\s?>\s?([0-9]*)/),s=t&&t[1]&&parseInt(t[1]);return s&&s<Object.keys(e).length?this.selectedText.replace(this.selectedTextVariable,Object.keys(e).length):p(e)}else return p(e)};function p(e){let t=[];return Object.keys(e).forEach(function(s){t.push(e[s].text)}),t.join(", ")}function f(e){let t=document.createElement("ul");return t.classList.add("sp__results-list"),t.setAttribute("aria-role","listbox"),e.forEach(function(s){t.classList.add(s)}),t}function m(e){let t=e.text,s=e.value,l=e.subtext,n=e.img,o=document.createElement("li"),u=document.createElement("span");if(u.classList.add("sp__results-list__item__text"),u.innerHTML=t,typeof s<"u"&&s!==null&&o.setAttribute("data-value",s),typeof t<"u"&&t!==null&&(o.setAttribute("aria-label",t),o.setAttribute("title",u.innerText),o.setAttribute("data-text",t)),typeof l<"u"&&l!==null){o.setAttribute("data-subtext",l);let a=document.createElement("small");a.innerHTML=l,a.classList.add("sp__results-list__item__subtext"),u.appendChild(a)}if(o.setAttribute("aria-role","listitem"),o.classList.add("sp__results-list__item"),typeof n<"u"&&n!==null){let a=document.createElement("img");Object.keys(n).forEach(function(c){a.setAttribute(c,n[c])}),a.classList.add("sp__results-list__item__image"),o.setAttribute("data-img",JSON.stringify(n)),o.appendChild(a)}return o.appendChild(u),e.selected&&d(o,!0,e.multiple,e.checkedIconClasses),o}function d(e,t,s,l){if(t)if(s){let n=document.createElement("i");l.forEach(function(o){n.classList.add(o)}),n.classList.add("sp__results-list__item__check-mark"),e.appendChild(n)}else e.classList.remove("sp__results-list__item--hover"),e.classList.add("sp__results-list__item--selected");else if(s){let n=e.querySelector(".sp__results-list__item__check-mark");n&&e.removeChild(n)}else e.classList.remove("sp__results-list__item--selected")}function b(e){let t=document.documentElement;return{top:e.top+(window.pageYOffset||t.scrollTop)-(t.clientTop||0),left:e.left+(window.pageXOffset||t.scrollLeft)-(t.clientLeft||0)}}var g={searchPlaceholder:"Search",emptySelectButtonText:"Show all",noResultsText:"No results found",selectedText:"%num% selected",selectAllButtonText:"Select all",deselectAllButtonText:"Deselect all"};var y={searchPlaceholder:"Suchen",emptySelectButtonText:"Alle anzeigen",noResultsText:"Keine Ergebnisse gefunden",selectedText:"%num% Eintr\xE4ge ausgew\xE4hlt",selectAllButtonText:"Alles ausw\xE4hlen",deselectAllButtonText:"Nichts ausw\xE4hlen"};function i(e){return this.id=e.id,this.label=document.querySelector('label[for="'+this.id+'"]'),this.isInitialized()&&i.elements[this.id].destroy(),this.element=document.getElementById(this.id),this.language=e.language||document.documentElement.lang||"en",this.i18n=i.i18n?i.i18n[this.language]:{},this.searchTimeout=e.searchTimeout||50,this.searchPlaceholder=e.searchPlaceholder||this.i18n.searchPlaceholder||"Search",this.searchInputClasses=e.searchInputClasses||[],this.buttonClasses=e.buttonClasses||[],this.emptySelectButtonText=e.emptySelectButtonText||this.i18n.emptySelectButtonText||"Select",this.buttonDisabledClasses=e.buttonDisabledClasses||[],this.buttonIconClasses=e.buttonIconClasses||["fas","fa-fw","fa-caret-down"],this.checkedIconClasses=e.checkedIconClasses||["fas","fa-fw","fa-check"],this.listClasses=e.listClasses||[],this.selectedTextFormat=e.selectedTextFormat||null,this.selectedTextVariable=e.selectedTextVariable||"%num%",this.selectedText=e.selectedText||this.i18n.selectedText||this.selectedTextVariable+" selected",this.noResultsText=e.noResultsText||this.i18n.noResultsText||"No results",this.container=e.container||null,this.withSearch=!!e.withSearch,this.dropdownAlignRight=!!e.dropdownAlignRight,this.popupWidth=e.popupWidth||"300px",this.selectedValues=e.values||null,this.withSelectAllButton=e.withSelectAllButton||!1,this.selectAllButtonClasses=e.selectAllButtonClasses||[],this.selectAllButtonGroupClasses=e.selectAllButtonGroupClasses||[],this.selectAllButtonText=e.selectAllButtonText||this.i18n.selectAllButtonText||"Select all",this.deselectAllButtonText=e.deselectAllButtonText||this.i18n.deselectAllButtonText||"Deselect all",this.debug=e.debug||!1,this.customDebugHandler=e.customDebugHandler||null,this.multiple=!!this.element.multiple||!!e.multiple,this.disabled=!!this.element.disabled||!!e.disabled,this.open=!1,this.initialize(),this.logDebugMessage("initialized with options:",this),this}i.i18n={de:y,en:g};i.elements={};i.prototype.initialize=function(){this.markup=this.buildMarkup(),this.disabled||(this.addHandlers(),this.addEvents()),this.setupValues(),this.disabled||(this.markup.appendEntries(this.dropdownValues,Object.keys(this.selectedValues),this.selectedValuesOrder),this.addEventListenersForPage()),this.register(),this.markup.setButtonText(this.selectedValues)};i.prototype.buildMarkup=function(){return new r({element:this.element,multiple:this.multiple,disabled:this.disabled,searchPlaceholder:this.searchPlaceholder,searchInputClasses:this.searchInputClasses,buttonClasses:this.buttonClasses,buttonDisabledClasses:this.buttonDisabledClasses,emptySelectButtonText:this.emptySelectButtonText,buttonIconClasses:this.buttonIconClasses,checkedIconClasses:this.checkedIconClasses,listClasses:this.listClasses,selectedTextFormat:this.selectedTextFormat,selectedTextVariable:this.selectedTextVariable,selectedText:this.selectedText,noResultsText:this.noResultsText,container:this.container,withSearch:this.withSearch,dropdownAlignRight:this.dropdownAlignRight,popupWidth:this.popupWidth,withSelectAllButton:this.withSelectAllButton,selectAllButtonClasses:this.selectAllButtonClasses,selectAllButtonGroupClasses:this.selectAllButtonGroupClasses,selectAllButtonText:this.selectAllButtonText,deselectAllButtonText:this.deselectAllButtonText})};i.prototype.addHandlers=function(){this.togglePopupHandler=this.togglePopup.bind(this),this.searchHandler=this.search.bind(this),this.closePopupHandler=this.closePopup.bind(this),this.selectHandler=this.select.bind(this),this.stopPropagationHandler=function(e){e.stopPropagation()},this.buttonKeyHandler=this.onButtonKeyDown.bind(this),this.markupKeyHandler=this.onMarkupKeyDown.bind(this),this.selectAllHandler=this.selectAllEntries.bind(this),this.deselectAllHandler=this.deselectAllEntries.bind(this),this.labelClickHandler=function(e){e.preventDefault(),this.markup.button.focus()}.bind(this),this.containerPositionHandler=this.markup.positionPopup.bind(this.markup),this.resetFormHandler=this.resetAndReload.bind(this)};i.prototype.resetAndReload=function(){this.logDebugMessage("form reset! reloading sync-pick"),this.reload()};i.prototype.onButtonKeyDown=function(e){e.keyCode===13&&(e.preventDefault(),this.togglePopup(e))};i.prototype.onMarkupKeyDown=function(e){if(e.keyCode===9||e.keyCode===27)this.closePopupAndFocus();else if(e.keyCode===40)e.preventDefault(),this.markup.focusNextEntry();else if(e.keyCode===38)e.preventDefault(),this.markup.focusPreviousEntry();else if(e.keyCode===13)if(e.preventDefault(),this.open){let t=this.markup.getHovered();t&&this.select({currentTarget:t})}else this.openPopup()};i.prototype.addEvents=function(){this.markup.button.addEventListener("click",this.togglePopupHandler),this.withSearch&&this.markup.searchInput.addEventListener("input",this.searchHandler),this.markup.popup.addEventListener("click",this.stopPropagationHandler),this.withSelectAllButton&&(this.markup.selectAllButton.addEventListener("click",this.selectAllHandler),this.markup.deselectAllButton.addEventListener("click",this.deselectAllHandler)),this.withSearch?(this.markup.button.addEventListener("keydown",this.buttonKeyHandler),this.markup.popup.addEventListener("keydown",this.markupKeyHandler)):this.markup.button.addEventListener("keydown",this.markupKeyHandler),document.addEventListener("click",this.closePopupHandler),window.addEventListener("resize",this.containerPositionHandler),window.addEventListener("scroll",this.containerPositionHandler),this.label&&this.label.addEventListener("click",this.labelClickHandler),this.element.form&&this.element.form.addEventListener("reset",this.resetFormHandler);let e=this;v(this.markup.element,function(){e.destroy()})};i.prototype.removeEvents=function(){let e=this;this.markup.button.removeEventListener("click",this.togglePopupHandler),this.withSearch&&this.markup.searchInput.removeEventListener("input",this.searchHandler),Array.apply(null,this.markup.resultsWrapper.querySelectorAll("li")).forEach(function(t){t.removeEventListener("click",e.selectHandler)}),this.markup.popup.removeEventListener("click",this.stopPropagationHandler),this.markup.button.removeEventListener("keydown",this.buttonKeyHandler),this.markup.popup.removeEventListener("keydown",this.markupKeyHandler),document.removeEventListener("click",this.closePopupHandler),window.removeEventListener("resize",this.containerPositionHandler),window.removeEventListener("scroll",this.containerPositionHandler),this.label&&this.label.removeEventListener("click",this.labelClickHandler),this.element.form&&this.element.form.removeEventListener("reset",this.resetFormHandler)};i.prototype.setupValues=function(){if(!this.selectedValues){this.selectedValues={},this.dropdownValues={},this.selectedValuesOrder={};let e=this;Array.apply(null,this.element.options).forEach(function(t){let s;t.parentNode.nodeName==="OPTGROUP"?s=t.parentNode.label:s="",e.selectedValuesOrder[s]||(e.selectedValuesOrder[s]=[]),e.selectedValuesOrder[s].push(t.value),e.dropdownValues[s]||(e.dropdownValues[s]={});let l={text:t.innerHTML,subtext:t.getAttribute("data-subtext"),img:JSON.parse(t.getAttribute("data-img"))};e.dropdownValues[s][t.value]=l,t.hasAttribute("selected")&&(t.getAttribute("selected").length===0||t.getAttribute("selected")==="true")&&(e.selectedValues[t.value]=l,t.setAttribute("data-selected",!0))})}};i.prototype.togglePopup=function(){this.open?this.closePopupAndFocus():this.openPopup()};i.prototype.search=function(){this.searchInputTimer&&clearTimeout(this.searchInputTimer),this.markup.hovered&&this.markup.hovered.classList.remove("sp__results-list__item--hover"),this.markup.hovered=!1;let e=this.markup.searchInput.value;if(this.shouldSearch(e)){let t=this;t.previousSearchValue=e;let s=e.toLowerCase();this.searchInputTimer=setTimeout(function(){let l={};Object.entries(t.dropdownValues).forEach(([n,o])=>{Object.entries(o).forEach(([u,a])=>{a.text.toLowerCase().includes(s)&&(l[n]||(l[n]={}),l[n][u]=a)})}),t.markup.resultsWrapper.innerHTML="",t.markup.appendEntries(l,Object.keys(t.selectedValues),t.selectedValuesOrder),t.addEventListenersForPage()},t.searchTimeout)}};i.prototype.openPopup=function(){this.markup.popup.classList.add("sp__popup--visible"),this.open=!0,this.markup.open=!0,this.markup.positionPopup(),this.withSearch&&this.markup.searchInput.focus()};i.prototype.closePopupAndFocus=function(e){this.closePopup(e),this.markup.button.focus()};i.prototype.closePopup=function(e){let t=e&&(e.target===this.markup.button||e.target.parentElement===this.markup.button);this.open&&!t&&(this.markup.popup.classList.remove("sp__popup--visible"),this.open=!1,this.markup.open=!1,this.markup.hovered&&this.markup.hovered.classList.remove("sp__results-list__item--hover"),this.markup.hovered=!1,this.withSearch&&this.resetSearch())};i.prototype.selectAllEntries=function(){let e=Object.keys(this.selectedValues);this.selectedValues=Object.assign({},...Object.values(this.dropdownValues)),Object.keys(this.selectedValues).forEach(t=>{e.includes(t)||this.markup.selectItem(t)}),this.markup.setButtonText(this.selectedValues),this.triggerChange()};i.prototype.deselectAllEntries=function(){Object.keys(this.selectedValues).forEach(e=>{this.markup.deselectItem(e)}),this.selectedValues={},this.markup.setButtonText(this.selectedValues),this.triggerChange()};i.prototype.addEventListenersForPage=function(){let e=this;Array.apply(null,e.markup.resultsWrapper.querySelectorAll("li.sp__results-list__item[data-value]:not(.sp__results-list__item--disabled)")).forEach(function(t){t.addEventListener("click",e.selectHandler)})};i.prototype.shouldSearch=function(e){return this.previousSearchValue!==e};i.prototype.select=function(e){let t=e.currentTarget,s=t.getAttribute("data-value"),l={text:t.getAttribute("data-text"),subtext:t.getAttribute("data-subtext"),disabled:t.getAttribute("data-disabled"),img:t.getAttribute("data-img")?JSON.parse(t.getAttribute("data-img")):null};this.multiple?this.toggleSelectedValue(s,l):this.setSelectedValue(s,l),this.markup.setButtonText(this.selectedValues),this.multiple||this.closePopupAndFocus(),this.triggerChange()};i.prototype.triggerChange=function(){let e=new CustomEvent("Event",{detail:this.selectedValues});e.initEvent("change",!0,!0),this.element.dispatchEvent(e),this.logDebugMessage("changeTriggered")};i.prototype.toggleSelectedValue=function(e,t){this.selectedValues[e]?this.removeSelectedValue(e,t):this.addSelectedValue(e,t)};i.prototype.addSelectedValue=function(e,t){this.selectedValues[e]=t,this.markup.selectItem(e),this.withSearch&&this.markup.searchInput.focus(),this.logDebugMessage("Value added:",t)};i.prototype.removeSelectedValue=function(e,t){delete this.selectedValues[e],this.markup.deselectItem(e),this.logDebugMessage("Value removed:",t)};i.prototype.setSelectedValue=function(e,t){if(Object.keys(this.selectedValues).length>0){this.removeSelectedValue(Object.keys(this.selectedValues)[0]);let s=this.markup.getSelected();s&&s.classList.remove("sp__results-list__item--selected")}this.addSelectedValue(e,t),this.logDebugMessage("Value set:",t)};i.prototype.logDebugMessage=function(e,t){this.debug&&(e&&console.log("SyncPick#"+this.id,e),t&&console.log(t),typeof this.customDebugHandler=="function"&&this.customDebugHandler(this))};i.prototype.register=function(){i.elements[this.id]=this};i.prototype.isInitialized=function(){return typeof window.SyncPick>"u"?!1:!!i.elements[this.id]};i.prototype.resetSearch=function(){this.markup.searchInput.value="",this.search()};i.prototype.destroy=function(){this.disabled||this.removeEvents(),this.markup.destroy(),this.selectedValues=null,this.dropdownValues=null,delete this.markup,delete i.elements[this.id],this.element.classList.remove("visually-hidden")};i.prototype.reload=function(){Object.keys(this.selectedValues).forEach(e=>{this.markup.deselectItem(e)}),this.destroy(),this.disabled=!!this.element.disabled,this.initialize()};function v(e,t){let s=new MutationObserver(function(){function l(n){return n.parentNode===document?!1:n.parentNode===null?!0:l(n.parentNode)}l(e)&&(s.disconnect(),t())});s.observe(document,{childList:!0,subtree:!0})}export{i as default};
//# sourceMappingURL=sync-pick.js.map
