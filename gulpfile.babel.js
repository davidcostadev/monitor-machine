'use strict';

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';




gulp.task('build', () => {
    return gulp.src(['src/**/*'])
        .pipe(babel())
        .pipe(gulp.dest('./dist/'));
});


gulp.task('watch', ['build'], () => {
    return gulp.watch(['src/**/*.*'], ['build']);
});

gulp.task('run', () => {
    return nodemon({
        delay: 10,
        script: 'src/main.js',
        // args: ["config.json"],
        ext: 'js',
        watch: 'src'
    })
});

gulp.task('default', ['watch', 'run']);