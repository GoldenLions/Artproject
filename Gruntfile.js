module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    autoprefixer: {
    	single_file: {
    		src: 'client/www/styles/main.css',
    		dest: 'client/www/styles/main.css'
    	}
    }
  });


  // grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('prefix', [
  	'autoprefixer'
  ])
}