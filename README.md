# is-equal-objects
[![Build Status](https://travis-ci.com/DigitalBrainJS/is-equal-objects.svg?branch=master)](https://travis-ci.com/DigitalBrainJS/is-equal-objects)
[![](https://badgen.net/bundlephobia/min/is-equal-objects)](https://unpkg.com/is-equal-objects/dist/is-equal-objects.umd.js)
[![](https://badgen.net/bundlephobia/minzip/is-equal-objects)](https://unpkg.com/is-equal-objects/dist/is-equal-objects.umd.js)
[![](https://badgen.net/npm/license/is-equal-objects)](https://unpkg.com/is-equal-objects/dist/is-equal-objects.umd.js)
[![](https://badgen.net/github/issues/DigitalBrainJS/is-equal-objects)](https://github.com/DigitalBrainJS/is-equal-objects/issues)
[![](https://badgen.net/github/stars/DigitalBrainJS/is-equal-objects)](https://github.com/DigitalBrainJS/is-equal-objects/stargazers)

Check whether objects are equal in deep. Useful for checking options objects. 

# Features
- Arrays and flat objects (built by Object and prototype by Object.prototype) will be deeply tested
- NaN === NaN
- Date, Regexp will be checked by reference or value, other complex objects will be simply compared by reference
- no dependencies
- CDN friendly

## Installation

Install for node.js or browserify using npm/yarn:

``` bash
$ npm install is-equal-objects --save
```

``` bash
$ yarn add is-equal-objects
```

````javascript 
import isEqualObjects from 'is-equal-objects/esm';
//OR
const isEqualObjects= require('is-equal-objects');   
````
## CDN
Use unpkg.com cdn to get the link to the script/module from the package:
- minified UMD ES5 version (~1kB)
```html
<script src="https://unpkg.com/is-equal-objects"></script>
<script>
    isEqualObjects({x:1}, {x:1})//true
</script>
```
- ESM ES2015 module(~2kB)
```javascript
import isEqualObjects from "https://unpkg.com/is-equal-objects/dist/is-equal-objects.esm.js"
//or minified version
import isEqualObjects from "https://unpkg.com/is-equal-objects/dist/is-equal-objects.esm.min.js"
```

## Usage examples
Basic usage:
````javascript
    isEqualObjects(1, 1); //true
    isEqualObjects({x:1}, {x:1}); //true
    isEqualObjects({x:1}, {x:1}, {x:1}); //true
    isEqualObjects([{x:1}], [{x:1}]); //true
    isEqualObjects([{x:[1]}], [{x:[1]}]); //true

    const complexObj= Object.create({});
    Object.assign(complexObj, {x:1});
    isEqualObjects({x:1}, complexObj); //false, complexObj is not a flat object, test by reference 

    isEqualObjects(new Date(1995, 11, 17), new Date(1995, 11, 17)); //true
    isEqualObjects(/\s+/, /\s+/); //true
````
## API

### isEqualObjects(...objects: any): Boolean

  - `...objects` objects to check
  
  **returns** false, if the objects are not deeply equal, true otherwise

## Contribution
 Feel free to fork, open issues, enhance or create pull requests. 
## License

The MIT License

Copyright (c) 2019 Dmitriy Mozgovoy <robotshara@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
