# JALT Stack

JALT is a boilerplate with a  mash of tools for rapid Alloy development. Let's be opinionated then. The stack includes:

 * [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) -
   Appcelerator's own MVC Framework
 * [Jade](http://jade-lang.com/) - the [best](http://www.yydigital.com/blog/2013/7/10/A_Case_For_Jade_With_Alloy) template
   engine for alloy views
 * [ltss](https://github.com/dbankier/ltss) - the _only_ alloy tss pre-compiler.
 * [TiShadow](http://tishadow.yydigital.com/) - the fastest __Open Source__ toolset
   for titanium development.

See the following (outdated) [demo](http://www.youtube.com/watch?v=c1u92zT-oA4).

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

## Use the [Yeoman](http://yeoman.io) generator: [generator-jalt](https://github.com/dbankier/generator-jalt)

``` 
 npm install -g yo generator-jalt
 mkdir /path/to/new/app && cd $_
 yo jalt
```

# Commands

 * `grunt` - compiles the jade and ltss files
 * `grunt [dev_android|dev_ios]` - auto compile and pushes with TiShadow
 * `grunt [test_android|test_ios]` - run specs 
 * `grunt clean` - deletes all generated files

License: MIT
