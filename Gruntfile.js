module.exports = function(grunt) {
  grunt.initConfig({

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
        watch: true
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
        tasks: ['jade']
      },
      styles: {
        files: ['src/**/*.stss'],
        tasks: ['stss']
      },
      javascripts: {
        files: ['src/**/*.js'],
        tasks: ['6to5']
      },
      assets: {
        files: ['src/**', '!src/**/*.jade', '!src/**/*.stss', '!src/**/*.js'],
        tasks: ['copy:alloy']
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      run: {
        tasks: ['tishadow:run', 'watch:views','watch:styles', 'watch:javascripts', /*'watch:assets',*/ ]
      },
      spec: {
        tasks: ['tishadow:spec', 'watch:views','watch:styles', 'watch:javascripts', /*'watch:assets',*/ ]
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
  grunt.registerTask('dev', ['build','concurrent:run']);
  grunt.registerTask('test', ['tishadow:clear','build','tishadow:spec']);
  //titanium cli tasks
  ['iphone6','iphone7','ipad6','ipad7','appstore','adhoc','playstore'].forEach(function(target) {
    grunt.registerTask(target, ['build','shell:'+target]);
  });

  //only modify changed file
  grunt.event.on('watch', function(action, filepath) {
    var ts_options =  {
      update : true,
    };
    if(grunt.option("p")) {
      ts_options.platform = grunt.option("p");
    }
    var alloyCompileFile ; 
    var o = {};
    if (filepath.match(/.js/)) {
      var target = filepath.replace("src/", "app/");
      o[target] = [filepath];
      grunt.config.set(['6to5', 'dist', 'files'],o);
      if (!filepath.match(/alloy\.js$/)) {
        alloyCompileFile = target;
      }
    } else if (filepath.match(/.jade$/) && filepath.indexOf("includes") === -1) {
      var target  = filepath.replace(".jade",".xml").replace("src/","app/");
      o[target] = [filepath];
      grunt.config.set(['jade', 'compile', 'files'],o);
      alloyCompileFile = target;
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
      } else {
        var target = filepath.replace(".stss",".tss").replace("src/","app/");
        o[target] = [filepath];
        if (!filepath.match(/app\.stss$/)) {
          alloyCompileFile = target;
        }
        grunt.config.set(['stss', 'compile', 'files'],o);
      }
    } else if (filepath.match(/^src/)){
      var target = filepath.replace("src/", "app/");
      o[target] = [filepath];
      alloyCompileFile = target;
      grunt.config.set(['copy','alloy','files'],o);
    } 
  });
};
