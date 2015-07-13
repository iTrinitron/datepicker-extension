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
            cwd:    "dist/less",
            src:    "*.less",
            ext:    ".css",
            dest:   "dist"
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
        src: ['styles/variables.less', 'styles/mixins.less', 'styles/style.less', 'styles/index.less', 'styles/datePickerApp.less'],
        // the location of the resulting JS file
        dest: 'dist/less/<%= pkg.name %>.less'
      }
    },
    clean: {
        main: {
            src: 'dist/css'
        }
    },
    copy: {
      js: {
        src: 'dist/cc-daterangepicker.js',
        dest: '/Users/michaelchin1/cq/cms/cms/cms-base/cms-sites/cms-cc/cc-view/cc-design/src/content/jcr_root/etc/designs/site/cc/js/common/angular-dateRangePicker/<%= pkg.name %>.js'
      }
    },
    uglify: {
      js: {
        src: 'dist/cc-daterangepicker.js',
        dest: 'dist/cc-ugly.js'
      }
    }
   });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat', 'less', 'copy']);
};