# PickMe

PickMe is customizable html select picker written in pure javascript. 

## Development

1. `make build`
2. `make dev`
3. <http://localhost:8000>


1. [Usage](#markdown-header-usage)
    * [Native without JQuery](#markdown-header-native-without-jquery)
    * [Initialization with rails](#markdown-header-initialization-with-rails)
    * [Backend Endpoint](#markdown-header-backend-endpoint)
2. [API](#markdown-header-api)
3. [Development](#markdown-header-development)
4. [Production](#markdown-header-building-for-production)
5. [TODO](#markdown-header-todo)

## Usage

HTML
```html
<select name="picker" id="picker-single">
    <option value>Please select</option>
    <option value="1" selected>Abbey Storrs</option>
</select>
```

JS
```javascript
// these are the default options. you can omit everything except 'id' and 'url'
new PickMe({
    id: 'picker-single',
    language: document.documentElement.lang, // currently: 'de' or 'en'
    searchPlaceholder: 'Search',
    searchInputClasses: [],
    buttonClasses: [],
    emptySelectButtonText: 'Show all',
    buttonIconClasses: ['fas', 'fa-fw', 'fa-caret-down'],
    checkedIconClasses: ['fas', 'fa-fw', 'fa-check'],
    listClasses: [],
    selectedTextFormat: null, // 'count > 5'
    selectedTextVariable: '%num%', // '%x%'
    selectedText: '%num% selected', // '%x% Einträge ausgewählt'
    noResultsText: 'No results',
    container: null,
    dropdownAlignRight: false,
    popupWidth: '300px',
    values: null
})
```

### Initialization with rails

#### Without preselected entry

You can use a normal `options_for_select` for initialization. Because PickMe works on the options from the select. Example:

Example select that PickMe can be used on:

```erb
<%= f.select :user_id,
             options_for_select(User.pluck(:full_name_reverse, :id)),
             {include_blank: t('views.defaults.form.select.choose_user')}, 
             {class: 'selectpicker form-control', data: {live_search: true, selected_text_format: 'count>3'}} %>
```

#### With preselected entries

If you have preselected entries in your select then you need to add these to the select. Example:

```erb
<%= f.select :user_id,
             options_for_select(User.pluck(:full_name_reverse, :id), task.user_id),
             {include_blank: t('views.defaults.form.select.choose_user')}, 
             {class: 'selectpicker form-control', data: {live_search: true, selected_text_format: 'count>3'}} %>
```

## API

PickMe registers a global `window.PickMe` object that lets you access each initialized select. You can get each instance by using its id: 

```javascript
window.PickMe.elements // or just PickMe.elements
// => {'picker-single': PickMe}

window.PickMe.elements['picker-single']
// => PickMe {..}
```

Working on this object you can use any method and read any property that PickMe uses, but the only useful methods to call externally are the following:

| method  | example                                 | description                                                                                                             |
|---------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `destroy` | `PickMe.elements['picker'].destroy()` | Destroys the added dom elements and event handlers. Resets the select to it's state before pick-me was initialized. |
| `reload`  | `PickMe.elements['picker'].reload()`  | Same as destroy, but re-initializes the element automatically.                                                        |
 

Call a method directly:

```javascript
window.PickMe.elements['picker-single'].reload()
```

## Development

Install dependencies and start the server:

```bash
# install dependencies
yarn

# run development server
yarn dev
```

Then open [http://localhost:8000](http://localhost:8000). 

Alternatively you can use the dev version directly in tbs by symlinking the current build:

```bash
cd pick-me

# remove existing lib in tbs
rm -rf path/to/tbs/node_modules/pick-me

# symlink built version
ln -sf $(pwd) path/to/tbs/node_modules/

# build after every change
yarn build
```

## Publishing a new version

1. Make your changes and create a new build with `yarn build`
2. Update the `version` in `package.json`
3. Commit
4. Push master
5. Create new tag on master `git tag -a v0.x.x`
6. Push tag `git push --tags`
7. Go to tbs and update pick-me version in `package.json`
8. Run `yarn` 
