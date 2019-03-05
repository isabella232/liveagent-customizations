var gulp         = require( 'gulp' );
var sass         = require( 'gulp-ruby-sass' );
var autoprefixer = require( 'gulp-autoprefixer' );
var cleanCSS     = require( 'gulp-clean-css' );
var rename       = require( 'gulp-rename' );
var concat       = require( 'gulp-concat' );
var uglify       = require( 'gulp-uglify' );
var livereload   = require( 'gulp-livereload' );
var wrapper      = require( 'gulp-wrapper' );
var babel        = require( 'gulp-babel' );

/**
 * Compile styles
 */
gulp.task( 'styles', function() {
	return sass( 'scss/*' )
		.pipe( autoprefixer() )
		.pipe( cleanCSS() )
		.pipe( rename( 'style.min.css' ) )
		.pipe( gulp.dest( 'dist' ) )
		.pipe( livereload() );
});

/**
 * Concatenate scripts
 */
gulp.task( 'scripts', function() {
	// All of our code will execute in a scope where jQuery is
	// defined and aliased to $ (or else if jQuery is not available
	// it will not run at all)
	let jQueryWrapper = {
		header: `
			( function() { 
				// Safety check: we expect jQuery to be present, but this may change unexpectedly
				if ( 'function' !== typeof jQuery ) {
					return;
				}

				jQuery( function( $ ) { 
		`,
		footer: `
				} ); // End of jQuery document ready block
			} )(); // End of anonymous function wrapper
		`
	}

	return gulp.src( './js/**/*.js' )	
		.pipe( concat( 'frontend.js' ) )
		.pipe( wrapper( jQueryWrapper ) )
		.pipe( babel() )
		.pipe( gulp.dest( 'dist' ) )
		.pipe( uglify() )
		.pipe( rename( 'frontend.min.js' ) )
		.pipe( gulp.dest( 'dist' ) )
});

/**
 * Watch task
 */
gulp.task( 'watch', function() {
	livereload.listen();

	gulp.watch( 'scss/*', ['styles'] );
	gulp.watch( 'js/*.js', ['scripts'] ).on( 'change' ,function( file ) {
		livereload.changed( file.path );
	} );
});

/**
 * Build scripts and styles for deploy
 */
gulp.task( 'build', ['scripts', 'styles'] );