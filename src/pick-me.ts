import PickMeUi from './pick-me/ui'
import PickMeSettings, { Settings } from './pick-me/settings'

export type OptionData = {
  text: string
  subtext: string
  img: string
  searchData: string
}

export type Options = {
  all: OptionMap
  selected: OptionMap
  optgroups: OptgroupMap
}
export type OptionMap = Map<string, OptionData>
export type OptgroupMap = Map<string, string[]>

export default class PickMe {
  id: string
  element: HTMLSelectElement
  label: HTMLLabelElement
  settings: PickMeSettings
  initialSelectedValues: string[]
  open: boolean
  handlers: Record<string, (e?: Event) => void>
  ui: PickMeUi
  options: Options
  searchInputTimer: number

  constructor (options: Settings) {
    this.id = options.id
    this.element = document.getElementById(this.id) as HTMLSelectElement
    this.label = document.querySelector('label[for="' + this.id + '"]')

    this.settings = new PickMeSettings(options)
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

    this.ui.renderEntries(this.options.all, this.options.selected, this.options.optgroups)
    this.addEventListenersForPage()

    this.ui.setButtonText(this.options.selected)
  }

  setupInitialValues () {
    const options = this.element.querySelectorAll('option[selected]') as NodeListOf<HTMLOptionElement>
    options.forEach(option => (this.initialSelectedValues.push(option.value)))
  }

  addHandlers () {
    this.handlers.closePopupHandler = (e: Event) => (this.closePopup(e))
    this.handlers.selectHandler = (e: Event) => (this.select(e))
    this.handlers.containerPositionHandler = () => (this.ui.positionPopup())
    this.handlers.resetFormHandler = () => (this.resetAndReload())
    this.handlers.labelClickHandler = (e: Event) => {
      e.preventDefault()
      this.ui.button.focus()
    }
  }

  addEvents () {
    this.ui.button.addEventListener('click', () => (this.togglePopup()))
    this.ui.popup.addEventListener('click', e => (e.stopPropagation()))
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
    this.options = {
      all: new Map(), // Map<value, optionData>
      selected: new Map(), // Map<value, optionData>
      optgroups: new Map() // Map<label, value[]>
    }
    Array(...this.element.options).forEach(option => {
      const parentNode = option.parentNode as HTMLOptGroupElement
      const optgroupLabel = parentNode.nodeName === 'OPTGROUP' ? parentNode.label : ''

      if (!this.options.optgroups.has(optgroupLabel)) this.options.optgroups.set(optgroupLabel, [])

      const optionData = {
        text: option.innerHTML,
        subtext: option.getAttribute('data-subtext'),
        img: JSON.parse(option.getAttribute('data-img')),
        searchData: option.innerText.toLowerCase().trim()
      }
      this.options.all.set(option.value, optionData)
      this.options.optgroups.get(optgroupLabel).push(option.value)

      if (option.selected || option.hasAttribute('selected')) {
        this.options.selected.set(option.value, optionData)
        option.setAttribute('data-selected', 'true')
      }
    })
  }

  buildMarkup () {
    return new PickMeUi({ element: this.element, settings: this.settings })
  }

  resetAndReload () {
    this.logDebugMessage('form reset! reloading pick-me')
    this.reload()
  }

  onButtonKeyDown (e: KeyboardEvent) {
    if (e.keyCode === 13) { // enter
      e.preventDefault()
      this.togglePopup(e)
    }
  }

