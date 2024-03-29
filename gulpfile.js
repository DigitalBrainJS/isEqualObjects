const path = require('path');
const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const plumber = require('gulp-plumber');
const connect = require('connect');
const serveStatic = require('serve-static');
const rename = require('gulp-rename');
const terser = require('gulp-minify');
const through = require("through2");
const {exec} = require('child_process');

const noop= ()=> through.obj();

const ENTRY_FILE = 'src/is-equal-objects.js';
const BASE_NAME= path.basename(ENTRY_FILE, '.js');
const EXPORT_NAME= 'isEqualObjects';
const DIST_DIR = __dirname + '/dist';
const PORT= 3000;

const toCamelCase= (str)=> str.replace(/-([a-z])/g, (w)=>w[1].toUpperCase());

let isDevMode= false;

function createBuildTask(entryFile, buildOptions) {

    const {name, base, ext} = path.parse(entryFile),
        {
            exportName = name,
            destPath = DIST_DIR,
            format = 'umd',
            toES5 = false,
            outFile = `${name}.${format}${ext}`,
            taskTargetName = outFile,
            include = 'node_modules/**',
            exclude,
            minify
        } = buildOptions || {};

    const taskName = `build:${taskTargetName}`;

    const rollupPlugins = [
        resolve({mainFields: ['module', 'main']}),
        commonjs({
            include: include !== false ? include : undefined,
            exclude
        })
    ];

    if (toES5) {
        rollupPlugins.push(babel())
    }

    gulp.task(taskName, () => {
        return gulp.src(entryFile)
            .pipe(isDevMode ? plumber() : noop())
            .pipe(rollup({
                plugins: rollupPlugins,
            }, {
                name: exportName,
                format,
                preferConst: true
            }))
            .pipe(outFile !== base ? rename(outFile) : noop())

            .pipe(gulp.dest(destPath))
            .pipe(minify ? terser({
                ext: {
                    min: '.min.js'
                },

                noSource: true
            }) : noop())
            .pipe(minify ? gulp.dest(destPath) : noop());
    });

    return taskName;
}

const webserver= ()=>{
    connect()
        .use(serveStatic('./'))
        .use(serveStatic('./public'))
        .use(serveStatic('./dist'))
        .use(serveStatic('./src'))
        .use(serveStatic('./test'))
        .listen(PORT);

    console.log(`Server listening on http://localhost:${PORT}`);
};

const buildTask = createBuildTask(ENTRY_FILE, {exportName: EXPORT_NAME || toCamelCase(BASE_NAME), toES5: true, minify: true});
const buildTaskES = createBuildTask(ENTRY_FILE, {format: 'esm', minify: true});
const buildTaskCJS = createBuildTask(ENTRY_FILE, {format: 'cjs', minify: false});

const runTests= (done)=>{
    exec('npm run tests:run', (err, stdout) => {
        console.log(`test:\n ${stdout}`);

        if(isDevMode){
            done();
        }else{
            done(err);
        }
    });
};

const build= gulp.parallel(buildTask, buildTaskES, buildTaskCJS);

const setDevEnv= (done)=> {
    isDevMode= true;
    done();
};

const watchSources= (done)=>{
    console.log('Sources watcher started');
    gulp.watch('./src/**/*.js', gulp.series(build, runTests), function (file) {
        console.log(`File [${file.path}] has been changed`);
    });
    done();
};

const watchTests= (done)=>{
    console.log('Tests watcher started');
    gulp.watch('./test/*.js', runTests, function (file) {
        console.log(`File [${file.path}] has been changed`);
    });
    done();
};

const watch= gulp.series(watchSources, watchTests);

const dev= gulp.series(setDevEnv, build, gulp.parallel(runTests, webserver, watch));

module.exports= {
    default: dev,
    build,
    dev
};





