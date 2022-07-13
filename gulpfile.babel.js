const {
    src,
    dest,
    series,
    watch,
    parallel,
    symlink,
} = require('gulp');

const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

const PATH = {
        HTML:'./workspaces/html',
        ASSETS: {
            FONTS: './workspaces/assets/fonts',
            IMAGES: './workspaces/assets/img',
            STYLE: './workspaces/assets/scss',
            JS: './workspaces/assets/js'
        }
    },
    DEST_PATH = {
        HTML: './dist/html',
        ASSETS: {
            FONTS: './dist/assets/fonts',
            IMAGES: './dist/assets/img',
            STYLE: './dist/assets/css',
            JS: './dist/assets/js'
        }
    };

//tasks.....
function server(cb) {
    console.log('server routed');
    browserSync.init({
        // port: 8000,
        server: {
            baseDir: './',
        },
    });
}

function clean() {
    console.log('clean files excuted');
    return del([
        DEST_PATH.HTML,
        DEST_PATH.ASSETS.STYLE,
        DEST_PATH.ASSETS.JS,
        DEST_PATH.ASSETS.IMAGES,
        '!dist/assets/fonts/**'
    ]);
}

function include() {
    // console.log('file include excute');
    return src(PATH.HTML + '/*.html')
    .pipe(fileinclude({
        context : {
            cssArr: [],
            jsArr: [],
        },
        prefix: '@@',
        basepath: '@file',
        indent: true
    }))
    .pipe(dest(DEST_PATH.HTML))
    .pipe(browserSync.reload({
        stream: true
    }));
}

function style() {
    console.log('style excute');
    const options = {
        outputStyle: 'expanded',
        indentType: 'space',
        indentWidth: 4,
        precision: 8,
        sourceComments: true,
    };
    return src(PATH.ASSETS.STYLE + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync(options).on('error', sass.logError))
        .pipe(sourcemaps.write('./map'))
        .pipe(dest(DEST_PATH.ASSETS.STYLE))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function js() {
    console.log('js excuted');
    return src(PATH.ASSETS.JS + '/**/*.js')
        .pipe(dest(DEST_PATH.ASSETS.JS))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function img() {
    console.log('img excuted');
    return src(PATH.ASSETS.IMAGES + '/**/*')
        .pipe(dest(DEST_PATH.ASSETS.IMAGES))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function watching(cb) {
    console.log('watch excuted');
    watch(PATH.HTML + '/**/*.html', include);
    watch(PATH.ASSETS.STYLE + '/**/*.scss', style);
    watch(PATH.ASSETS.JS + '/**/*.js', js);
    watch(PATH.ASSETS.IMAGES + '/**/*.scss', img);
}

exports.server = server;
exports.clean = clean;
exports.include = include;
exports.style = style;
exports.js = js;
exports.img = img;
exports.watching = watching; 

export const prepare = series([clean]);
export const assets = series([include, style, js, img]);
export const build = series([prepare, assets]);
export const live = parallel([server, watching]);
export const dev = series([build, live]);