import SyncPickMarkup from './sync-pick/sync-pick-markup'

/**
 * SyncPick
 * @param {Object}   options
 * @param {String}   options.id - id of the select to use
 * @param {String}  [options.language='en'] - set language. defaults to document language or 'en'
 * @param {String}  [options.valueProp='id'] - name of the json key that holds the data to use as option value
 * @param {String}  [options.textProp='name'] - name of the json key that holds the data to use as option text
 * @param {String}  [options.subtextProp='subtext'] - name of the json key for additional subtext
 * @param {String}  [options.emptySelectButtonText=[]] - set the text of the select button before something is selected
 * @param {Array}   [options.buttonClasses=[]] - additional classes to add to the "open" button
 * @param {Array}   [options.buttonDisabledClasses=[]] - additional classes to add to the disabled button
 * @param {Array}   [options.buttonIconClasses=[]] - additional classes to add to "open" buttons icon
 * @param {Array}   [options.checkedIconClasses=[]] - additional classes to add to "checked" icon
 * @param {Array}   [options.listClasses=[]] - additional classes to add to each list built from loaded data
 * @param {String}  [options.selectedTextFormat=null] - set to 'count > X' where X is a number to show all texts if the
 *                                                      selected count is below X, otherwise show `selectedText`
 * @param {String}  [options.selectedTextVariable='%num%'] - set to some placeholder that is included in `selectedText`
 *                                                        that gets replaced by the actual count when displaying text
 * @param {String}  [options.selectedText=options.selectedTextVariable + 'selected'] - the actual text
 * @param {String}  [options.noResultsText='No results'] - text to display when api returns no results
 * @param {String}  [options.container=null] - container to append the html to
 * @param {Boolean} [options.dropdownAlignRight=false] - set to true to align the dropdown on the right
 * @param {Boolean} [options.popupWidth='300px'] - set width for popup when container option is set
 * @param {Boolean} [options.disabled=false] - to disabled the select. alternatively set your select to disabled
 * @param {Object}  [options.values] - hash with preselected values, overrides possible <option selected> elements.
 *                                    This is an alternative to adding actual <option selected> elements to the dom.
 *                                    Structure has to be {<value>: {<textProp>: <text>, disabledProp: <disabled>}}.
 *                                    Note that both <value> and <text> should be equal to the actual option values.
 * @param {Object}  [options.dropdownValues] - hash with all values in the dropdown.
 *                                    Structure has to be {<value>: {<textProp>: <text>, disabledProp: <disabled>}}.
 *                                    Note that both <value> and <text> should be equal to the actual option values.
 * @param {Boolean} [options.debug=false] - enable to log debug messages
 * @param {Function} [options.customDebugHandler=null] - additional function to call when debug messages are logged.
 *                                                       Receives the instance of sync-pick as first arg.
 * @constructor
 */
export default function SyncPick(options) {
    this.id = options.id
    this.label = document.querySelector('label[for="' + this.id + '"]')
    if (this.isInitialized()) SyncPick.elements[this.id].destroy()

    this.element = document.getElementById(this.id)
    this.language = options.language || document.documentElement.lang || 'en'
    this.i18n = SyncPick.i18n ? SyncPick.i18n[this.language] : {}

    this.textProp = options.textProp || 'name'
    this.subtextProp = options.subtextProp || 'subtext'
    this.buttonClasses = options.buttonClasses || []
    this.emptySelectButtonText = options.emptySelectButtonText || this.i18n.emptySelectButtonText || 'Select'
    this.buttonDisabledClasses = options.buttonDisabledClasses || []
    this.buttonIconClasses = options.buttonIconClasses || ['fas', 'fa-fw', 'fa-caret-down']
    this.checkedIconClasses = options.checkedIconClasses || ['fas', 'fa-fw', 'fa-check']
    this.listClasses = options.listClasses || []
    this.selectedTextFormat = options.selectedTextFormat || null
    this.selectedTextVariable = options.selectedTextVariable || '%num%'
    this.selectedText = options.selectedText || this.i18n.selectedText || this.selectedTextVariable + ' selected'
    this.container = options.container || null
    this.dropdownAlignRight = !!options.dropdownAlignRight
    this.popupWidth = options.popupWidth || '300px'
    this.values = options.values || null
    this.dropdownValues = options.dropdownValues || null
    this.debug = options.debug || false
    this.customDebugHandler = options.customDebugHandler || null

    this.disabled = !!this.element.disabled || !!options.disabled
    this.blankOption = {}
    this.open = false

    this.initialize()
    this.logDebugMessage('initialized with options:', this)
    return this
}

