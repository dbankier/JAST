module.exports = function(grunt) {
  grunt.initConfig({

    // if true, it will use selective alloy compilation
    boost: false,

    // Project Specific Definitions
    ios_family: "universal",
    ios_adhoc_name: "David Bankier",
    ios_adhoc_profile: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    ios_appstore_name:"YY Digital PTY LTD",
    ios_appstore_profile:"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    android_keystore: "./android.keystore",
    android_keypass: "changeit",

    // Task Configuration
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          src: ['**/*.jade','!**/includes/**','!**/templates/**'],
          dest: 'app',
          cwd: 'src',
          ext: '.xml'
        }]
      }
    },
    stss: {
      compile: {
        files: [{
          expand: true,
          src: ['**/*.stss','!**/_*.stss'],
          dest: 'app',
          cwd: 'src',
          ext: '.tss'
        }],
      }
    },
    "6to5" : {
      options: {
        sourceMap: false
      },
      dist: {
        files: [{
          expand: true,
          src: ['**/*.js'],
          dest: 'app',
          cwd: 'src',
          ext: '.js'
        }]
      }
    },
    tishadow: {
      options: {
        update: true,
      },
      run: {
        command: 'run',
        options: grunt.option("p") ? {
          platform: grunt.option("p")
        }: {}
      },
      spec: {
        options: {
          update: false,
        },
        command: 'spec',
        options: grunt.option("p") ? {
          platform: grunt.option("p")
        }:{}
      },
      clear: {
        command: 'clear',
        options: {
        }
      }
    },
    // titanium-cli commands in absence of a plugin
    shell: { 
      options: {
        stdout: true,
        stderr: true
      },
      iphone6: {
        command: "titanium build -p ios -S 6.1 -Y iphone" 
      },
      iphone7: {
        command: "titanium build -p ios -S 7.1 -Y iphone" 
      },
      ipad6: {
        command: "titanium build -p ios -S 6.1 -Y ipad" 
      },
      ipad7: {
        command: "titanium build -p ios -S 7.1 -Y ipad" 
      },
      adhoc: {
        command: 'ti build -p ios -F <%= ios_family %> -T dist-adhoc -R "<%= ios_adhoc_name %>" -P" <%= ios_adhoc_profile %>"  -O ~/Desktop ' 
      },
      appstore: {
        command: 'ti build -p ios -F <%= ios_family %> -T dist-appstore -R "<%= ios_appstore_name %>" -P" <%= ios_apptore_profile %>"  -O ~/Desktop ' 
      },
      playstore: {
        command: 'ti build -T dist-playstore -O ~/Desktop -p android -K <%= android_keystore %> - P <%= android_keypass %>' 
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      views: {
        files: ['src/**/*.jade'],
        tasks: ['jade','tishadow:run']
      },
      styles: {
        files: ['src/**/*.stss'],
        tasks: ['stss','tishadow:run']
      },
      javascripts: {
        files: ['src/**/*.js'],
        tasks: ['6to5','tishadow:run']
      },
      assets: {
        files: ['src/**', '!src/**/*.jade', '!src/**/*.stss', '!src/**/*.js'],
        tasks: ['copy:alloy','tishadow:run']
      },
      locale: {
        files: ['i18n/**'],
        tasks: ['tishadow:run']
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      watch: {
        tasks: ['watch:views','watch:styles', 'watch:javascripts', 'watch:assets', 'watch:locale']
      }
    },
    copy: {
      alloy: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/',
          dest: 'app/',
          src: [
            '**',
            '!**/*.jade',
            '!**/*.stss'
          ]
        }
        ]
      }
    },
    clean: {
      project: {
        src: ['app/', 'Resources/', 'build/']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['copy:alloy', 'jade','stss', '6to5']);
  grunt.registerTask('dev', ['build','tishadow:run','concurrent:watch']);
  grunt.registerTask('test', ['tishadow:clear','build','tishadow:spec']);
  //titanium cli tasks
  ['iphone6','iphone7','ipad6','ipad7','appstore','adhoc','playstore'].forEach(function(target) {
    grunt.registerTask(target, ['build','shell:'+target]);
  });

  //only modify changed file
  grunt.event.on('watch', function(action, filepath) {
    var o = {};
    if (filepath.match(/.js/)) {
      var target = filepath.replace("src/", "app/");
      o[target] = [filepath];
      grunt.config.set(['6to5', 'dist', 'files'],o);
      if (filepath.match(/alloy\.js$/)) {
        grunt.config.set(['tishadow', 'options', 'alloyCompileFile'],false);
      } else {
        grunt.config.set(['tishadow', 'options', 'alloyCompileFile'],target);
      }
    } else if (filepath.match(/.jade$/) && filepath.indexOf("includes") === -1) {
      var target  = filepath.replace(".jade",".xml").replace("src/","app/");
      o[target] = [filepath];
      grunt.config.set(['jade', 'compile', 'files'],o);
      grunt.config.set(['tishadow', 'options', 'alloyCompileFile'],target);
    } else if (filepath.match(/.stss$/) && filepath.indexOf("includes") === -1){
      if (filepath.match(/\/_.*?\.stss/)) { // if it is partial then recompile all stss
        grunt.log.write("Partial modified, rewriting all styles");
        grunt.config.set(['stss', 'compile', 'files'],[{
          expand: true,
          src: ['**/*.stss','!**/_*.stss'],
          dest: 'app',
          cwd: 'src',
          ext: '.tss'
        }]);
        grunt.config.set(['tishadow', 'options', 'alloyCompileFile'],false);
      } else {
        var target = filepath.replace(".stss",".tss").replace("src/","app/");
        o[target] = [filepath];
        if (filepath.match(/app\.stss$/)) {
          grunt.config.set(['tishadow', 'options', 'alloyCompileFile'],false);
        } else {
          grunt.config.set(['tishadow', 'options', 'alloyCompileFile'],target);
        }
        grunt.config.set(['stss', 'compile', 'files'],o);
      }
    } else if (filepath.match(/^src/)){
      var target = filepath.replace("src/", "app/");
      o[target] = [filepath];
      grunt.config.set(['tishadow', 'options', 'alloyCompileFile'],target);
      grunt.config.set(['copy','alloy','files'],o);
    } else { 
      grunt.config.set(['tishadow', 'options', 'alloyCompileFile'], false);
    }

    // override if opting out of selective compilation
    if (!grunt.config.get("boost")) {
      grunt.config.set(['tishadow', 'options', 'alloyCompileFile'], false);
    };
  });
};
