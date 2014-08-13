mimosa-stylus
===========

## Overview

This is a Stylus compiler for the Mimosa build tool. This module is for use with Mimosa `2.0+`.  This replicates the functionality of the Stylus compiler that was built into Mimosa before `2.0`.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'stylus'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile Stylus files during `mimosa watch` and `mimosa build` and includes compilation with [nib](http://visionmedia.github.com/nib/).

Mimosa core does a little bit of extra work with Stylus. Mimosa takes care not to compile files that do not need it. If Stylus gets included back through a single base Stylus file, changing a file deep down the tree of includes will only trigger a compile of that single base file and not the changed file. Similarly if there are multiple base files, changing a file included in two places will trigger the recompile of those two files.

## Default Config

```coffeescript
stylus:
  lib: undefined
  extensions: ["styl"]
  use:['nib']
  import:['nib']
  define:{}
  includes:[]
```

* `lib`: You may want to use this module but may not be ready to use the latest version of Stylus. Using the `lib` property you can provide a specific version of Stylus if the one being used by this module isn't to your liking. To provide a specific version, you must have it `npm install`ed into your project and then provide it to `lib`. For instance: `lib: require('stylus')`.
* `extensions`: an array of strings, the extensions of your CoffeeScript files.
* `use`: an array of strings, a means for plugins to be included in Stylus compilation.
* `import`: an array of strings, import resources at compile time rather than in your stylesheet.
* `define`:  an object, define variables programmtically instead of in your stylesheet.
* `includes`: an array of paths to include for all compile

See the [Stylus docs](http://learnboost.github.io/stylus/docs/js.html) for more information on the options (`use`, `import`, `define`, `includes`) for passing information to the Stylus compiler.