  onMarkupKeyDown (e: KeyboardEvent) {
    if (e.keyCode === 9 || e.keyCode === 27) { // tab || esc
      this.closePopupAndFocus(e)
    } else if (e.keyCode === 40) { // arrow down
      e.preventDefault()
      this.ui.focusNextEntry()
    } else if (e.keyCode === 38) { // arrow up
      e.preventDefault()
      this.ui.focusPreviousEntry()
    } else if (e.keyCode === 13) { // enter
      e.preventDefault()
      if (this.open) {
        const li = this.ui.hovered
        if (li) this.select({ currentTarget: li } as unknown as Event)
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

  togglePopup (e?: Event) {
    this.open ? this.closePopupAndFocus(e) : this.openPopup()
  }

  search () {
    if (this.searchInputTimer) clearTimeout(this.searchInputTimer)
    if (this.ui.hovered) this.ui.hovered.classList.remove('pm__results-list__item--hover')
    this.ui.hovered = null

    this.searchInputTimer = setTimeout(() => {
      this.doSearch()
    }, this.settings.search.debounce)
  }

  doSearch () {
    const inputValue = this.ui.searchInput.value
    const lowerInputValue = inputValue.toLowerCase()

    const filteredValues = new Map()
    for (const [optGroupLabel, values] of this.options.optgroups) {
      for (const value of values) {
        const optionData = this.options.all.get(value)
        if (optionData.searchData.includes(lowerInputValue)) {
          if (!filteredValues.get(optGroupLabel)) filteredValues.set(optGroupLabel, [])
          filteredValues.get(optGroupLabel).push(value)
        }
      }
    }

    this.ui.resultsWrapper.innerHTML = ''
    this.ui.renderEntries(this.options.all, this.options.selected, filteredValues)
    this.addEventListenersForPage()
  }

  openPopup () {
    this.ui.popup.classList.add('pm__popup--visible')
    this.open = true
    this.ui.positionPopup()
    if (this.settings.search.enabled) this.ui.searchInput.focus()
  }

  closePopup (e?: Event) {
    const target = e?.target as HTMLButtonElement
    const clickedButton = e && (target === this.ui.button || target?.parentElement === this.ui.button)
    if (this.open && !clickedButton) {
      this.ui.popup.classList.remove('pm__popup--visible')
      this.open = false
      if (this.ui.hovered) this.ui.hovered.classList.remove('pm__results-list__item--hover')
      this.ui.hovered = null
      if (this.settings.search.enabled) this.resetSearch()
    }
  }

  closePopupAndFocus (e: Event) {
    this.closePopup(e)
    this.ui.button.focus()
  }

  addEventListenersForPage () {
    Array(...this.ui.resultsWrapper.querySelectorAll('li.pm__results-list__item[data-value]:not(.pm__results-list__item--disabled)')).forEach(li => {
      li.addEventListener('click', this.handlers.selectHandler)
    })
  }

  select (e: Event) {
    const li = e.currentTarget as HTMLLIElement
    const value = li.getAttribute('data-value')
    const optionData = this.options.all.get(value)

    if (this.settings.base.multiple) {
      this.toggleSelectedValue(value, optionData)
    } else {
      this.setSelectedValue(value, optionData)
    }

    this.ui.setButtonText(this.options.selected)
    if (!this.settings.base.multiple) this.closePopupAndFocus(e)
    this.triggerChange()
  }

  triggerChange () {
    this.element.dispatchEvent(new CustomEvent('change', { detail: this.options.selected }))
  }

  toggleSelectedValue (value: string, optionData: OptionData) {
    if (this.options.selected.get(value)) {
      this.removeSelectedValue(value)
    } else {
      this.addSelectedValue(value, optionData)
    }
  }

  addSelectedValue (value: string, optionData: OptionData) {
    this.options.selected.set(value, optionData)

    this.ui.selectItem(value)
    if (this.settings.search.enabled) this.ui.searchInput.focus()
  }

  removeSelectedValue (value: string) {
    this.options.selected.delete(value)
    this.ui.deselectItem(value)
  }

  setSelectedValue (value: string, optionData: OptionData) {
    if (this.options.selected.size > 0) {
      this.removeSelectedValue(this.options.selected.entries().next().value[0])
      const selected = this.ui.getSelected()
      if (selected) selected.classList.remove('pm__results-list__item--selected')
    }
    this.addSelectedValue(value, optionData)
  }

  logDebugMessage (msg: string, someObject?: object) {
    if (!this.settings.base.debug) return
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
    this.options = null
    delete this.ui
    this.element.classList.remove('pm__hidden')
  }

  reload () {
    for (const value of this.options.selected.keys()) {
      this.ui.deselectItem(value)
    }
    this.destroy()

    this.initialSelectedValues.forEach(value => {
      const option = this.element.querySelector('option[value="' + value.replaceAll('"', '\\"') + '"]') as HTMLOptionElement
      option.selected = true
    })

    this.initialize()
  }
}

/**
 * Helpers
 */

function onDomRemove (element: HTMLElement, onDetachCallback: () => void) {
  const observer = new MutationObserver(function () {
    function isDetached (el: ParentNode) {
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
