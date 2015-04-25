// titanium build targets,
var ti_args= {
  ios: ['-p','ios','-T', 'simulator', '--device-id','F2B9C750-6BCC-4BC0-8CE8-A5D1FA30A036'],
  android: ['-p','android', '-T','device'],
  default: ['-p','ios'] 
};

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
    babel : {
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
          platform: ti_args[grunt.option("p")][1]
        }: {}
      },
      spec: {
        command: 'spec',
        options: grunt.option("p") ? {
          platform: ti_args[grunt.option("p")][1],
          update: false
        }:{
          update: false,
        }
      },
      server: {
        command: 'server'
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
        tasks: ['babel']
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
        tasks: ['tishadow:server','titanium:appify','tishadow:run', 'watch:views','watch:styles', 'watch:javascripts', /*'watch:assets',*/ ]
      },
      spec: {
        tasks: ['tishadow:server','titanium:appify', 'tishadow:spec', 'watch:views','watch:styles', 'watch:javascripts', /*'watch:assets',*/ ]
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
    titanium: {
      appify: {
        options:  {
          command: 'build',
          args: ti_args[grunt.option("p")||'default'].concat("--appify")
        }
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
  grunt.registerTask('build', ['copy:alloy', 'jade','stss', 'babel']);
  grunt.registerTask('dev', ['build','concurrent:run']);
  grunt.registerTask('test', ['tishadow:clear','build','concurrent:spec']);

  //titanium cli tasks
  ['appstore','adhoc','playstore'].forEach(function(target) {
    grunt.registerTask(target, ['build','shell:'+target]);
  });

  //only modify changed file
  grunt.event.on('watch', function(action, filepath) {
    var ts_options =  {
      update : true,
    };
    if(grunt.option("p")) {
      ts_options.platform = ti_args[grunt.option("p")][1];
    }
    var alloyCompileFile ; 
    var o = {};
    if (filepath.match(/.js/)) {
      var target = filepath.replace("src/", "app/");
      o[target] = [filepath];
      grunt.config.set(['babel', 'dist', 'files'],o);
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
