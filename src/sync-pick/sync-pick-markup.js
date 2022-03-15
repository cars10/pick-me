export default function SyncPickMarkup(options) {
    this.element = options.element
    this.multiple = options.multiple || false
    this.disabled = options.disabled || false
    this.valueProp = options.valueProp
    this.textProp = options.textProp
    this.subtextProp = options.subtextProp
    this.searchPlaceholder = options.searchPlaceholder
    this.searchInputClasses = options.searchInputClasses
    this.buttonClasses = options.buttonClasses
    this.buttonDisabledClasses = options.buttonDisabledClasses
    this.emptySelectButtonText = options.emptySelectButtonText
    this.buttonIconClasses = options.buttonIconClasses
    this.checkedIconClasses = options.checkedIconClasses
    this.listClasses = options.listClasses
    this.selectedTextFormat = options.selectedTextFormat
    this.selectedTextVariable = options.selectedTextVariable
    this.selectedText = options.selectedText
    this.noResultsText = options.noResultsText
    this.container = options.container
    this.withSearch = options.withSearch
    this.withSelectAllButton = options.withSelectAllButton
    this.selectAllButtonClasses = options.selectAllButtonClasses
    this.selectAllButtonGroupClasses = options.selectAllButtonGroupClasses
    this.selectAllButtonText = options.selectAllButtonText
    this.deselectAllButtonText = options.deselectAllButtonText
    this.dropdownAlignRight = options.dropdownAlignRight
    this.popupWidth = options.popupWidth
    this.open = false

    this.wrapper = this.buildWrapper()
    this.button = this.buildButton()
    if (!this.disabled) this.popup = this.buildPopup()

    this.hideOriginalSelect()
    this.assemble()
}

SyncPickMarkup.prototype.hideOriginalSelect = function () {
    this.element.classList.add('visually-hidden')
}

SyncPickMarkup.prototype.showOriginalSelect = function () {
    this.element.style.display = 'initial'
}

SyncPickMarkup.prototype.assemble = function () {
    this.wrapper.appendChild(this.button)
    if (!this.disabled) {
        if (!!this.container) {
            const container = document.querySelector(this.container)
            if (container) {
                container.appendChild(this.popup)
                this.popup.style.position = 'absolute'
                this.popup.style.top = '0'
            }
        } else {
            this.wrapper.appendChild(this.popup)
        }
    }
    this.element.parentNode.insertBefore(this.wrapper, this.element)
}

SyncPickMarkup.prototype.positionPopup = function () {
    if (!this.open) return
    if (!!this.container) {
        const pos = this.wrapper.getBoundingClientRect()
        const offset = getOffsetFromBoundingBox(pos)
        const top = offset.top + this.wrapper.offsetHeight

        if (this.shouldDropUp()) {
            this.popup.style.top = (top - this.popup.offsetHeight - this.button.offsetHeight - parseInt(window.getComputedStyle(this.popup).marginTop)).toString() + 'px'
        } else {
            this.popup.style.top = top.toString() + 'px'
        }
        if (this.dropdownAlignRight) {
            const right = window.innerWidth - pos.left - this.wrapper.offsetWidth
            this.popup.style.right = right + 'px'
        } else {
            this.popup.style.left = offset.left.toString() + 'px'
        }
        this.popup.style.minWidth = this.wrapper.offsetWidth + 'px'
        this.popup.style.width = this.popupWidth
        this.popup.style.position = 'absolute'
    } else {
        if (this.shouldDropUp()) {
            this.popup.style.top = 'auto'
            this.popup.style.bottom = (this.button.offsetHeight + parseInt(window.getComputedStyle(this.popup).marginTop)).toString() + 'px'
        } else {
            this.popup.style.top = '100%'
            this.popup.style.bottom = 'auto'
        }
    }
}

