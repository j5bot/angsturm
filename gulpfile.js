
const gulp = require('gulp'),

  plugins = require('gulp-load-plugins')(),
  bower = require('main-bower-files'),

  print = require('gulp-print'),

  del = require('del'),
  eventStream = require('event-stream'),

  // Q = require('q'),

  order = plugins.order,
  // angularFilesort = plugins.angularFilesort,
  filter = plugins.filter,
  inject = plugins.inject;

  // sass = plugins.rubySass,
  // autoprefixer = plugins.autoprefixer,
  // cssnano = plugins.cssnano,

  // jshint = plugins.jshint,
  // jscs = plugins.jscs,
  // uglify = plugins.uglify,
  // imagemin = plugins.imagemin,
  // rename = plugins.rename,
  // concat = plugins.concat,
  // sourcemaps = plugins.sourcemaps,
  // notify = plugins.notify,
  // cache = plugins.cache,
  // livereload = plugins.livereload;

const VENDOR_ORDER = require('./conf/vendor-order.json'),
  BOWER_OVERRIDES = require('./conf/main-bower-files-overrides.json');


const bowerFiles = bower( BOWER_OVERRIDES );


const filters = {

  scripts: filter( '**/*.{js,json}' ),
  styles: filter( '**/*.{css,scss}' ),
  images: filter( '**/*.{png,svg,jpg,jpeg,gif}' ),
  fonts: filter( '**/*.{wof,eot,ttf}')

};

const paths = {

  src: {

    index: './src/index.html',
    inject: [ './dist/js/**/*.js', './dist/css/**/*.{css,scss}' ],

    scripts: './src/scripts/**/*.js'

  },

  dist: {

    index: './dist/',

    scripts: './dist/js/',
    styles: './dist/css/',
    images: './dist/img/',
    fonts: './dist/fonts/'

  }

};

const pipes = {

  app: () => {

    return gulp
      .src( paths.src.scripts )
      .pipe( gulp.dest( paths.dist.scripts ) );

  },

  bower: {

    all: () => {

      const bp = pipes.bower;

      return eventStream
        .merge(
               bp.scripts(),
               bp.styles(),
               bp.images(),
               bp.fonts()
        );

    },

    scripts: () => {

      return gulp
        .src( bowerFiles, { base: './bower_components/' } )
        .pipe( filters.scripts )
        .pipe( gulp.dest( paths.dist.scripts ) );

    },

    styles: () => {

      return gulp
        .src( bowerFiles, { base: './bower_components/' } )
        .pipe( filters.styles )
        .pipe( gulp.dest( paths.dist.styles ) );

    },

    images: () => {

      return gulp
        .src( bowerFiles, { base: './bower_components/' } )
        .pipe( filters.images )
        .pipe( gulp.dest( paths.dist.images ) );

    },

    fonts: () => {

      return gulp
        .src( bowerFiles, { base: './bower_components/' } )
        .pipe( filters.fonts )
        .pipe( gulp.dest( paths.dist.fonts ) );

    }

  },

  clean: () => {

    return del( [ './dist/{css,fonts,img,js,index.html}' ] );

  },

  inject: () => {

    return gulp
      .src( paths.src.index )
      .pipe(
        inject(
          gulp.src(
            paths.src.inject, { read: false }
          ).pipe( order( VENDOR_ORDER ) )
        )
      )
      .pipe( gulp.dest( paths.dist.index ) );

  }

};

gulp.task('build', ['dist'], () => {

  return pipes.inject();

});

gulp.task('dist', ['clean'], () => {

  return pipes.app(),
    pipes.bower.all();

});

gulp.task('clean', () => {
  return pipes.clean();
});

gulp.task('app', () => {
  return pipes.app();
});

gulp.task('bower', () => {
  return pipes.bower.all();
});

gulp.task('inject', () => {
  return pipes.inject();
});
