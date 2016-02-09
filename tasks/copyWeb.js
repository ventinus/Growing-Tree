/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
  grunt.config.merge({
    copy: {
      main: {
        expand: true,
        cwd: './web/',
        src: '**',
        dest: '../ventinus.github.io/canvas-tree/',
      },
    }

  });

  grunt.registerTask('copyWeb', [
    'copy:main'
  ]);
};
