module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'lib/src/Class.js',
                    'lib/src/Ajax.js'
                ],
                dest: 'lib/dist/axt.js',
            },
        },
        uglify: {
            options: {
                mangle: false,
                sourceMap: true,
                sourceMapName: 'lib/dist/axt.js.map',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    'lib/dist/axt.min.js': ['lib/src/Class.js','lib/src/Ajax.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat','uglify'])
};