import PickMeMarkup from './pick-me/pick-me-markup'
import PickMeSettings from './pick-me/settings'

export default class PickMe {
  constructor (options) {
    this.id = options.id
    this.element = document.getElementById(this.id)
    this.label = document.querySelector('label[for="' + this.id + '"]')

    this.settings = new PickMeSettings(options)

    this.selectedValues = options.values || null
    this.debug = options.debug || false

    this.initialSelectedValues = []
    this.open = false
    this.handlers = {}

    this.initialize()
    this.logDebugMessage('initialized with options:', this.settings)
    return this
  }

  initialize () {
    this.setupInitialValues()
    this.ui = this.buildMarkup()
    this.addHandlers()
    this.addEvents()
    this.setupValues()

    this.ui.appendEntries(this.dropdownValues, Object.keys(this.selectedValues), this.selectedValuesOrder)
    this.addEventListenersForPage()

    this.ui.setButtonText(this.selectedValues)
  }

  setupInitialValues () {
    const options = this.element.querySelectorAll('option[selected]')
    options.forEach(option => (this.initialSelectedValues.push(option.value)))
  }

  addHandlers () {
    this.handlers.closePopupHandler = e => (this.closePopup(e))
    this.handlers.selectHandler = e => (this.select(e))
    this.handlers.containerPositionHandler = () => (this.ui.positionPopup())
    this.handlers.resetFormHandler = () => (this.resetAndReload())
    this.handlers.labelClickHandler = e => {
      e.preventDefault()
      this.ui.button.focus()
    }
  }

  addEvents () {
    this.ui.button.addEventListener('click', () => (this.togglePopup()))
    this.ui.popup.addEventListener('click', e => (e.stopPropagation()))
    if (this.settings.selectAll.enabled) {
      this.ui.selectAllButton.addEventListener('click', () => (this.selectAllEntries()))
      this.ui.deselectAllButton.addEventListener('click', () => (this.deselectAllEntries()))
    }
    if (this.settings.search.enabled) {
      this.ui.searchInput.addEventListener('input', () => (this.search()))
      this.ui.button.addEventListener('keydown', e => (this.onButtonKeyDown(e)))
      this.ui.popup.addEventListener('keydown', e => (this.onMarkupKeyDown(e)))
    } else {
      this.ui.button.addEventListener('keydown', e => (this.onMarkupKeyDown(e)))
    }
    document.addEventListener('click', this.handlers.closePopupHandler)
    window.addEventListener('resize', this.handlers.containerPositionHandler)
    window.addEventListener('scroll', this.handlers.containerPositionHandler)
    if (this.label) this.label.addEventListener('click', this.handlers.labelClickHandler)
    if (this.element.form) this.element.form.addEventListener('reset', this.handlers.resetFormHandler)
    onDomRemove(this.ui.element, this.destroy.bind(this))
  }

  setupValues () {
    if (!this.selectedValues) {
      this.selectedValues = {}
      this.dropdownValues = {}
      this.selectedValuesOrder = {}
      Array.apply(null, this.element.options).forEach(option => {
        let optgrouplabel
        if (option.parentNode.nodeName === 'OPTGROUP') {
          optgrouplabel = option.parentNode.label
        } else {
          optgrouplabel = ''
        }
        if (!this.selectedValuesOrder[optgrouplabel]) this.selectedValuesOrder[optgrouplabel] = []

        this.selectedValuesOrder[optgrouplabel].push(option.value)
        if (!this.dropdownValues[optgrouplabel]) this.dropdownValues[optgrouplabel] = {}

        const newValue = {
          text: option.innerHTML,
          subtext: option.getAttribute('data-subtext'),
          img: JSON.parse(option.getAttribute('data-img'))
        }
        this.dropdownValues[optgrouplabel][option.value] = newValue

        if (option.selected || option.hasAttribute('selected')) {
          this.selectedValues[option.value] = newValue
          option.setAttribute('data-selected', true)
        }
      })
    }
  }