SyncPick.elements = {}

SyncPick.prototype.initialize = function () {
    this.markup = this.buildMarkup()
    if (!this.disabled) {
        this.addHandlers()
        this.addEvents()
    }
    this.setupValues()
    this.setupBlankOption()
    if (!this.disabled) {
        const pageUl = this.markup.appendEntries(this.dropdownValues)
        this.addEventListenersForPage(pageUl)
    }
    this.register()
    this.markup.setButtonText(this.values)
}

SyncPick.prototype.buildMarkup = function () {
    return new SyncPickMarkup({
        element: this.element,
        disabled: this.disabled,
        textProp: this.textProp,
        subtextProp: this.subtextProp,
        buttonClasses: this.buttonClasses,
        buttonDisabledClasses: this.buttonDisabledClasses,
        emptySelectButtonText: this.emptySelectButtonText,
        buttonIconClasses: this.buttonIconClasses,
        checkedIconClasses: this.checkedIconClasses,
        listClasses: this.listClasses,
        selectedTextFormat: this.selectedTextFormat,
        selectedTextVariable: this.selectedTextVariable,
        selectedText: this.selectedText,
        noResultsText: this.noResultsText,
        dividerText: this.dividerText,
        container: this.container,
        dropdownAlignRight: this.dropdownAlignRight,
        popupWidth: this.popupWidth
    })
}

SyncPick.prototype.addHandlers = function () {
    this.togglePopupHandler = this.togglePopup.bind(this)
    this.closePopupHandler = this.closePopup.bind(this)
    this.selectHandler = this.select.bind(this)
    this.stopPropagationHandler = function (e) {
        e.stopPropagation()
    }
    this.buttonKeyHandler = this.onButtonKeyDown.bind(this)
    this.markupKeyHandler = this.onMarkupKeyDown.bind(this)
    this.labelClickHandler = function (e) {
        e.preventDefault()
        this.markup.button.focus()
    }.bind(this)
    this.containerPositionHandler = this.markup.positionPopup.bind(this.markup)
}

SyncPick.prototype.onButtonKeyDown = function (e) {
    if (e.keyCode === 13) { // enter
        e.preventDefault()
        this.togglePopup(e)
    }
}

SyncPick.prototype.onMarkupKeyDown = function (e) {
    if (e.keyCode === 9 || e.keyCode === 27) { // tab || esc
        this.closePopupAndFocus()
    } else if (e.keyCode === 40) { // arrow down
        this.markup.focusNextEntry()
    } else if (e.keyCode === 38) { // arrow up
        this.markup.focusPreviousEntry()
    } else if (e.keyCode === 13) { // enter
        e.preventDefault()
        const li = this.markup.getSelected()
        if (li) this.select({currentTarget: li})
    }
}

SyncPick.prototype.addEvents = function () {
    this.markup.button.addEventListener('click', this.togglePopupHandler)
    this.markup.popup.addEventListener('click', this.stopPropagationHandler)
    this.markup.button.addEventListener('keydown', this.buttonKeyHandler)
    this.markup.popup.addEventListener('keydown', this.markupKeyHandler)
    document.addEventListener('click', this.closePopupHandler)
    window.addEventListener('resize', this.containerPositionHandler)
    window.addEventListener('scroll', this.containerPositionHandler)
    if (this.label) this.label.addEventListener('click', this.labelClickHandler)
    let self = this
    onDomRemove(this.markup.element, function () {
        self.destroy()
    })
}

SyncPick.prototype.removeEvents = function () {
    let self = this
    this.markup.button.removeEventListener('click', this.togglePopupHandler)
    Array.apply(null, this.markup.resultsWrapper.querySelectorAll('li')).forEach(function (li) {
        li.removeEventListener('click', self.selectHandler)
    })
    this.markup.popup.removeEventListener('click', this.stopPropagationHandler)
    this.markup.button.removeEventListener('keydown', this.buttonKeyHandler)
    this.markup.popup.removeEventListener('keydown', this.markupKeyHandler)
    document.removeEventListener('click', this.closePopupHandler)
    window.removeEventListener('resize', this.containerPositionHandler)
    window.removeEventListener('scroll', this.containerPositionHandler)
    if (this.label) this.label.removeEventListener('click', this.labelClickHandler)
}

