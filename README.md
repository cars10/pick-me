# SyncPick

SyncPick is a synchronous replacement for `bootstrap-select`. It tries to offer the best of both worlds - you can immediately scroll without searching and you can search your remote api.

1. [Usage](#markdown-header-usage)
    * [Native without JQuery](#markdown-header-native-without-jquery)
    * [Initialization with rails](#markdown-header-initialization-with-rails)
    * [Backend Endpoint](#markdown-header-backend-endpoint)
2. [API](#markdown-header-api)
3. [Development](#markdown-header-development)
4. [Production](#markdown-header-building-for-production)
5. [TODO](#markdown-header-todo)

## Usage

### Native without JQuery

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
new SyncPick({
    id: 'picker-single',
    url: 'http://192.168.178.192:9000/users',
    language: document.documentElement.lang, // currently: 'de' or 'en'
    searchParam: 'q',
    pageParam: '_page',
    perPageParam: '_limit',
    valueProp: 'id',
    textProp: 'name',
    subtextProp: 'subtext',
    disabledProp: 'disabled',
    jsonKey: null,
    httpMethod: 'GET',
    maxPages: 2,
    perPage: 50,
    paginateUpThreshold: 20,
    paginateDownThreshold: 80,
    searchTimeout: 50,
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
    dividerText: 'Selected entries:',
    resetOnClose: true,
    container: null,
    dropdownAlignRight: false,
    popupWidth: '300px',
    values: null
})
```

### Initialization with rails

#### Without preselected entry

You have to change the way you initialize `options_for_select`. Because SyncPick loads the data via ajax anyway you do not have to add any options to your select beforehand. Example:

Before SyncPick: (note that all users are added to `options_for_select`)

```erb
<%= f.select :user_id,
             options_for_select(User.pluck(:full_name_reverse, :id)),
             {include_blank: t('views.defaults.form.select.choose_user')}, 
             {class: 'selectpicker form-control', data: {live_search: true, selected_text_format: 'count>3'}} %>
```

With SyncPick you can completely omit `options_for_select` and replace it with an empty string, because all it does is build an empty string anyway.

```erb
<%= f.select :user_id, '', {include_blank: t('views.defaults.form.select.choose_user')}, {class: 'form-control'} %>
```

#### With preselected entries

If you have preselected entries in your select then you need to add these to the select. Example:

Before SyncPick:

```erb
<%= f.select :user_id,
             options_for_select(User.pluck(:full_name_reverse, :id), task.user_id),
             {include_blank: t('views.defaults.form.select.choose_user')}, 
             {class: 'selectpicker form-control', data: {live_search: true, selected_text_format: 'count>3'}} %>
```

With SyncPick: (note that only the selected option is included as option)

```erb
<%= f.select :user_id, options_for_select([[task.user&.full_name_reverse, task.user_id]], task.user_id),
             {include_blank: t('views.defaults.form.select.choose_user')}, class: 'form-control' %>
```

And if you are not sure if the selected option is there (for forms that are used on new and edit for example):

```erb
<%= f.select :user_id, options_for_select([[task.user&.full_name_reverse, task.user_id].compact].reject(&:blank?), task.user_id),
             {include_blank: t('views.defaults.form.select.choose_user')}, class: 'form-control' %>
```

### Backend endpoint

#### Response structure

The above default settings (`valueProp`, `textProp`, `subtextProp`, `disabledProp` and `jsonKey`) expect an endpoint that responds with something like this:

```json
{
  "users": [
    {"name": "Peter", "value": "1", "subtext": "#some-id-1", "disabled": false},
    {"name": "Dirk", "value": "2", "subtext": "#some-id-2", "disabled": true}
  ] 
}
```

#### Query parameters

For loading data from your endpoint the requests are built by default (`searchParam`, `pageParam`, `perPageParam`) like this:

`your.url.with.protocol?q=some+query&_page=1&_limit=50`

## API

SyncPick registers a global `window.SyncPick` object that lets you access each initialized select. You can get each instance by using its id: 

```javascript
window.SyncPick.elements // or just SyncPick.elements
// => {'picker-single': SyncPick}

window.SyncPick.elements['picker-single']
// => SyncPick {..}
```

Working on this object you can use any method and read any property that SyncPick uses, but the only useful methods to call externally are the following:

| method  | example                                 | description                                                                                                             |
|---------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `destroy` | `SyncPick.elements['picker'].destroy()` | Destroys the added dom elements and event handlers. Resets the select to it's state before sync-pick was initialized. |
| `reload`  | `SyncPick.elements['picker'].reload()`  | Same as destroy, but re-initializes the element automatically.                                                        |
 

Call a method directly:

```javascript
window.SyncPick.elements['picker-single'].reload()
```

## Development

Install dependencies and start the server:

```bash
# install dependencies
yarn

# run mock api
yarn mock

# run development server
yarn serve
```

Then open [http://localhost:8080](http://localhost:8080). 

Alternatively you can use the develop version directly in tbs by symlinking the current build:

```bash
cd sync-pick

# remove existing lib in tbs
rm -rf path/to/tbs/node_modules/sync-pick

# symlink built version
ln -sf $(pwd) path/to/tbs/node_modules/

# then run webpack with --watch do automatically compile
EXTRACT_CSS=true npx webpack --watch
```

## Publishing a new version

1. Commit your changes on develop
2. Update the `version` in `package.json` and commit new version
3. Run `yarn build` and commit the `dist` folder
4. Push develop
5. Merge develop into master
6. Push master
7. Create new tag on master `git tag -a v0.x.x`
8. Push tag `git push --tags`
9. Go to tbs and update sync-pick version in `package.json`
10. Run `yarn` 