SyncPickMarkup.prototype.shouldDropUp = function () {
    const pos = this.button.getBoundingClientRect()
    const offset = getOffsetFromBoundingBox(pos)
    const selectOffsetTop = offset.top - document.documentElement.scrollTop
    const selectOffsetBot = window.innerHeight - selectOffsetTop - this.button.offsetHeight
    return selectOffsetTop > selectOffsetBot && selectOffsetBot < this.popup.offsetHeight
}

SyncPickMarkup.prototype.buildWrapper = function () {
    const wrapper = document.createElement('div')
    wrapper.classList.add('sync-pick')
    wrapper.classList.add('sync-pick--multiple')
    const elementClasses = this.element.classList
    Array.apply(null, elementClasses).forEach(function (elementClass) {
        wrapper.classList.add(elementClass)
    })
    return wrapper
}

SyncPickMarkup.prototype.buildButton = function () {
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    this.buttonClasses.forEach(function (buttonClass) {
        button.classList.add(buttonClass)
    })
    if (this.disabled) {
        this.buttonDisabledClasses.forEach(function (buttonDisabledClass) {
            button.classList.add(buttonDisabledClass)
        })
    }

    this.buttonText = document.createElement('span')
    this.buttonText.classList.add('sp__button-text')

    if (this.buttonIconClasses && this.buttonIconClasses.length > 0) {
        let buttonIcon = document.createElement('i')
        this.buttonIconClasses.forEach(function (buttonIconClass) {
            buttonIcon.classList.add(buttonIconClass)
        })
        button.appendChild(this.buttonText)
        button.appendChild(buttonIcon)
    } else {
        button.appendChild(this.buttonText)
    }

    return button
}

SyncPickMarkup.prototype.buildPopup = function () {
    const popup = document.createElement('div')
    popup.classList.add('sp__popup')
    if (this.dropdownAlignRight) popup.classList.add('sp__popup--right')

    if (this.withSearch) popup.appendChild(this.buildSearchInput())
    if (this.withSelectAllButton) popup.appendChild(this.buildSelectAllButtons())
    popup.appendChild(this.buildResultsScrollWrapper())

    return popup
}

SyncPickMarkup.prototype.buildSearchInput = function () {
    const wrapper = document.createElement('div')
    wrapper.classList.add('sp__search-input__wrapper')
    this.searchInput = document.createElement('input')
    this.searchInput.type = 'search'
    this.searchInput.setAttribute('placeholder', this.searchPlaceholder)
    this.searchInput.classList.add('sp__search-input')

    let self = this
    this.searchInputClasses.forEach(function (searchInputClass) {
        self.searchInput.classList.add(searchInputClass)
    })

    wrapper.appendChild(this.searchInput)
    return wrapper
}

SyncPickMarkup.prototype.buildSelectAllButtons = function () {
    const buttongroup = document.createElement('div')
    this.selectAllButtonGroupClasses.forEach(function (buttonGroupClass) {
        buttongroup.classList.add(buttonGroupClass)
    })
    this.selectAllButton = document.createElement('button')
    this.selectAllButton.setAttribute('type', 'button')
    this.deselectAllButton = document.createElement('button')
    this.deselectAllButton.setAttribute('type', 'button')
    this.selectAllButton.innerHTML = this.selectAllButtonText
    this.deselectAllButton.innerHTML = this.deselectAllButtonText
    let self = this
    this.selectAllButtonClasses.forEach(function (buttonClass) {
        self.selectAllButton.classList.add(buttonClass)
        self.deselectAllButton.classList.add(buttonClass)
    })
    buttongroup.appendChild(this.selectAllButton)
    buttongroup.appendChild(this.deselectAllButton)

    return buttongroup
}

SyncPickMarkup.prototype.buildResultsScrollWrapper = function () {
    this.resultsScrollWrapper = document.createElement('div')
    this.resultsScrollWrapper.classList.add('sp__results-scroll-wrapper')
    this.resultsWrapper = document.createElement('div')
    this.resultsWrapper.classList.add('sp__results')
    this.resultsWrapper.setAttribute('aria-role', 'list')
    this.resultsScrollWrapper.appendChild(this.resultsWrapper)
    return this.resultsScrollWrapper
}

