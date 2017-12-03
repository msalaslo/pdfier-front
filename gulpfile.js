'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const cleanDest = require('gulp-clean-dest');
const gulpCopy = require('gulp-copy');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const debug = require('gulp-debug');
const clean = require('gulp-clean');
const removeHtmlComments = require('gulp-remove-html-comments');
const watch = require('gulp-watch');
const serve = require('gulp-serve');
const ignore = require('gulp-ignore');
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const gulpSequence = require('gulp-sequence');


const SRC = 'src';
const DEST = 'build/';
const DEST_CSS = DEST + "/css";
const DEST_JS = DEST + "/js";
const DEST_HTML = DEST;
const DEST_XML = DEST;
const DEST_IMG = DEST + '/images';
const DEST_FONTS = DEST + '/fonts';
const DEST_AW_FONTS = DEST + '/font-awesome';

gulp.task('serve-src', serve({
	root : [ 'src' ],
	port : 81,
	https : false
}));
gulp.task('serve-build', serve({
	root : [ 'build' ],
	port : 81,
	https : false
}));

gulp.task('default', gulpSequence( 'html', 'xml-txt', 'images', 'fonts', 'font-awesome', 'js-css' ));

gulp.task('stream', function() {
	// Endless stream mode 
	return watch([ SRC + '/**/*.*', SRC + '/*.html' ], {
		ignoreInitial : false
	})
		.pipe(gulp.dest(DEST));
});


gulp.task('js-css', function() {
	return gulp.src(SRC + '/index.html')
		.pipe(debug({
			title : 'ficheros donde buscamos los JS y CSS a concatenar (minificar):'
		}))
		.pipe(cleanDest(DEST_JS))
		.pipe(cleanDest(DEST_CSS))
		.pipe(useref())
		.pipe(gulpIf('*.app.js', uglify()))
		.pipe(gulpIf('*.css', minifyCSS()))
//		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
		.pipe(gulp.dest(DEST));
});

gulp.task('html', function() {
	return gulp.src([ SRC + '/*.html' ])
		.pipe(cleanDest(DEST_HTML))
		.pipe(removeHtmlComments())
		.pipe(htmlmin({
			collapseWhitespace : true
		}))
		.pipe(gulp.dest(DEST_HTML))
});


gulp.task('xml-txt', function() {
	return gulp.src([ SRC + '/*.xml', SRC + '/*.txt', SRC + '/.htaccess' ])
		.pipe(cleanDest(DEST_XML))
		.pipe(gulp.dest(DEST_XML))
});


gulp.task('images', function() {
	return gulp.src([ SRC + '/images/**/*' ])
		//	    .pipe(imagemin())
		.pipe(cleanDest(DEST_IMG))
		.pipe(gulp.dest(DEST_IMG))
});

gulp.task('fonts', function() {
	return gulp.src([ SRC + '/fonts/**/*' ])
		.pipe(cleanDest(DEST_FONTS))
		.pipe(gulp.dest(DEST_FONTS))
});
gulp.task('font-awesome', function() {
	return gulp.src([ SRC + '/font-awesome/**/*' ])
		.pipe(gulp.dest(DEST_AW_FONTS))
});