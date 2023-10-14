export default function PickMeMarkup (options) {
  this.element = options.element
  this.multiple = options.multiple || false
  this.disabled = options.disabled || false
  this.valueProp = options.valueProp
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
  this.dropdownAlignRight = options.dropdownAlignRight
  this.popupWidth = options.popupWidth
  this.open = false

  this.wrapper = this.buildWrapper()
  this.button = this.buildButton()
  if (!this.disabled) this.popup = this.buildPopup()

  this.hideOriginalSelect()
  this.assemble()
}

PickMeMarkup.prototype.hideOriginalSelect = function () {
  this.element.classList.add('visually-hidden')
  this.element.setAttribute('tabindex', '-1')
}

PickMeMarkup.prototype.showOriginalSelect = function () {
  this.element.classList.remove('visuallyhidden')
}

PickMeMarkup.prototype.assemble = function () {
  this.wrapper.appendChild(this.button)
  if (!this.disabled) {
    if (this.container) {
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

PickMeMarkup.prototype.positionPopup = function () {
  if (!this.open) return
  if (this.container) {
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

PickMeMarkup.prototype.shouldDropUp = function () {
  const pos = this.button.getBoundingClientRect()
  const offset = getOffsetFromBoundingBox(pos)
  const selectOffsetTop = offset.top - document.documentElement.scrollTop
  const selectOffsetBot = window.innerHeight - selectOffsetTop - this.button.offsetHeight
  return selectOffsetTop > selectOffsetBot && selectOffsetBot < this.popup.offsetHeight
}

PickMeMarkup.prototype.buildWrapper = function () {
  const wrapper = document.createElement('div')
  wrapper.classList.add('pick-me')
  if (this.multiple) wrapper.classList.add('pick-me--multiple')
  return wrapper
}

PickMeMarkup.prototype.buildButton = function () {
  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.classList.add('pm__button')
  this.buttonClasses.forEach(function (buttonClass) {
    button.classList.add(buttonClass)
  })
  if (this.disabled) {
    button.disabled = true
    this.buttonDisabledClasses.forEach(function (buttonDisabledClass) {
      button.classList.add(buttonDisabledClass)
    })
  }

  this.buttonText = document.createElement('span')
  this.buttonText.classList.add('pm__button-text')

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

PickMeMarkup.prototype.buildPopup = function () {
  const popup = document.createElement('div')
  popup.classList.add('pm__popup')
  if (this.dropdownAlignRight) popup.classList.add('pm__popup--right')

  if (this.withSearch) popup.appendChild(this.buildSearchInput())
  popup.appendChild(this.buildResultsScrollWrapper())

  return popup
}

PickMeMarkup.prototype.buildSearchInput = function () {
  const wrapper = document.createElement('div')
  wrapper.classList.add('pm__search-input__wrapper')
  this.searchInput = document.createElement('input')
  this.searchInput.type = 'search'
  this.searchInput.setAttribute('placeholder', this.searchPlaceholder)
  this.searchInput.classList.add('pm__search-input')

  let self = this
  this.searchInputClasses.forEach(function (searchInputClass) {
    self.searchInput.classList.add(searchInputClass)
  })

  wrapper.appendChild(this.searchInput)
  return wrapper
}

PickMeMarkup.prototype.buildResultsScrollWrapper = function () {
  this.resultsScrollWrapper = document.createElement('div')
  this.resultsScrollWrapper.classList.add('pm__results-scroll-wrapper')
  this.resultsWrapper = document.createElement('div')
  this.resultsWrapper.classList.add('pm__results')
  this.resultsWrapper.setAttribute('aria-role', 'list')
  this.resultsScrollWrapper.appendChild(this.resultsWrapper)
  return this.resultsScrollWrapper
}

PickMeMarkup.prototype.appendEntries = function (allOptions, selectedValues) {
  if (allOptions.size > 0) {

    for (let [optGroupLabel, options] of allOptions) {
      if (optGroupLabel && optGroupLabel.length > 0) {
        const label = document.createElement('span')
        label.classList.add('pm__opt-group-label')
        label.innerText = optGroupLabel
        this.resultsWrapper.appendChild(label)
      }
      const pageUl = buildUl(this.listClasses)
      pageUl.setAttribute('data-label', optGroupLabel)
      this.renderNewEntries(options, pageUl, selectedValues)
      this.resultsWrapper.appendChild(pageUl)
      //if (optGroupLabel && optGroupLabel.length > 0 && arr[index + 1]) {
      const hr = document.createElement('hr')
      hr.classList.add('pm__hr')
      this.resultsWrapper.appendChild(hr)
    }
  } else {
    const li = buildLi({ text: this.noResultsText })
    li.classList.add('pm__results-list__item--muted')
    const pageUl = buildUl(this.listClasses)
    pageUl.appendChild(li)
    this.resultsWrapper.appendChild(pageUl)
  }

}

PickMeMarkup.prototype.renderNewEntries = function (options, ul, selectedValues) {
  for (let [value, element] of options) {
    const li = buildLi({
      value,
      ...element,
      selected: selectedValues.indexOf(value) > -1,
      multiple: this.multiple,
      checkedIconClasses: this.checkedIconClasses
    })
    ul.appendChild(li)
  }
}

PickMeMarkup.prototype.selectItem = function (value) {
  const option = this.element.querySelector('option[value="' + value.replaceAll('"', '\\"') + '"]')
  option.selected = true
  option.setAttribute('data-selected', '')
  this.addSelectedClassByValue(value)
}

PickMeMarkup.prototype.deselectItem = function (value) {
  const option = this.element.querySelector('option[value="' + value.replaceAll('"', '\\"') + '"]')
  option.selected = false
  option.removeAttribute('data-selected')
  this.removeSelectedClassByValue(value)
}

PickMeMarkup.prototype.addSelectedClassByValue = function (value) {
  const li = this.resultsWrapper.querySelector('li[data-value="' + value.replaceAll('"', '\\"') + '"]')
  if (li) setLiSelected(li, true, this.multiple, this.checkedIconClasses)
}

PickMeMarkup.prototype.removeSelectedClassByValue = function (value) {
  const li = this.resultsWrapper.querySelector('li[data-value="' + value.replaceAll('"', '\\"') + '"]')
  if (li) setLiSelected(li, false, this.multiple, this.checkedIconClasses)
}

PickMeMarkup.prototype.destroy = function () {
  this.showOriginalSelect()
  if (this.container) {
    const container = document.querySelector(this.container)
    if (container) container.removeChild(this.popup)
  }
  if (this.element && this.element.parentNode) this.element.parentNode.removeChild(this.wrapper)
}

PickMeMarkup.prototype.getSelected = function () {
  return this.resultsWrapper.querySelectorAll('li.pm__results-list__item--selected')[0]
}

PickMeMarkup.prototype.getHovered = function () {
  return this.hovered
}

PickMeMarkup.prototype.focusPreviousEntry = function () {
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

PickMeMarkup.prototype.focusNextEntry = function () {
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

PickMeMarkup.prototype.scrollEntryIntoView = function (entry) {
  const entryOffsetTop = entry.offsetTop - this.resultsScrollWrapper.offsetTop
  const shouldScrollDown = this.resultsScrollWrapper.offsetHeight + this.resultsScrollWrapper.scrollTop < entryOffsetTop + entry.offsetHeight
  const shouldScrollUp = entryOffsetTop < this.resultsScrollWrapper.scrollTop

  if (shouldScrollDown) {
    this.resultsScrollWrapper.scrollTop = entryOffsetTop - this.resultsScrollWrapper.offsetHeight + entry.offsetHeight
  } else if (shouldScrollUp) {
    this.resultsScrollWrapper.scrollTop = entryOffsetTop
  }
}

PickMeMarkup.prototype.setButtonText = function (selectedValues) {
  if (selectedValues && selectedValues.size > 0) {
    this.buttonText.innerHTML = this.renderButtonText(selectedValues)
  } else {
    this.buttonText.innerHTML = this.emptySelectButtonText
  }
}

PickMeMarkup.prototype.renderButtonText = function (selectedValues) {
  if (this.selectedTextFormat) {
    const match = this.selectedTextFormat.match(/count\s?>\s?([0-9]*)/)
    const count = match && match[1] && parseInt(match[1])

    if (count && count < selectedValues.size) {
      return this.selectedText.replace(this.selectedTextVariable, selectedValues.size)
    } else {
      return joinSelectedTexts(selectedValues)
    }
  } else {
    return joinSelectedTexts(selectedValues)
  }
}

function joinSelectedTexts (selectedValues) {
  let selected = []
  for (let [value, optionData] of selectedValues) {
    selected.push(optionData.text)
  }
  return selected.join(', ')
}

function buildUl (additionalClasses) {
  const pageUl = document.createElement('ul')
  pageUl.classList.add('pm__results-list')
  pageUl.setAttribute('aria-role', 'listbox')
  additionalClasses.forEach(function (listClass) {
    pageUl.classList.add(listClass)
  })
  return pageUl
}

function buildLi (options) {
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
    li.setAttribute('data-text', text)
  }

  li.setAttribute('aria-role', 'listitem')
  li.classList.add('pm__results-list__item')

  if (typeof imgAttributes !== 'undefined' && imgAttributes !== null) {
    const imageTag = document.createElement('img')
    Object.keys(imgAttributes).forEach(function (attr) {
      imageTag.setAttribute(attr, imgAttributes[attr])
    })

    imageTag.classList.add('pm__results-list__item__image')
    li.setAttribute('data-img', JSON.stringify(imgAttributes))
    li.appendChild(imageTag)
  }

  li.appendChild(textSpan)

  if (typeof subtext !== 'undefined' && subtext !== null) {
    li.setAttribute('data-subtext', subtext)
    const subtextDom = document.createElement('small')
    subtextDom.innerHTML = subtext
    subtextDom.classList.add('pm__results-list__item__subtext')
    li.appendChild(subtextDom)
  }

  if (options.selected) {
    setLiSelected(li, true, options.multiple, options.checkedIconClasses)
  }
  return li
}

function setLiSelected (li, selected, addCheck, checkedIconClasses) {
  if (selected) {
    if (addCheck) {
      const check = document.createElement('i')
      checkedIconClasses.forEach(function (checkedIconClass) {
        check.classList.add(checkedIconClass)
      })
      check.classList.add('pm__results-list__item__check-mark')
      li.appendChild(check)
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