SyncPickMarkup.prototype.appendEntries = function (dropdownValues, selectedValues) {
    if (Object.keys(dropdownValues).length > 0) {
        Object.entries(dropdownValues).forEach(([optGroupLabel, options]) => {
            if(optGroupLabel && optGroupLabel.length > 0){
                const label = document.createElement('span')
                label.innerText = optGroupLabel
                this.resultsWrapper.appendChild(label)
            }
            const pageUl = buildUl(this.listClasses)
            pageUl.setAttribute('data-label', optGroupLabel)
            this.renderNewEntries(options, pageUl, selectedValues)
            this.resultsWrapper.appendChild(pageUl)
        })
    } else {
        const li = buildLi({text: this.noResultsText})
        li.classList.add('sp__results-list__item--muted')
        const pageUl = buildUl(this.listClasses)
        pageUl.appendChild(li)
        this.resultsWrapper.appendChild(pageUl)
    }

}

SyncPickMarkup.prototype.renderNewEntries = function (options, ul, selectedValues) {
    let self = this
    Object.entries(options).forEach(([value, element]) => {
        const li = buildLi({
            value: value,
            text: element[self.textProp],
            subtext: element[self.subtextProp],
            selected: selectedValues.indexOf(value) > -1,
            checkedIconClasses: self.checkedIconClasses
        })
        ul.appendChild(li)
    })
}

SyncPickMarkup.prototype.selectItem = function (value) {
    const option = this.element.querySelector('option[value="' + value + '"]')
    option.selected = true
    option.setAttribute('selected', '')
    this.addSelectedClassByValue(value)
}

SyncPickMarkup.prototype.deselectItem = function (value) {
    const option = this.element.querySelector('option[value="' + value + '"]')
    option.selected = false
    option.removeAttribute('selected')
    this.removeSelectedClassByValue(value)
}

SyncPickMarkup.prototype.addSelectedClassByValue = function (value) {
    const li = this.resultsWrapper.querySelector('li[data-value="' + value + '"]')
    if (li) setLiSelected(li, true, this.checkedIconClasses)
}

SyncPickMarkup.prototype.removeSelectedClassByValue = function (value) {
    const li = this.resultsWrapper.querySelector('li[data-value="' + value + '"]')
    if (li) setLiSelected(li, false, this.checkedIconClasses)
}

SyncPickMarkup.prototype.destroy = function () {
    this.showOriginalSelect()
    if (!!this.container) {
        const container = document.querySelector(this.container)
        if (container) container.removeChild(this.popup)
    }
    if (this.element && this.element.parentNode) this.element.parentNode.removeChild(this.wrapper)
}

SyncPickMarkup.prototype.getSelected = function () {
    return this.resultsWrapper.querySelectorAll('li.sp__results-list__item--selected')[0]
}

SyncPickMarkup.prototype.focusPreviousEntry = function () {
    const selected = this.getSelected()
    if (selected) {
        const prev = selected.previousSibling || (selected.parentNode && selected.parentNode.previousSibling && selected.parentNode.previousSibling.lastChild)
        if (prev) {
            selected.classList.remove('sp__results-list__item--selected')
            prev.classList.add('sp__results-list__item--selected')
            this.scrollEntryIntoView(prev)
        }
    } else {
        const first = this.resultsWrapper.querySelectorAll('li.sp__results-list__item[data-value]')[0]
        first.classList.add('sp__results-list__item--selected')
        this.scrollEntryIntoView(first)
    }
}

SyncPickMarkup.prototype.focusNextEntry = function () {
    const selected = this.getSelected()
    if (selected) {
        const next = selected.nextSibling || (selected.parentNode && selected.parentNode.nextSibling && selected.parentNode.nextSibling.firstChild)
        if (next) {
            selected.classList.remove('sp__results-list__item--selected')
            next.classList.add('sp__results-list__item--selected')
            this.scrollEntryIntoView(next)
        }
    } else {
        const first = this.resultsWrapper.querySelectorAll('li.sp__results-list__item[data-value]')[0]
        first.classList.add('sp__results-list__item--selected')
        this.scrollEntryIntoView(first)
    }
}

