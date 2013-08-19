module.exports = function(grunt) {
  grunt.initConfig({
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          src: ['**/*.jade'],
          dest: 'app',
          cwd: 'app',
          ext: '.xml'
        }]
      }
    },
    ltss: {
      compile: {
        files: [{
          expand: true,
          src: ['**/*.ltss'],
          dest: 'app',
          cwd: 'app',
          ext: '.tss'
        }]
      }
    },
    tishadow: {
      options: {
        update: true,
        withAlloy: true
      },
      run_android: {
        command: 'run',
        options: {
          alloy: {
            platform: ['android'],
            noBanner: true,
            logLevel: 1
          }
        }
      },
      run_ios:{
        command: 'run',
        options: {
          alloy: {
            platform: ['ios'],
            noBanner: true,
            logLevel: 1
          }
        }
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      jade: {
        files:'app/**/*.jade',
        tasks: ['jade','tishadow:run_ios']
      },
      ltss: {
        files: 'app/**/*.ltss',
        tasks: ['ltss','tishadow:run_ios']
      },
      tishadow: {
        files: ['app/**/*.js', 'app/**/*.xml', 'app/**/*.tss'],
        tasks: ['tishadow:run_ios']
      }
    }
  });
   
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-ltss');
  grunt.loadNpmTasks('grunt-tishadow');
   
  grunt.registerTask('default', ['jade','ltss']);
   
  //only modify changed file
  grunt.event.on('watch', function(action, filepath) {
    var o = {};
    if (filepath.match(/.jade$/)) {
      o[filepath.replace(".jade",".xml")] = [filepath];
      grunt.config.set(['jade', 'compile', 'files'],o);
    } else if (filepath.match(/.ltss$/)){
      o[filepath.replace(".ltss",".tss")] = [filepath];
      grunt.config.set(['ltss', 'compile', 'files'],o);
    }
  });
   
};
