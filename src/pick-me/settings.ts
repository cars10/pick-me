import i18n from './i18n/i18n'

type Settings = {
  id: string
  base?: BaseSettings
  language?: LanguageSettings
  search?: SearchSettings
  button?: ButtonSettings
  list?: ListSettings
  selectAll?: SelectAllSettings
}

type BaseSettings = {
  multiple?: boolean
  popup?: {
    containerSelector?: string
    alignRight?: boolean
    width?: string
  }
}

type LanguageSettings = {
  locale?: string
  i18n?: Record<string, string>
}

type SearchSettings = {
  enabled?: boolean
  debounce?: number
  input?: {
    placeholderText?: string
    classList?: string[]
  }
  noResultsText?: string
}

type ButtonSettings = {
  placeholderText?: string
  classList?: string[]
  iconHtml?: string
  selectedText?: {
    format?: string
    variable?: string
    text?: string
  }
}

type ListSettings = {
  checkedIconHtml?: string,
  classList?: string[]
}

type SelectAllSettings = {
  enabled?: boolean
  classList?: string[]
  wrapperClassList?: string[]
  selectText?: string
  deselectText?: string
}

export default class PickMeSettings {
  element: HTMLSelectElement
  base?: BaseSettings
  language: LanguageSettings
  search: SearchSettings
  button: ButtonSettings
  list: ListSettings
  selectAll: SelectAllSettings

  constructor (props: Settings) {
    this.element = document.getElementById(props.id) as HTMLSelectElement
    this.setBase(props.base)
    this.setLanguage(props.language)
    this.setSearch(props.search)
    this.setButton(props.button)
    this.setList(props.list)
    this.setSelectAll(props.selectAll)
  }

  setBase (props: BaseSettings) {
    this.base = {}
    this.base.multiple = !!this.element.multiple || !!props?.multiple

    this.base.popup = {}
    this.base.popup.containerSelector = props?.popup?.containerSelector
    this.base.popup.alignRight = props?.popup?.alignRight
    this.base.popup.width = props?.popup?.width || '300px'
  }

  setLanguage (props: LanguageSettings) {
    this.language = {}
    this.language.locale = props?.locale || document.documentElement.lang || 'en'
    this.language.i18n = props?.i18n || i18n[props?.locale] || i18n.en
  }

  setSearch (props: SearchSettings) {
    this.search = {}

    this.search.enabled = !!props?.enabled
    this.search.debounce = props?.debounce || 50
    this.search.input = {}
    this.search.input.placeholderText = props?.input?.placeholderText || this.language.i18n?.searchPlaceholder || 'Search'
    this.search.input.classList = props?.input?.classList || []
    this.search.noResultsText = props?.noResultsText || this.language.i18n.noResultsText || 'No results'
  }

  setButton (props: ButtonSettings) {
    this.button = {}
    this.button.placeholderText = props?.placeholderText || this.language.i18n?.emptySelectButtonText || 'Select'
    this.button.classList = props?.classList || []
    this.button.iconHtml = props?.iconHtml || '⯆'

    this.button.selectedText = {}
    this.button.selectedText.format = props?.selectedText?.format
    this.button.selectedText.variable = props?.selectedText?.variable || '%num%'
    this.button.selectedText.text = props?.selectedText?.text || this.language.i18n?.selectedText || `%num% selected`
  }

  setList (props: ListSettings) {
    this.list = {}

    this.list.checkedIconHtml = props?.checkedIconHtml || '✓'
    this.list.classList = props?.classList || []
  }

  setSelectAll (props: SelectAllSettings) {
    this.selectAll = {}
    this.selectAll.enabled = !!props?.enabled
    this.selectAll.classList = props?.classList || []
    this.selectAll.wrapperClassList = props?.wrapperClassList || []
    this.selectAll.selectText = props?.selectText || this.language.i18n?.selectAllButtonText || 'Select all'
    this.selectAll.deselectText = props?.deselectText || this.language.i18n?.deselectAllButtonText || 'Deselect all'
  }
}