SyncPick.prototype.setupValues = function () {
    if (!this.values) {
        this.values = {}
        this.dropdownValues = {}
        let self = this
        Array.apply(null, this.element.options).filter(function (option) {
            return option.selected
        }).forEach(function (option) {
            self.values[option.value] = self.buildValue(option.innerHTML, option.getAttribute('data-subtext'),
                option.selected.toString())
        })
        Array.apply(null, this.element.options).forEach(function (option) {
            self.dropdownValues[option.value] = self.buildValue(option.innerHTML, option.getAttribute('data-subtext'),
                option.selected.toString())
        })
    }
}

SyncPick.prototype.setupBlankOption = function () {
    let blank = Array.apply(null, this.element.options).filter(function (option) {
        return option.value === ''
    })[0]
    if (!!blank) this.blankOption[''] = blank.innerHTML
}

SyncPick.prototype.togglePopup = function () {
    this.open ? this.closePopupAndFocus() : this.openPopup()
}

SyncPick.prototype.openPopup = function () {
    this.markup.popup.classList.add('ap__popup--visible')
    this.open = true
    this.markup.open = true
    this.markup.positionPopup()
}

SyncPick.prototype.closePopupAndFocus = function (e) {
    this.closePopup(e)
    this.markup.button.focus()
}

SyncPick.prototype.closePopup = function (e) {
    let clickedButton = e && (e.target === this.markup.button || e.target.parentElement === this.markup.button)
    if (this.open && !clickedButton) {
        this.markup.popup.classList.remove('ap__popup--visible')
        this.open = false
        this.markup.open = false
    }
}

SyncPick.prototype.addEventListenersForPage = function (pageUl) {
    let self = this
    Array.apply(null, pageUl.querySelectorAll('li.ap__results-list__item')).forEach(function (li) {
        li.addEventListener('click', self.selectHandler)
    })
}

SyncPick.prototype.select = function (e) {
    const li = e.currentTarget
    const key = li.getAttribute('data-value')
    const text = li.getAttribute('data-text')
    const subtext = li.getAttribute('data-subtext')
    const value = this.buildValue(text, subtext)

    this.toggleValue(key, value)

    this.markup.setButtonText(this.values)
    this.triggerChange()
}

SyncPick.prototype.triggerChange = function () {
    let event = new CustomEvent('Event', {detail: this.values})
    event.initEvent('change', true, true)
    this.element.dispatchEvent(event)
}

SyncPick.prototype.toggleValue = function (key, value) {
    if (this.values[key]) {
        this.removeValue(key)
    } else {
        this.addValue(key, value)
    }
}

SyncPick.prototype.addValue = function (key, value) {
    this.values[key] = value
    const newLi = this.markup.selectItem(key, value)
    if (newLi) newLi.addEventListener('click', this.selectHandler)
    this.logDebugMessage('Value added:', value)
}

SyncPick.prototype.removeValue = function (value) {
    delete this.values[value]
    const removedLi = this.markup.deselectItem(value)
    if (removedLi) removedLi.removeEventListener('click', this.selectHandler)
    this.logDebugMessage('Value removed:', value)
}

SyncPick.prototype.buildValue = function (text, subtext, selected) {
    let value = {}
    value[this.textProp] = text
    value[this.subtextProp] = subtext
    value.selected = (selected === 'true')
    return value
}

SyncPick.prototype.logDebugMessage = function (msg, someObject) {
    if (this.debug) {
        if (msg) console.log('SyncPick#' + this.id, msg)
        if (someObject) console.log(someObject)
        if (typeof this.customDebugHandler === 'function') this.customDebugHandler(this)
    }
}

SyncPick.prototype.register = function () {
    SyncPick.elements[this.id] = this
}

SyncPick.prototype.isInitialized = function () {
    if (typeof window.SyncPick === 'undefined') {
        return false
    } else {
        return !!SyncPick.elements[this.id]
    }
}

SyncPick.prototype.destroy = function () {
    if (!this.disabled) this.removeEvents()
    this.markup.destroy()
    this.values = {}
    this.dropdownValues = {}
    delete this.markup
    delete SyncPick.elements[this.id]
}

SyncPick.prototype.reload = function () {
    this.destroy()
    this.disabled = !!this.element.disabled
    this.values = null
    this.initialize()
}

/**
 * Helpers
 */

function onDomRemove(element, onDetachCallback) {
    const observer = new MutationObserver(function () {
        function isDetached(el) {
            if (el.parentNode === document) {
                return false
            } else if (el.parentNode === null) {
                return true
            } else {
                return isDetached(el.parentNode)
            }
        }

        if (isDetached(element)) {
            observer.disconnect()
            onDetachCallback()
        }
    })

    observer.observe(document, {
        childList: true,
        subtree: true
    })
}
