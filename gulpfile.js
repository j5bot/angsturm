
const gulp = require('gulp'),

  plugins = require('gulp-load-plugins')(),
  bower = require('main-bower-files'),

  print = require('gulp-print'),

  del = require('del'),
  eventStream = require('event-stream'),

  order = plugins.order,
  filter = plugins.filter,
  inject = plugins.inject,

  sass = plugins.rubySass,
  autoprefixer = plugins.autoprefixer,

  jshint = plugins.jshint,
  jscs = plugins.jscs,

  server = plugins.serverLivereload;

  // Q = require('q'),
  // angularFilesort = plugins.angularFilesort,
  // cssnano = plugins.cssnano,
  // uglify = plugins.uglify,
  // imagemin = plugins.imagemin,
  // rename = plugins.rename,
  // concat = plugins.concat,
  // sourcemaps = plugins.sourcemaps,
  // notify = plugins.notify,
  // cache = plugins.cache,
  // livereload = plugins.livereload,

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

  bower: {

    components: './bower_components'

  },

  src: {

    index: './src/index.html',

    inject: [
      './dist/js/**/*.js',
      './dist/api/mock/**/*.js',
      './dist/css/**/*.{css,scss}'
    ],

    scripts: './src/scripts/**/*.js',
    sass: './src/styles/**/*.scss',
    css: './src/styles/**/*.css',
    images: './src/images/**/*.{png,gif,jpg,jpeg,svg}',

    api: './src/api/**/*.{js,json}',
    data: './src/data/**/*.json',
    views: './src/views/**/*.html'

  },

  dist: {

    all: './dist/{api,css,fonts,img,js,index.html}',

    index: './dist/',

    scripts: './dist/js/',
    styles: './dist/css/',
    images: './dist/img/',
    fonts: './dist/css/',

    api: './dist/api/',
    data: './dist/data/',
    views: './dist/views/'

  },

  serve: {

    index: 'index.html'

  }

};

const pipes = {

  app: () => {

    return gulp
        .src( paths.src.api )
        .pipe( gulp.dest( paths.dist.api ) ),
      gulp
        .src( paths.src.data )
        .pipe( gulp.dest( paths.dist.data ) ),
      gulp
        .src( paths.src.images )
        .pipe( gulp.dest( paths.dist.images ) ),
      gulp
        .src( paths.src.views )
        .pipe( gulp.dest( paths.dist.views ) ),
      gulp
        .src( paths.src.scripts )
        .pipe( gulp.dest( paths.dist.scripts ) );

  },

  styles: () => {

    return eventStream
      .merge(

        sass(
            paths.src.sass,
            {
              style: 'expanded',
              base: './src/styles/'
            }
          )
          .pipe( autoprefixer('last 2 version') ),

        gulp
          .src( paths.src.css )

      )
      .pipe( gulp.dest( paths.dist.styles ) );

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
        .src( bowerFiles, { base: paths.bower.components } )
        .pipe( filters.scripts )
        .pipe( gulp.dest( paths.dist.scripts ) );

    },

    styles: () => {

      return gulp
        .src( bowerFiles, { base: paths.bower.components } )
        .pipe( filters.styles )
        .pipe( gulp.dest( paths.dist.styles ) );

    },

    images: () => {

      return gulp
        .src( bowerFiles, { base: paths.bower.components } )
        .pipe( filters.images )
        .pipe( gulp.dest( paths.dist.images ) );

    },

    fonts: () => {

      return gulp
        .src( bowerFiles, { base: paths.bower.components } )
        .pipe( filters.fonts )
        .pipe( gulp.dest( paths.dist.fonts ) );

    }

  },

  clean: () => {

    return del( [ paths.dist.all ] );

  },

  inject: () => {

    return gulp
      .src( paths.src.index )
      .pipe(
        inject(
          gulp.src(
            paths.src.inject, { read: false }
          ).pipe( order( VENDOR_ORDER ) ),
          { ignorePath: paths.dist.index.substr(1) }
        )
      )
      .pipe( gulp.dest( paths.dist.index ) );

  }

};

gulp.task('serve', () => {

  return gulp.src('dist')
    .pipe(
          server(
            {
              livereload: true,
              open: true,
              defaultFile: paths.serve.index,
              fallback: paths.serve.index
            }
          )
      );

});

gulp.task('build', ['dist'], () => {

  return pipes.inject();

});

gulp.task('dist', ['clean'], () => {

  return pipes.app(),
    pipes.styles(),
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
