const clean = require('gulp-clean')
const fs = require('fs')
const gulp = require('gulp')
const mocha = require('gulp-mocha')
const ts = require('gulp-typescript')
const sm = require('gulp-sourcemaps')

const tsOptions = JSON.parse(fs.readFileSync('tsconfig.json')).compilerOptions
const tsWithTarget = (target, module, extra) => ts(Object.assign(tsOptions), { module, target }, extra)
const distTask = (target, module) => [ `dist-${target}-${module}`, () =>
	gulp.src('src/index.ts')
		.pipe(sm.init())
		.pipe(ts(Object.assign({}, tsOptions, { module, target })))
		.pipe(sm.write())
		.pipe(gulp.dest(`dist/${target}-${module}`))
]
const dists = [['es2015', 'es2015'], ['es2015', 'commonjs'], ['es2015', 'amd']].map((pair) => distTask(...pair))
dists.forEach(pair => gulp.task(...pair))
gulp.task('package', dists.map(pair => pair[0]))

gulp.task('test', ['dist-es2015-commonjs'], () =>
	gulp.src(['test/*.ts'])
		.pipe(ts(Object.assign(tsOptions, { declaration: false })))
		.pipe(gulp.dest(`tmp`))
		.pipe(mocha())
)

gulp.task('clean', () => gulp.src(['dist', 'tmp']).pipe(clean()))
