'use strict';

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
// var source      = require('vinyl-source-stream');
// var buffer      = require('vinyl-buffer');
import babel from 'gulp-babel';

// var babel = require('babelify');
// var browserify = require('browserify');



gulp.task('build', () => {
    return gulp.src(['src/main.js'])
        .pipe(babel())
        .pipe(gulp.dest('./dist/'));

    // return browserify({entries: './src/main.js', debug: true})
    //     .transform("babelify", { presets: ["es2015"] })
    //     .bundle()
    //     .pipe(source('main.js'))
    //     .pipe(buffer())
    //     .pipe(gulp.dest('./dist/'));
});


gulp.task('watch', ['build'], () => {
    gulp.watch(['src/**/*.*'], ['build']);
});

gulp.task('run', () => {
    nodemon({
        delay: 10,
        script: 'src/main.js',
        // args: ["config.json"],
        ext: 'js',
        watch: 'src'
    })
});

gulp.task('default', ['build', 'watch', 'run']);