  buildMarkup () {
    return new PickMeMarkup({
      element: this.element,
      multiple: this.settings.base.multiple,
      disabled: false,
      searchPlaceholder: this.settings.search.input.placeholderText,
      searchInputClasses: this.settings.search.input.classList,
      buttonClasses: this.settings.button.classList,
      buttonDisabledClasses: [],
      emptySelectButtonText: this.settings.button.placeholderText,
      buttonIconClasses: [],
      checkedIconClasses: [],
      listClasses: this.settings.list.classList,
      selectedTextFormat: this.settings.button.selectedText.format,
      selectedTextVariable: this.settings.button.selectedText.variable,
      selectedText: this.settings.button.selectedText.text,
      noResultsText: this.settings.search.noResultsText,
      container: this.settings.base.popup.containerSelector,
      withSearch: this.settings.search.enabled,
      dropdownAlignRight: this.settings.base.popup.alignRight,
      popupWidth: this.settings.base.popup.width,
      withSelectAllButton: this.settings.selectAll.enabled,
      selectAllButtonClasses: this.settings.selectAll.classList,
      selectAllButtonGroupClasses: this.settings.selectAll.wrapperClassList,
      selectAllButtonText: this.settings.selectAll.selectText,
      deselectAllButtonText: this.settings.selectAll.deselectText
    })
  }

  resetAndReload () {
    this.logDebugMessage('form reset! reloading pick-me')
    this.reload()
  }

  onButtonKeyDown (e) {
    if (e.keyCode === 13) { // enter
      e.preventDefault()
      this.togglePopup(e)
    }
  }

  onMarkupKeyDown (e) {
    if (e.keyCode === 9 || e.keyCode === 27) { // tab || esc
      this.closePopupAndFocus()
    } else if (e.keyCode === 40) { // arrow down
      e.preventDefault()
      this.ui.focusNextEntry()
    } else if (e.keyCode === 38) { // arrow up
      e.preventDefault()
      this.ui.focusPreviousEntry()
    } else if (e.keyCode === 13) { // enter
      e.preventDefault()
      if (this.open) {
        const li = this.ui.getHovered()
        if (li) this.select({ currentTarget: li })
      } else {
        this.openPopup()
      }
    }
  }

  removeEvents () {
    document.removeEventListener('click', this.handlers.closePopupHandler)
    window.removeEventListener('resize', this.handlers.containerPositionHandler)
    window.removeEventListener('scroll', this.handlers.containerPositionHandler)
    if (this.label) this.label.removeEventListener('click', this.handlers.labelClickHandler)
    if (this.element.form) this.element.form.removeEventListener('reset', this.handlers.resetFormHandler)
  }

  togglePopup () {
    this.open ? this.closePopupAndFocus() : this.openPopup()
  }

  search () {
    if (this.searchInputTimer) clearTimeout(this.searchInputTimer)
    if (this.ui.hovered) this.ui.hovered.classList.remove('pm__results-list__item--hover')
    this.ui.hovered = false
    let inputValue = this.ui.searchInput.value
    if (this.shouldSearch(inputValue)) {
      this.previousSearchValue = inputValue
      const lowerInputValue = inputValue.toLowerCase()
      this.searchInputTimer = setTimeout(() => {
        let filteredValues = {}
        Object.entries(this.dropdownValues).forEach(([optGroupLabel, options]) => {
          Object.entries(options).forEach(([value, optionData]) => {
            if (optionData.text.toLowerCase().includes(lowerInputValue)) {
              if (!filteredValues[optGroupLabel]) filteredValues[optGroupLabel] = {}
              filteredValues[optGroupLabel][value] = optionData
            }
          })
        })
        this.ui.resultsWrapper.innerHTML = ''
        this.ui.appendEntries(filteredValues, Object.keys(this.selectedValues), this.selectedValuesOrder)
        this.addEventListenersForPage()
      }, this.settings.search.debounce)
    }
  }

  openPopup () {
    this.ui.popup.classList.add('pm__popup--visible')
    this.open = true
    this.ui.open = true
    this.ui.positionPopup()
    if (this.settings.search.enabled) this.ui.searchInput.focus()
  }

  closePopup (e) {
    let clickedButton = e && (e.target === this.ui.button || e.target.parentElement === this.ui.button)
    if (this.open && !clickedButton) {
      this.ui.popup.classList.remove('pm__popup--visible')
      this.open = false
      this.ui.open = false
      if (this.ui.hovered) this.ui.hovered.classList.remove('pm__results-list__item--hover')
      this.ui.hovered = false
      if (this.settings.search.enabled) this.resetSearch()
    }
  }

