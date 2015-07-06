module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //LESS
    less: {
        options: {
            paths: ['styles/']
        },
        // target name
        css: {
            // no need for files, the config below should work
            expand: true,
            cwd:    "styles/",
            src:    "*.less",
            ext:    ".css",
            dest:   "dist/css"
        }
    },
    //CONCAT
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n'
      },
      js: {
        // the files to concatenate
        src: ['scripts/datePicker.js', 'scripts/datePickerUtils.js', 'scripts/dateRange.js', 'scripts/dateInput.js', 'scripts/datePickerApp.js', 'scripts/input.js'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        // the files to concatenate
        src: ['dist/css/style.css', 'dist/css/index.css', 'dist/css/datePickerApp.css'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    clean: {
        main: {
            src: 'dist/css'
        }
    }
   });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['less', 'concat', 'clean']);
};