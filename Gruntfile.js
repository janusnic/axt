module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ' ',
                stripBanners: true,
                banner: grunt.file.read('./LICENSE')
            },
            dist: {
                src: [
                    'lib/src/Class.js',
                    'lib/src/Ajax.js',
                    'lib/src/EventEmitter.js'
                ],
                dest: 'lib/dist/axt-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                sourceMap: true,
                sourceMapName: 'lib/dist/axt-<%= pkg.version %>.js.map',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    'lib/dist/axt-<%= pkg.version %>.min.js': ['lib/src/Class.js','lib/src/Ajax.js', 'lib/src/EventEmitter.js']
                }
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: ['spec/']
        }
    });
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat','uglify','jasmine_node'])
};