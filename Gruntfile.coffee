module.exports = (grunt) ->
  grunt.initConfig
    jade:
      compile:
        options:
          pretty: true

        files: [
          expand: true
          src: ["**/*.jade", "!**/includes/**", "!**/templates/**"]
          dest: "app"
          cwd: "app"
          ext: ".xml"
        ]

    ltss:
      compile:
        files: [
          expand: true
          src: ["**/*.ltss", "!**/includes/**"]
          dest: "app"
          cwd: "app"
          ext: ".tss"
        ]

    coffee:
      compile:
        files: [
          expand: true
          src: ["**/*.coffee", "!**/includes/**"]
          dest: "app"
          cwd: "app"
          ext: ".js"
        ]

    tishadow:
      options:
        update: true
        withAlloy: true

      run_android:
        command: "run"
        options:
          alloy:
            platform: ["android"]
            noBanner: true
            logLevel: 1

      run_ios:
        command: "run"
        options:
          alloy:
            platform: ["ios"]
            noBanner: true
            logLevel: 1

      spec_android:
        command: "spec"
        options:
          update: false
          alloy:
            platform: ["android"]
            noBanner: true
            logLevel: 1

      spec_ios:
        command: "spec"
        options:
          update: false
          alloy:
            platform: ["ios"]
            noBanner: true
            logLevel: 1

      clear:
        command: "clear"
        options:
          withAlloy: false

    watch:
      options:
        nospawn: true

      ios:
        files: ["app/**/*.coffee", "app/**/*.js", "app/**/*.jade", "app/**/*.ltss"]
        tasks: ["build", "tishadow:run_ios"]

      android:
        files: ["app/**/*.coffee", "app/**/*.js", "app/**/*.xml", "app/**/*.ltss"]
        tasks: ["build", "tishadow:run_android"]

    clean:
      project:
        src: ["app/views/**/*.xml", "app/styles/**/*.tss", "Resources/", "build/"]

  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-ltss"
  grunt.loadNpmTasks "grunt-tishadow"
  grunt.registerTask "default", "build"
  grunt.registerTask "build", ["jade", "ltss", "coffee"]
  grunt.registerTask "dev_ios", ["build", "tishadow:run_ios", "watch:ios"]
  grunt.registerTask "dev_android", ["build", "tishadow:run_android", "watch:android"]
  grunt.registerTask "test_ios", ["tishadow:clear", "build", "tishadow:spec_ios"]
  grunt.registerTask "test_android", ["tishadow:clear", "build", "tishadow:spec_android"]
  
  #only modify changed file
  grunt.event.on "watch", (action, filepath) ->
    o = {}
    if filepath.match(/.jade$/)
      o[filepath.replace(".jade", ".xml")] = [filepath]
      grunt.config.set ["jade", "compile", "files"], o
    else if filepath.match(/.ltss$/)
      o[filepath.replace(".ltss", ".tss")] = [filepath]
      grunt.config.set ["ltss", "compile", "files"], o
    else if filepath.match(/.coffee$/)
      o[filepath.replace(".coffee", ".js")] = [filepath]
      grunt.config.set ["coffee", "compile", "files"], o

