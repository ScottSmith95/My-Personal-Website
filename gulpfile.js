'use strict';

var gulp       = require('gulp'),
	kit        = require('gulp-kit'),
	postcss    = require('gulp-postcss'),
	sprite     = require('gulp-svg-sprite'),
	concat     = require('gulp-concat'),
	uglify     = require('gulp-uglify'),
	sitemap    = require('gulp-sitemap'),
	sourcemaps = require('gulp-sourcemaps');

var paths = {
	html:              ['**/*.kit', '!kit-includes/**', '!node_modules/**/*'],
	styles:            ['styles/**/*.css', '!styles/build/**', '!styles/variables.css', '!styles/partials/_*'],
	teaStyles:         ['tea/*.css'],
	builtStyles:       ['styles/build/home.css'],
	sprites:           ['images/Social Icons/*.svg', '!images/Social Icons/home-sprite.svg'],
	sitemap:           ['**/*.html', '!error/*.html', '!node_modules/**/*'],
	scripts:           ['scripts/*.js', '!scripts/build/**',
						'!scripts/main.js', '!scripts/home.js', '!scripts/social-icons.js'],
	mainScript:        ['scripts/vendor/modernizr.js'],
	homeScript:        ['node_modules/boomsvgloader/dist/js/boomsvgloader.js', 'scripts/home.js'],
	socialIconsScript: ['node_modules/flickity/dist/flickity.pkgd.js', 'scripts/social-icons.js']
};

var processors = [
	require('postcss-import'),
	require('postcss-nested'),
	require('postcss-custom-properties'),
	require('css-mqpacker')({sort: true}),
	require('autoprefixer')('last 2 versions', '> 2.5% in US', 'Firefox ESR')
];

gulp.task(function html() {
	return gulp.src(paths.html)
		.pipe(kit())
		.pipe(gulp.dest('./'));
});

gulp.task(function styles() {
	processors.push(require('cssnano')({autoprefixer: false, reduceIdents: false}));
	
	return gulp.src(paths.styles)
		.pipe(sourcemaps.init())
			.pipe(postcss(processors))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('styles/build/'));
});

gulp.task(function teaStyles() {
	return gulp.src(paths.teaStyles)
		.pipe(sourcemaps.init())
			.pipe(postcss(processors))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('tea/build/'));
});

gulp.task(function lintStyles() {
	return gulp.src(paths.styles)
		.pipe(postcss(processors))
		.pipe(gulp.dest('styles/build/'));
});

gulp.task(function lint() {
	return gulp.src(paths.builtStyles)
		.pipe(lint({
			failAfterError: false,
			reporters: {
				formatter: 'string',
				save: 'report.txt'
			},
			debug: true
	    }));
});

gulp.task(function sprites() {
	var options = {
		mode: {
			symbol: { // Create a «symbol» sprite.
				dest: '.', // Don't create 'symbols/' directory.
				prefix: '', // Don't prefix output title.
				sprite: 'home-sprite' // '.svg' will be appended if not included.
			}
		} 
	};
    
	return gulp.src(paths.sprites)
		.pipe(sprite(options))
		.pipe(gulp.dest('images/Social Icons'));
});

gulp.task(function mainScript() {
	return gulp.src(paths.mainScript)
		.pipe(sourcemaps.init())
			.pipe(concat('main.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('scripts/build/'));
});

gulp.task(function homeScript() {
	return gulp.src(paths.homeScript)
		.pipe(sourcemaps.init())
			.pipe(concat('home.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('scripts/build/'));
});

gulp.task(function socialIconsScript() {
	return gulp.src(paths.socialIconsScript)
		.pipe(sourcemaps.init())
			.pipe(concat('social-icons.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('scripts/build/'));
});

gulp.task('scripts', gulp.parallel('mainScript', 'homeScript', 'socialIconsScript', function(done) {
	return gulp.src(paths.scripts)
		.pipe(sourcemaps.init())
			.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('scripts/build/'));
	done();
}));

gulp.task(function sitemap() {
	return gulp.src(paths.sitemap)
		.pipe(sitemap({
			siteUrl: 'https://scotthsmith.com'
		}))
		.pipe(gulp.dest('./'));
});

gulp.task(function watch() {
	gulp.watch(paths.html, gulp.series('html'));
	gulp.watch(paths.styles, gulp.series('styles'));
	gulp.watch(paths.sprites, gulp.series('sprites'));
	gulp.watch('scripts/*.js', gulp.series('scripts'));
});

// Workflows
// $ gulp: Builds, prefixes, and minifies CSS files; concencates and minifies JS files; watches for changes. The works.
gulp.task('default', gulp.parallel('html', 'styles', 'teaStyles', 'sprites', 'scripts', 'watch', function(done) {
	done();
}));

// $ gulp build: Builds, prefixes, and minifies CSS files; concencates and minifies JS files. For deployments.
gulp.task('build', gulp.parallel('html', 'styles', 'teaStyles', 'sprites', 'scripts', function(done) {
	done();
}));

// $ gulp test: Runs stylelint against built CSS files. For CI.
gulp.task('pretest', gulp.parallel('lintStyles', function(done) {
	done();
}));