  closePopupAndFocus (e) {
    this.closePopup(e)
    this.ui.button.focus()
  }

  selectAllEntries () {
    const keysOfSelectedValues = Object.keys(this.selectedValues)
    this.selectedValues = Object.assign({}, ...Object.values(this.dropdownValues))
    Object.keys(this.selectedValues).forEach(value => {
      if (!keysOfSelectedValues.includes(value)) {
        this.ui.selectItem(value)
      }
    })
    this.ui.setButtonText(this.selectedValues)
    this.triggerChange()
  }

  deselectAllEntries () {
    Object.keys(this.selectedValues).forEach(value => {
      this.ui.deselectItem(value)
    })
    this.selectedValues = {}
    this.ui.setButtonText(this.selectedValues)
    this.triggerChange()
  }

  addEventListenersForPage () {
    Array.apply(null, this.ui.resultsWrapper.querySelectorAll('li.pm__results-list__item[data-value]:not(.pm__results-list__item--disabled)')).forEach(li => {
      li.addEventListener('click', this.handlers.selectHandler)
    })
  }

  shouldSearch (newValue) {
    return this.previousSearchValue !== newValue
  }

  select (e) {
    const li = e.currentTarget
    const value = li.getAttribute('data-value')
    const optionData = {
      text: li.getAttribute('data-text'),
      subtext: li.getAttribute('data-subtext'),
      disabled: li.getAttribute('data-disabled'),
      img: li.getAttribute('data-img') ? JSON.parse(li.getAttribute('data-img')) : null
    }

    if (this.settings.base.multiple) {
      this.toggleSelectedValue(value, optionData)
    } else {
      this.setSelectedValue(value, optionData)
    }

    this.ui.setButtonText(this.selectedValues)
    if (!this.settings.base.multiple) this.closePopupAndFocus()
    this.triggerChange()
  }

  triggerChange () {
    let event = new CustomEvent('Event', { detail: this.selectedValues })
    event.initEvent('change', true, true)
    this.element.dispatchEvent(event)
    this.logDebugMessage('changeTriggered')
  }

  toggleSelectedValue (value, optionData) {
    if (this.selectedValues[value]) {
      this.removeSelectedValue(value, optionData)
    } else {
      this.addSelectedValue(value, optionData)
    }
  }

  addSelectedValue (value, optionData) {
    this.selectedValues[value] = optionData

    this.ui.selectItem(value)
    if (this.settings.search.enabled) this.ui.searchInput.focus()
    this.logDebugMessage('Value added:', optionData)
  }


  removeSelectedValue (value, optionData) {
    delete this.selectedValues[value]
    this.ui.deselectItem(value)
    this.logDebugMessage('Value removed:', optionData)
  }

  setSelectedValue (value, optionData) {
    if (Object.keys(this.selectedValues).length > 0) {
      this.removeSelectedValue(Object.keys(this.selectedValues)[0])
      const selected = this.ui.getSelected()
      if (selected) selected.classList.remove('pm__results-list__item--selected')
    }
    this.addSelectedValue(value, optionData)
    this.logDebugMessage('Value set:', optionData)
  }

  logDebugMessage (msg, someObject) {
    if (!this.debug) return
    if (msg) console.log('PickMe#' + this.id, msg)
    if (someObject) console.log(someObject)
  }

  resetSearch () {
    this.ui.searchInput.value = ''
    this.search()
  }

  destroy () {
    this.removeEvents()
    this.ui.destroy()
    this.selectedValues = null
    this.dropdownValues = null
    delete this.ui
    this.element.classList.remove('visually-hidden')
  }

  reload () {
    Object.keys(this.selectedValues).forEach(value => {
      this.ui.deselectItem(value)
    })
    this.destroy()

    this.initialSelectedValues.forEach(value => {
      const option = this.element.querySelector('option[value="' + value.replaceAll('"', '\\"') + '"]')
      option.selected = true
    })

    this.initialize()
  }
}

/**
 * Helpers
 */

function onDomRemove (element, onDetachCallback) {
  const observer = new MutationObserver(function () {
    function isDetached (el) {
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
