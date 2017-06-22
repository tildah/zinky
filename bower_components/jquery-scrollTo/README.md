# [jQuery scrollTo](https://github.com/amazingSurge/jquery-scrollTo) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that click on the button to jump to the specified location.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-scrollTo.js
├── jquery-scrollTo.es.js
├── jquery-scrollTo.min.js
└── css/
    ├── scrollTo.css
    └── scrollTo.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-scrollTo/master/dist/jquery-scrollTo.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-scrollTo/master/dist/jquery-scrollTo.min.js) - minified

#### Install From Bower
```sh
bower install jquery-scrollTo --save
```

#### Install From Npm
```sh
npm install jquery-scrollTo --save
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-scrollTo.git
cd jquery-scrollTo
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-scrollTo` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/scrollTo.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-scrollTo.js"></script>
```

#### Required HTML structure

```html
<div class="nav">
  <li data-scrollto="hello">#hello</li>
  <li data-scrollto="world">#world</li>
</div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $(".nav").scrollTo();
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-scrollTo/tree/master/examples).

## Options
`jquery-scrollTo` can accept an options object to alter the way it behaves. You can see the default options by call `$.scrollTo.setDefaults()`. The structure of an options object is as follows:

```
{
  speed: '1000',
  easing: 'linear',
  namespace: 'scrollTo',
  offsetTop: 50,
  mobile: {
    width: 768,
    speed: '500',
    easing: 'linear',
  }
}
```

## Methods
Methods are called on scrollTo instances through the scrollTo method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().scrollTo('jump');

// or
var api = $().data('scrollTo');
api.jump();
```

#### jump()
Jump to the target
```javascript
$().scrollTo('jump');
```

#### destroy()
Destroy the scrollbar instance.
```javascript
$().scrollTo('destroy');
```

## Events
`jquery-scrollTo` provides custom events for the plugin’s unique actions. 

```javascript
$(document).on('scrollTo::jump', function (e) {
  // on instance ready
});

```

Event         | Description
------------- | -----------
scrollTo::jump| Fires when the `jump` instance method has been called.

## No conflict
If you have to use other plugin with the same namespace, just call the `$.scrollTo.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-scrollTo.js"></script>
<script>
  $.scrollTo.noConflict();
  // Code that uses other plugin's "$().scrollTo" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-scrollTo` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-scrollTo` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-scrollTo/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-scrollTo.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-scrollTo/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-scrollTo.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-scrollTo
[license]: https://img.shields.io/npm/l/jquery-scrollTo.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-scrollTo.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-scrollTo
