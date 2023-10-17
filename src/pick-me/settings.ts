import i18n from './i18n/i18n'

type I18n = {
    search: {
        input: {
            placeholderText: string
        },
        noResultsText: string
    },
    button: {
        placeholderText: string,
        selectedText: {
            text: string
        }
    },
}

export type Settings = {
    id: string
    base?: BaseSettings
    language?: LanguageSettings
    search?: SearchSettings
    button?: ButtonSettings
    list?: ListSettings
}

type BaseSettings = {
    multiple?: boolean
    debug?: boolean
    popup?: {
        containerSelector?: string
        alignRight?: boolean
        width?: string
    }
}

type LanguageSettings = {
    locale?: string
    i18n?: I18n
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
    disabledClassList?: string[]
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
    }

    setBase (props: BaseSettings) {
        this.base = {}
        this.base.multiple = !!this.element.multiple || !!props?.multiple
        this.base.debug = props.debug

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
        this.search.input.placeholderText = props?.input?.placeholderText || this.language.i18n?.search?.input?.placeholderText || 'Search'
        this.search.input.classList = props?.input?.classList || []
        this.search.noResultsText = props?.noResultsText || this.language.i18n?.search?.noResultsText || 'No results'
    }

    setButton (props: ButtonSettings) {
        this.button = {}
        this.button.placeholderText = props?.placeholderText || this.language.i18n?.button?.placeholderText || 'Select'
        this.button.classList = props?.classList || []
        this.button.disabledClassList = props?.disabledClassList || []
        this.button.iconHtml = props?.iconHtml || '⯆'

        this.button.selectedText = {}
        this.button.selectedText.format = props?.selectedText?.format
        this.button.selectedText.variable = props?.selectedText?.variable || '%num%'
        this.button.selectedText.text = props?.selectedText?.text || this.language.i18n?.button?.selectedText?.text || `%num% selected`
    }

    setList (props: ListSettings) {
        this.list = {}

        this.list.checkedIconHtml = props?.checkedIconHtml || '✓'
        this.list.classList = props?.classList || []
    }
}