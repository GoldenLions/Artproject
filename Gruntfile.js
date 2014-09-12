module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
    	options: {
		    browsers: ['last 8 versions']
		  },
		  dist: { // Target
		    files: {
		      'client/www/styles/main.css': 'client/www/styles/main.css'
		    }
		  }
    }
  });


  // grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('prefix', [
  	'autoprefixer'
  ])
}