import PickMeSettings from './settings'
import { OptgroupMap, OptionMap } from "../pick-me"

export default class PickMeUi {
    element: HTMLSelectElement
    settings: PickMeSettings
    disabled: boolean
    wrapper: HTMLDivElement
    button: HTMLButtonElement
    popup: HTMLDivElement
    buttonText: HTMLSpanElement
    buttonLabel: HTMLSpanElement
    searchInput: HTMLInputElement
    resultsScrollWrapper: HTMLDivElement
    resultsWrapper: HTMLDivElement
    hovered: Element

    constructor ({ element, settings }: { element: HTMLSelectElement, settings: PickMeSettings }) {
        this.element = element
        this.settings = settings
        this.disabled = false

        this.wrapper = this.buildWrapper()
        this.button = this.buildButton()
        if (!this.disabled) this.popup = this.buildPopup()

        this.hideOriginalSelect()
        this.assemble()
    }

    hideOriginalSelect () {
        this.element.classList.add('pm__hidden')
        this.element.setAttribute('tabindex', '-1')
    }

    showOriginalSelect () {
        this.element.classList.remove('pm__hidden')
        this.element.removeAttribute('tabindex')
    }

    assemble () {
        this.wrapper.appendChild(this.button)
        if (!this.disabled) {
            if (this.settings.base.popup.containerSelector) {
                const container = document.querySelector(this.settings.base.popup.containerSelector)
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

    positionPopup () {
        if (this.settings.base.popup.containerSelector) {
            const pos = this.wrapper.getBoundingClientRect()
            const offset = getOffsetFromBoundingBox(pos)
            const top = offset.top + this.wrapper.offsetHeight

            if (this.shouldDropUp()) {
                this.popup.style.top = (top - this.popup.offsetHeight - this.button.offsetHeight - parseInt(window.getComputedStyle(this.popup).marginTop)).toString() + 'px'
            } else {
                this.popup.style.top = top.toString() + 'px'
            }
            if (this.settings.base.popup.alignRight) {
                const right = window.innerWidth - pos.left - this.wrapper.offsetWidth
                this.popup.style.right = right + 'px'
            } else {
                this.popup.style.left = offset.left.toString() + 'px'
            }
            this.popup.style.minWidth = this.wrapper.offsetWidth + 'px'
            this.popup.style.width = this.settings.base.popup.width
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

    shouldDropUp () {
        const pos = this.button.getBoundingClientRect()
        const offset = getOffsetFromBoundingBox(pos)
        const selectOffsetTop = offset.top - document.documentElement.scrollTop
        const selectOffsetBot = window.innerHeight - selectOffsetTop - this.button.offsetHeight
        return selectOffsetTop > selectOffsetBot && selectOffsetBot < this.popup.offsetHeight
    }

    buildWrapper () {
        const wrapper = document.createElement('div')
        wrapper.classList.add('pick-me')
        if (this.settings.base.multiple) wrapper.classList.add('pick-me--multiple')
        return wrapper
    }

    buildButton () {
        const button = document.createElement('button')
        button.setAttribute('type', 'button')
        button.classList.add('pm__button')
        this.settings.button.classList.forEach(buttonClass => {
            button.classList.add(buttonClass)
        })
        if (this.disabled) {
            button.disabled = true
            this.settings.button.disabledClassList.forEach(buttonDisabledClass => {
                button.classList.add(buttonDisabledClass)
            })
        }

        this.buttonText = document.createElement('span')
        this.buttonText.classList.add('pm__button-text')

        if (this.settings.button.labelText?.length > 0) {
            this.buttonLabel = document.createElement('span')
            this.buttonLabel.classList.add('pm__button-label')
            this.buttonLabel.innerText = this.settings.button.labelText
            button.appendChild(this.buttonLabel)
        }

        button.appendChild(this.buttonText)

        if (this.settings.button.iconHtml && this.settings.button.iconHtml.length > 0) {
            const wrap = document.createElement('span')
            wrap.classList.add('pm__icon-wrapper')
            wrap.insertAdjacentHTML('beforeend', this.settings.button.iconHtml)
            button.appendChild(wrap)
        }

        return button
    }


    buildPopup () {
        const popup = document.createElement('div')
        popup.classList.add('pm__popup')
        if (this.settings.base.popup.alignRight) popup.classList.add('pm__popup--right')

        if (this.settings.search.enabled) popup.appendChild(this.buildSearchInput())
        popup.appendChild(this.buildResultsScrollWrapper())

        return popup
    }

    buildSearchInput () {
        const wrapper = document.createElement('div')
        wrapper.classList.add('pm__search-input__wrapper')
        this.searchInput = document.createElement('input')
        this.searchInput.type = 'search'
        this.searchInput.setAttribute('placeholder', this.settings.search.input.placeholderText)
        this.searchInput.classList.add('pm__search-input')

        this.settings.search.input.classList.forEach(searchInputClass => {
            this.searchInput.classList.add(searchInputClass)
        })

        wrapper.appendChild(this.searchInput)
        return wrapper
    }

    buildResultsScrollWrapper () {
        this.resultsScrollWrapper = document.createElement('div')
        this.resultsScrollWrapper.classList.add('pm__results-scroll-wrapper')
        this.resultsWrapper = document.createElement('div')
        this.resultsWrapper.classList.add('pm__results')
        this.resultsWrapper.setAttribute('aria-role', 'list')
        this.resultsScrollWrapper.appendChild(this.resultsWrapper)
        return this.resultsScrollWrapper
    }

    // dynamic part: optgroups Map<label, value[]>
    renderEntries (allOptions: OptionMap, selectedOptions: OptionMap, optgroups: OptgroupMap) {
        if (optgroups.size > 0) {
            let index = 0
            for (const optgroupLabel of optgroups.keys()) {
                index = index + 1
                if (optgroupLabel && optgroupLabel.length > 0) {
                    const label = document.createElement('span')
                    label.classList.add('pm__opt-group-label')
                    label.innerText = optgroupLabel
                    this.resultsWrapper.appendChild(label)
                }
                const pageUl = buildUl(this.settings.list.classList)
                pageUl.setAttribute('data-label', optgroupLabel)
                this.renderNewEntries(allOptions, selectedOptions, optgroups.get(optgroupLabel), pageUl)
                this.resultsWrapper.appendChild(pageUl)
                if (optgroupLabel && optgroupLabel.length > 0 && index < optgroups.size) {
                    const hr = document.createElement('hr')
                    hr.classList.add('pm__hr')
                    this.resultsWrapper.appendChild(hr)
                }
            }
        } else {
            const li = buildLi({ text: this.settings.search.noResultsText })
            li.classList.add('pm__results-list__item--muted')
            const pageUl = buildUl(this.settings.list.classList)
            pageUl.appendChild(li)
            this.resultsWrapper.appendChild(pageUl)
        }
    }

    renderNewEntries (allOptions: OptionMap, selectedOptions: OptionMap, optgroupValues: string[], ul: HTMLUListElement) {
        for (const value of optgroupValues) {
            const optionData = allOptions.get(value)
            const li = buildLi({
                value,
                ...optionData,
                selected: selectedOptions.has(value),
                multiple: this.settings.base.multiple,
                checkedIconHtml: this.settings.list.checkedIconHtml
            })
            ul.appendChild(li)
        }
    }

    selectItem (value: string) {
        const option = this.element.querySelector('option[value="' + value.replaceAll('"', '\\"') + '"]') as HTMLOptionElement
        option.selected = true
        option.setAttribute('data-selected', '')
        this.addSelectedClassByValue(value)
    }

    deselectItem (value: string) {
        const option = this.element.querySelector('option[value="' + value.replaceAll('"', '\\"') + '"]') as HTMLOptionElement
        option.selected = false
        option.removeAttribute('data-selected')
        this.removeSelectedClassByValue(value)
    }

    addSelectedClassByValue (value: string) {
        const li = this.resultsWrapper.querySelector('li[data-value="' + value.replaceAll('"', '\\"') + '"]') as HTMLLIElement
        if (li) setLiSelected(li, true, this.settings.base.multiple, this.settings.list.checkedIconHtml)
    }

    removeSelectedClassByValue (value: string) {
        const li = this.resultsWrapper.querySelector('li[data-value="' + value.replaceAll('"', '\\"') + '"]') as HTMLLIElement
        if (li) setLiSelected(li, false, this.settings.base.multiple, this.settings.list.checkedIconHtml)
    }

    destroy () {
        this.showOriginalSelect()
        if (this.settings.base.popup.containerSelector) {
            const container = document.querySelector(this.settings.base.popup.containerSelector)
            if (container) container.removeChild(this.popup)
        }
        if (this.element && this.element.parentNode) this.element.parentNode.removeChild(this.wrapper)
    }

    getSelected () {
        return this.resultsWrapper.querySelectorAll('li.pm__results-list__item--selected')[0]
    }

    focusPreviousEntry () {
        if (!this.hovered) this.hovered = this.getSelected()
        const allLis = Array.from(this.resultsWrapper.querySelectorAll('li.pm__results-list__item[data-value]'))
        if (this.hovered) {
            const hoveredIndex = allLis.indexOf(this.hovered)
            if (hoveredIndex > 0) {
                this.hovered.classList.remove('pm__results-list__item--hover')
                this.hovered = allLis[hoveredIndex - 1]
                this.hovered.classList.add('pm__results-list__item--hover')
                this.scrollEntryIntoView(this.hovered)
            }
        } else {
            const first = allLis[0]
            if (!first) return
            first.classList.add('pm__results-list__item--hover')
            this.hovered = first
            this.scrollEntryIntoView(first)
        }
    }

    focusNextEntry () {
        if (!this.hovered) this.hovered = this.getSelected()
        const allLis = Array.from(this.resultsWrapper.querySelectorAll('li.pm__results-list__item[data-value]'))
        if (this.hovered) {
            const hoveredIndex = allLis.indexOf(this.hovered)
            if (hoveredIndex < allLis.length - 1) {
                this.hovered.classList.remove('pm__results-list__item--hover')
                this.hovered = allLis[hoveredIndex + 1]
                this.hovered.classList.add('pm__results-list__item--hover')
                this.scrollEntryIntoView(this.hovered)
            }
        } else {
            const first = allLis[0]
            if (!first) return
            first.classList.add('pm__results-list__item--hover')
            this.hovered = first
            this.scrollEntryIntoView(first)
        }
    }

    scrollEntryIntoView (entry) {
        const entryOffsetTop = entry.offsetTop - this.resultsScrollWrapper.offsetTop
        const shouldScrollDown = this.resultsScrollWrapper.offsetHeight + this.resultsScrollWrapper.scrollTop < entryOffsetTop + entry.offsetHeight
        const shouldScrollUp = entryOffsetTop < this.resultsScrollWrapper.scrollTop

        if (shouldScrollDown) {
            this.resultsScrollWrapper.scrollTop = entryOffsetTop - this.resultsScrollWrapper.offsetHeight + entry.offsetHeight
        } else if (shouldScrollUp) {
            this.resultsScrollWrapper.scrollTop = entryOffsetTop
        }
    }

    setButtonText (selectedValues: OptionMap) {
        if (selectedValues && selectedValues.size > 0) {
            this.buttonText.innerHTML = this.renderButtonText(selectedValues)
        } else {
            this.buttonText.innerHTML = this.settings.button.placeholderText
        }
    }

    renderButtonText (selectedValues: OptionMap) {
        if (this.settings.button.selectedText.format) {
            const match = this.settings.button.selectedText.format.match(/count\s?>\s?([0-9]*)/)
            const count = match && match[1] && parseInt(match[1])

            if (count && count < selectedValues.size) {
                return this.settings.button.selectedText.text.replace(this.settings.button.selectedText.variable, selectedValues.size.toString())
            } else {
                return joinSelectedTexts(selectedValues)
            }
        } else {
            return joinSelectedTexts(selectedValues)
        }
    }
}

function joinSelectedTexts (selectedValues: OptionMap) {
    const selected = []
    for (const optionData of selectedValues.values()) {
        selected.push(optionData.text)
    }
    return selected.join(', ')
}

function buildUl (additionalClasses: string[]) {
    const pageUl = document.createElement('ul')
    pageUl.classList.add('pm__results-list')
    pageUl.setAttribute('aria-role', 'listbox')
    additionalClasses.forEach(function (listClass) {
        pageUl.classList.add(listClass)
    })
    return pageUl
}

function buildLi (options: {
    text: string;
    selected?: boolean;
    multiple?: boolean;
    checkedIconHtml?: string;
    subtext?: string;
    img?: string;
    searchData?: string;
    value?: string
}) {
    const text = options.text
    const value = options.value
    const subtext = options.subtext
    const imgAttributes = options.img
    const li = document.createElement('li')

    const textSpan = document.createElement('span')
    textSpan.classList.add('pm__results-list__item__text')
    textSpan.innerHTML = text

    if (typeof value !== 'undefined' && value !== null) li.setAttribute('data-value', value)
    if (typeof text !== 'undefined' && text !== null) {
        li.setAttribute('aria-label', text)
        li.setAttribute('title', textSpan.innerText)
    }

    li.setAttribute('aria-role', 'listitem')
    li.classList.add('pm__results-list__item')

    if (typeof imgAttributes !== 'undefined' && imgAttributes !== null) {
        const imageTag = document.createElement('img')
        Object.keys(imgAttributes).forEach(function (attr) {
            imageTag.setAttribute(attr, imgAttributes[attr])
        })

        imageTag.classList.add('pm__results-list__item__image')
        li.appendChild(imageTag)
    }

    li.appendChild(textSpan)

    if (typeof subtext !== 'undefined' && subtext !== null) {
        const subtextDom = document.createElement('small')
        subtextDom.innerHTML = subtext
        subtextDom.classList.add('pm__results-list__item__subtext')
        li.appendChild(subtextDom)
    }

    if (options.selected) {
        setLiSelected(li, true, options.multiple, options.checkedIconHtml)
    }
    return li
}

function setLiSelected (li: HTMLLIElement, selected: boolean, addCheck: boolean, checkedIconHtml: string) {
    if (selected) {
        if (addCheck) {
            const wrap = document.createElement('span')
            wrap.classList.add('pm__results-list__item__check-mark')
            li.appendChild(wrap)

            wrap.insertAdjacentHTML('beforeend', checkedIconHtml)
        } else {
            li.classList.remove('pm__results-list__item--hover')
            li.classList.add('pm__results-list__item--selected')
        }
    } else {
        if (addCheck) {
            const check = li.querySelector('.pm__results-list__item__check-mark')
            if (check) li.removeChild(check)
        } else {
            li.classList.remove('pm__results-list__item--selected')
        }
    }
}

function getOffsetFromBoundingBox (box) {
    const docElem = document.documentElement

    return {
        top: box.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
        left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
    }
}
