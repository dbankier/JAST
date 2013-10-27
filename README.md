# JALT Stack

JALT is a boilerplate with a  mash of tools for rapid Alloy development. Let's be opinionated then. The stack includes:

 * [Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) -
   Appcelerator's own MVC Framework
 * [Jade](http://jade-lang.com/) - the [best](http://www.yydigital.com/blog/2013/7/10/A_Case_For_Jade_With_Alloy) template
   engine for alloy views
 * [ltss](https://github.com/dbankier/ltss) - the _only_ alloy tss pre-compiler.
 * [TiShadow](http://tishadow.yydigital.com/) - the fastest __Open Source__ toolset
   for titanium development.

# Prerequisites

 * Do this:
```
 [sudo] npm install alloy tishadow grunt-cli
``` 
 * [Get started](http://tishadow.yydigital.com/getting%20started) with TiShadow

# Let's Go

 * Clone the repository
 * Install the dependencies: `npm install -d` 

# Commands

 * `grunt` - compiles the jade and ltss files
 * `grunt [dev_android|dev_ios]` - auto compile and pushes with TiShadow
 * `grunt [test_android|test_ios]` - run specs 
 * `grunt clean` - deletes all generated files

License: MIT
