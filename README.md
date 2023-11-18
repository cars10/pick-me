# PickMe

PickMe is customizable html select picker written in pure javascript. 

1. [Usage](#markdown-header-usage)
    * [Native without JQuery](#markdown-header-native-without-jquery)
    * [Initialization with rails](#markdown-header-initialization-with-rails)
    * [Backend Endpoint](#markdown-header-backend-endpoint)
2. [API](#markdown-header-api)
3. [Development](#markdown-header-development)
4. [Production](#markdown-header-building-for-production)
5. [TODO](#markdown-header-todo)

## Development

1. `make build`
2. `make dev`
3. <http://localhost:8000>

## Usage

HTML
```html
<select name="picker" id="picker">
    <option value>Please select</option>
    <option value="1" selected>Abbey Storrs</option>
</select>
```

JS
```javascript
new PickMe({id: 'picker'})
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
