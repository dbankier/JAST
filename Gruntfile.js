// titanium build targets,
var ti_args= {
  iphone: ['-p','ios','-T', 'simulator', '--device-id','2EDE91F7-CF71-4CA5-9366-28045E03FBE0'],
  ipad: ['-p','ios','-T', 'simulator', '--device-id','8A0883C7-A1E0-4957-82D9-DAF1D89B0FAD'],
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
        sourceMap: false,
        presets: ['es2015']
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
      appify: {
        command: ['ti', 'build'].concat(ti_args[grunt.option("p")||'default']).concat("--appify").join(" ")
      },
      adhoc: {
        command: 'ti build -p ios -F <%= ios_family %> -T dist-adhoc -R "<%= ios_adhoc_name %>" -P "<%= ios_adhoc_profile %>"  -O ~/Desktop '
      },
      appstore: {
        command: 'ti build -p ios -F <%= ios_family %> -T dist-appstore -R "<%= ios_appstore_name %>" -P "<%= ios_appstore_profile %>"  -O ~/Desktop '
      },
      playstore: {
        command: 'ti build -T dist-playstore -O ~/Desktop -p android -K <%= android_keystore %> -P <%= android_keypass %>'
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
        files: ['src/**/*.!(jade|stss|js)'],
        tasks: ['copy:alloy']
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      run: {
        tasks: ['tishadow:server','shell:appify','tishadow:run', 'watch:views','watch:styles', 'watch:javascripts','watch:assets' ]
      },
      spec: {
        tasks: ['tishadow:server','shell:appify', 'tishadow:spec', 'watch:views','watch:styles', 'watch:javascripts', 'watch:assets' ]
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
            '!**/*.stss',
            '!**/*.js'
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
  grunt.registerTask('build', ['copy:alloy', 'jade','stss', 'babel']);
  grunt.registerTask('dev', ['build','concurrent:run']);
  grunt.registerTask('test', ['tishadow:clear','build','concurrent:spec']);

  //titanium cli tasks
  ['appify', 'appstore','adhoc','playstore'].forEach(function(target) {
    grunt.registerTask(target, ['build','shell:'+target]);
  });

  //only modify changed file
  var changedFiles = Object.create(null);
  var onChange = grunt.util._.debounce(function() {
    var o = {
      'babel': [],
      'jade': [],
      'stss': [],
      'stssall': false,
      'copy': []
    };

    Object.keys(changedFiles).forEach(function(filepath) {
      if (filepath.match(/.js/)) {
        var target = filepath.replace("src/", "app/");
        o.babel.push({ src: filepath, dest: target });
      } else if (filepath.match(/.jade$/) && filepath.indexOf("includes") === -1) {
        var target  = filepath.replace(".jade",".xml").replace("src/","app/");
        // o.jade[target] = [filepath];
        o.jade.push({ src: filepath, dest: target });
      } else if (filepath.match(/.stss$/) && filepath.indexOf("includes") === -1){
        if (filepath.match(/\/_.*?\.stss/)) { // if it is partial then recompile all stss
          o.stssall = true;
          o.stss = [];
        } else if (!o.stssall) {
          var target = filepath.replace(".stss",".tss").replace("src/","app/");
          o.stss.push({ src: filepath, dest: target });
        }
      } else if (filepath.match(/^src/)){
        var target = filepath.replace("src/", "app/");
        o.copy.push({ src: filepath, dest: target });
      }
    });

    // babel
    if (o.babel.length) {
      grunt.config.set(['babel', 'dist', 'files'], o.babel);
    }
    // jade
    if (o.jade.length) {
      grunt.config.set(['jade', 'compile', 'files'], o.jade);
    }
    // stss
    if (o.stssall) {
      grunt.log.write("Partial modified, rewriting all styles");
      grunt.config.set(['stss', 'compile', 'files'],[{
        expand: true,
        src: ['**/*.stss','!**/_*.stss'],
        dest: 'app',
        cwd: 'src',
        ext: '.tss'
      }]);
    } else if (o.stss.length) {
      grunt.config.set(['stss', 'compile', 'files'], o.stss);
    }
    // copy
    if (o.copy.length) {
      grunt.config.set(['copy','alloy','files'], o.copy);
    }

    // done
    changedFiles = Object.create(null);
  }, 200);
  grunt.event.on('watch', function(action, filepath) {
    changedFiles[filepath] = action;
    onChange();
  });
};
