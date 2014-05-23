module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
          dist: {
            src: [
              'public/js/vendor/jquery.min.js',
              'public/js/vendor/underscore-min.js',
              'public/js/vendor/backbone-min.js',
              'public/js/vendor/jquery.easing.min.js',
              'public/js/vendor/howler.min.js',
              'public/js/vendor/jquery.tipsy.js',
              "public/js/templates.js",
              'public/js/*.js',
            ],
            dest: 'public/js/build/production.js'
          }
        },

        jst: {
          compile: {
            options: {
              templateSettings: {
                //interpolate : /\{\{(.+?)\}\}/g
              }
            },
            files: {
              "public/js/templates.js": ["public/jst/**/*.html"]
            }
          }
        },

        uglify: {
          options: {
            report: 'min',
            mangle: true,
            compress: true
          },
          build: {
            src: 'public/js/build/production.js',
            dest: 'public/js/build/production.min.js'
          }
        },

        jshint: {
          all: ['Gruntfile.js', 'public/js/app.js']
        },

        compass: {
          dist: {
            options: {
              config: 'config.rb'
            }
          }
        },

        imagemin: {
          dynamic: {
            files: [{
              expand: true,
              cwd: 'public/img/',
              src: ['**/*.{png,jpg,gif}'],
              dest: 'public/img/'
            }]
          }
        },

        watch: {
          html: {
            files: ['index.html'],
            options: {
              livereload: true
            },
          },
          jst: {
            files: ['public/jst/**/*.html'],
            tasks: ['jst', 'concat', 'uglify', 'jshint'],
            options: {
              livereload: true
            },
          },
          app: {
            files: ['app.rb', 'views/*.*'],
            options: {
              livereload: true,
              spawn: false
            },
          },
          scripts: {
            files: ['public/js/*.js'],
            tasks: ['concat', 'uglify', 'jshint'],
            options: {
              livereload: true,
              spawn: false
            },
          },

          css: {
            files: ['scss/*.scss'],
            tasks: ['compass'],
            options: {
              livereload: true,
              spawn: false
            }
          }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    
    //grunt.loadNpmTasks('grunt-contrib-imagemin');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['watch', 'jshint', 'concat', 'uglify', 'jst', 'compass']);

};
