module.exports = function(grunt) {
  grunt.initConfig({
    info: '<json:package.json>',
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/'
    },
    lint: {
      all: ['index.js', 'test/*.js']
    },
    clientside: {
      main: {
        main: 'index.js',
        name: 'Observe',
        output: 'dist/observe.js'
      }
    },
    concat: {
      dist: {
        src: ['<banner>', 'dist/observe.js'],
        dest: 'dist/observe.js'
      },
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/observe.js'],
        dest: 'dist/observe.min.js'
      }
    },
    simplemocha: {
      all: {
        src: 'test/**/*.test.js',
        options: {
          ui: 'tdd',
          reporter: 'list',
          growl: true
        }
      }
    },
    watch: {
      js: {
        files: '<config:lint.all>',
        tasks: 'default' 
      }
    },
    server:{
      port: 8000,
      base: '.'
    }
  });
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-clientside');
  grunt.registerTask('default', 'lint clientside concat min simplemocha');
  grunt.registerTask('dev', 'server watch');
}