SyncPickMarkup.prototype.scrollEntryIntoView = function (entry) {
    const entryOffsetTop = entry.offsetTop - this.resultsScrollWrapper.offsetTop
    const shouldScrollDown = this.resultsScrollWrapper.offsetHeight + this.resultsScrollWrapper.scrollTop < entryOffsetTop + entry.offsetHeight
    const shouldScrollUp = entryOffsetTop < this.resultsScrollWrapper.scrollTop

    if (shouldScrollDown) {
        this.resultsScrollWrapper.scrollTop = entryOffsetTop - this.resultsScrollWrapper.offsetHeight + entry.offsetHeight
    } else if (shouldScrollUp) {
        this.resultsScrollWrapper.scrollTop = entryOffsetTop
    }
}

SyncPickMarkup.prototype.setButtonText = function (values) {
    if (values && Object.keys(values).length > 0) {
        this.buttonText.innerHTML = this.renderButtonText(values)
    } else {
        this.buttonText.innerHTML = this.emptySelectButtonText
    }
}

SyncPickMarkup.prototype.renderButtonText = function (values) {
    if (this.selectedTextFormat) {
        const match = this.selectedTextFormat.match(/count\s?>\s?([0-9]*)/)
        const count = match && match[1] && parseInt(match[1])

        if (count && count < Object.keys(values).length) {
            return this.selectedText.replace(this.selectedTextVariable, Object.keys(values).length)
        } else {
            return joinSelectedTexts(values, this.textProp)
        }
    } else {
        return joinSelectedTexts(values, this.textProp)
    }
}

function joinSelectedTexts(values, textProp) {
    let selected = []
    Object.keys(values).forEach(function (key) {
        selected.push(values[key][textProp])
    })
    return selected.join(', ')
}

function buildUl(additionalClasses) {
    const pageUl = document.createElement('ul')
    pageUl.classList.add('sp__results-list')
    pageUl.setAttribute('aria-role', 'listbox')
    additionalClasses.forEach(function (listClass) {
        pageUl.classList.add(listClass)
    })
    return pageUl
}

function buildLi(options) {
    const text = options.text
    const value = options.value
    const subtext = options.subtext
    const li = document.createElement('li')

    const textSpan = document.createElement('span')
    textSpan.classList.add('sp__results-list__item__text')
    textSpan.innerHTML = text

    if (typeof value !== 'undefined' && value !== null) li.setAttribute('data-value', value)
    if (typeof text !== 'undefined' && text !== null) {
        li.setAttribute('aria-label', text)
        li.setAttribute('title', textSpan.innerText)
        li.setAttribute('data-text', text)
    }
    if (typeof subtext !== 'undefined' && subtext !== null) {
        li.setAttribute('data-subtext', subtext)
        const subtextDom = document.createElement('small')
        subtextDom.innerHTML = subtext
        subtextDom.classList.add('sp__results-list__item__subtext')
        textSpan.appendChild(subtextDom)
    }

    li.setAttribute('aria-role', 'listitem')
    li.classList.add('sp__results-list__item')

    li.appendChild(textSpan)
    if (options.selected) {
        setLiSelected(li, true, options.checkedIconClasses)
    }
    return li
}

function setLiSelected(li, selected, checkedIconClasses) {
    if (selected) {
        const check = document.createElement('i')
        checkedIconClasses.forEach(function (checkedIconClass) {
            check.classList.add(checkedIconClass)
        })
        check.classList.add('sp__results-list__item__check-mark')
        li.appendChild(check)
    } else {
        const check = li.querySelector('.sp__results-list__item__check-mark')
        if (check) li.removeChild(check)
    }
}

function getOffsetFromBoundingBox(box) {
    const docElem = document.documentElement

    return {
        top: box.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
        left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
    }
}
