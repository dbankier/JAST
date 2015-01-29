# JAST Stack

JAST is a boilerplate with a  mash of tools for rapid Alloy development. Let's be opinionated then. The stack includes:

 * [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) -
   Appcelerator's own MVC Framework
 * [6to5](https://6to5.org/) - to give us some ES6 support.
 * [Jade](http://jade-lang.com/) - the [best](http://www.yydigital.com/blog/2013/7/10/A_Case_For_Jade_With_Alloy) template
   engine for alloy views
 * [STSS](https://github.com/RonaldTreur/STSS) - Sassy TSS, or Sassy Titanium Style Sheets.
 * [TiShadow](http://tishadow.yydigital.com/) - the fastest __Open Source__ toolset
   for titanium development.

And these libraries:
 * [nano](https://github.com/dbankier/nano) - for simple data-binding.
 * [XHR](https://github.com/raulriera/XHR) - a new XHR wrapper.

And these widgets:
 * [nl.fokkezb.loading](https://github.com/FokkeZB/nl.fokkezb.loading) - simple loading widget
 * yy.alert - yet another alert widget.



~~See the following (outdated) [demo](http://www.youtube.com/watch?v=c1u92zT-oA4) - it uses LTSS instead of STSS but you'll get the idea.~~

If you would like coffee with that see [grunt-titanium-tishadow](https://github.com/xissy/grunt-titanium-tishadow).

# Prerequisites

 * Do this:
```
 [sudo] npm install alloy tishadow grunt-cli
``` 
 * [Get started](http://tishadow.yydigital.com/getting%20started) with TiShadow

# Let's Go

## Manually

 * Clone the repository
 * Install the dependencies: `npm install -d` 

## Use the [Yeoman](http://yeoman.io) generator: [generator-alloy](https://github.com/dbankier/generator-alloy)

** NEEDS UPDATING **
``` 
 npm install -g yo generator-alloy
 mkdir /path/to/new/app && cd $_
 yo alloy 
```

# Structure

Use the `src` directory for the `controller`, `styles` and `view`.
`widgets`, `assests` and `lib` are still in the `app` directory.

# Commands

 * `grunt` - compiles the jade, stss and es6 files
 * `grunt [dev_android|dev_ios]` - auto compile and pushes with TiShadow
 * `grunt [test_android|test_ios]` - run specs 
 * `grunt clean` - deletes all generated files
 * `grunt [iphone6|iphone7|ipad6|ipad7|appstore|adhoc|playstore]` - commands inspired by the work
    of @FokkeZB on [TiNy](https://github.com/FokkeZB/tn). Project specific settings are configured at
    the top of the `Gruntfile.js`.

You probably want to using these commands after you run grunt the first time.

~~~
ts server
ti build -p ios --appify
~~~



License: MIT
