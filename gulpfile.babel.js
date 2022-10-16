"use strict";
import pkg from 'gulp';

const {task, parallel, watch, series, lastRun, src, dest} = pkg;

/**
 * Пакеты для обоработки стилей
 * */
import csscomb from 'gulp-csscomb';  //Сортирует css свойства
import csso from 'gulp-csso';  //Оптимизация css
import dependents from '@ngocsangyem/gulp-dependents'; //Проверяет зависимости в файле
import gulpPostcss from 'gulp-postcss'; //Пост обработка файлов css
import postcss from 'postcss'; //Пост обработка файлов css
import gulpSass from 'gulp-sass'; //Обработка sass/scss файлов, и перекомпиляция в css
import dartSass from 'sass'; //Обработка sass/scss файлов
const sass = gulpSass(dartSass);
import cssnano from 'cssnano'; //Минификация стилей
import flexFix from 'postcss-flexbugs-fixes'; //Фикс частых ошибок при использовании FlexBox
import sassInheritance from 'gulp-sass-inheritance'; //Проверяет зависимости в файлах scss
import groupmedia from 'gulp-group-css-media-queries'; // Групируем media-queries
import sourcemaps from 'gulp-sourcemaps'; //Создает карту css свойст
import autoprefixer from 'autoprefixer'; //Добавление поефикса(флага) для свойст если нужно

/**
 * Пакеты для обоработки html
 * */
import gulpHtmlPicture from 'gulp-html-picture'; //Превратить <img> => <picture> конструкцию с форматами webp и avif
import fileInclude from 'gulp-file-include'; // Подключение html секций
import prettyHtml from 'gulp-pretty-html'; // Пакет позволяет сделать html красивым

/**
 * Пакеты для обоработки JavaScrips
 * */
import babel from 'gulp-babel'; //Для того что бы писать современный код.
import concat from 'gulp-concat'; //Склеиваем файлы в один
import terser from 'gulp-terser'; //Минифицирует  JavaScrips + поддержка es6

/**
 * Пакеты для обоработки изображений
 * */
import size from 'gulp-size'; //Определения размера оптимизированных картинок
import imagemin from 'gulp-imagemin'; //Оптимизация картинок
import imageminOptipng from 'imagemin-optipng'; //Оптимизация картинок png
import imageminMozjpeg from 'imagemin-mozjpeg'; //Оптимизация картинок jpg
import imageminSvgo from 'imagemin-svgo'; //Оптимизация картинок svg
import webp from 'gulp-webp'; //Конвертировать картинки формата png|jpg|jpeg => webp
import avif from 'gulp-avif'; //Конвертировать картинки формата png|jpg|jpeg => avif

/**
 * Пакеты для обоработки шрифтов
 * */
import ttf2woff from 'gulp-ttf2woff'; //Конвертировать шрифт ttf => woff
import ttf2woff2 from 'gulp-ttf2woff2'; //Конвертировать шрифт ttf => woff2

/**
 * Пакеты для работы с спрайтами
 * */
import svgSprite from 'gulp-svg-sprite'; //Генерация спрайтов
import replace from 'gulp-replace';  // Поиск селекторов по html

/**
 * Пакет для создания сервера
 * */
import browserSync from 'browser-sync'; //Локальный сервер что бы сразу видить свои изменения

/**
 * Вспомогательные пакеты
 * */
import mode from 'gulp-mode'; //mode помогает создавать интерактивные аргументы для командной строки, на пример: production что бы запустить сборку под таким флагом мы прописываем консоль команду gulp dev --production где  --production это аргумент который отрабатывает во всех gulpIf
import gulpif from 'gulp-if'; // if для создания условий при которых выполнится пакет
import { deleteAsync } from 'del'; // Удаление файлов
import notify from 'gulp-notify'; // Подключение уведомления об ошибках в файле
import plumber from 'gulp-plumber'; // Подключение уведомления об ошибках в файле
import rename from 'gulp-rename'; // Переименование файла
import debug from 'gulp-debug'; // Вспомогательные сообщения в консоле
import chalk from 'chalk'; // Редактирование текста в консоле
import log from 'fancy-log'; // Консоль лог в консоле
import {accessSync, readFileSync, writeFile, readdir, appendFile, constants} from 'fs'; // Пакет для работы с файлами

/**
 * Конфиги
 * */
import {paths} from './global.paths.config.js';
import {pngOptions} from './gulp/configs/pngOptions.js';
import {mozjpegOptions} from './gulp/configs/mozjpegOptions.js';
import {webpOptions} from './gulp/configs/webpOptions.js';
import {avifOptions} from './gulp/configs/avifOptions.js';
import {svgOptions} from './gulp/configs/svgOptions.js';

const devMode = mode({
	mode: ["production", "development"],
	default: "development",
	verbose: false
}); // аргументы для командной строки что бы выполнить сборку в production версии в таком случаи выполнится условие devMode.production(imagemin()) и подобные ему


task('html', () => {
	return src([`${paths.src}/*.html`])
		.pipe(devMode.production(replace(/<link rel="stylesheet" type="text\/css" href=".\/css\/style.css">/g, () => { // Поиск тег link с ссылкой ./css/style.css
			return '<link rel="stylesheet" type="text/css" href="./css/style.min.css">'; // и меняем ./css/style.css => ./css/style.min.css
		})))
		.pipe(fileInclude()) // ищет подобніе записи @@include('./views/header.html') и вставляет содержимое кусков html в итоговый файл
		.pipe(prettyHtml({
			indent_size: 4,
			indent_char: ' ',
			unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
		})) // Делаем html красивым с правильной иерархией вложености
		.pipe(dest(paths.dist))
		.pipe(browserSync.stream());// Триггерим Browsersync для обновления страницы
});

task('html:picture', () => {
	return src([paths.dist + '/*.html'], {
		since: lastRun('html:picture')
	})
		.pipe(devMode.production(gulpHtmlPicture({
			webp: true,
			avif: true,
			noPicture: 'no_picture'
		}))) // проверяем html файл на наличие <img src="./images/certified/amazon.png" alt=""> и делает конструкцию <picture>
		.pipe(dest(paths.dist))
});

task('clean', () => {
	return deleteAsync(["./dist"], {since: lastRun('clean')}); // удаляет папку dist
});

task('sass', () => {
	// Post-CSS plugins array
	const processors = [
		// auto fix some flex-box issues
		flexFix(),
		// auto adds vendor prefixes
		autoprefixer({
			grid: true,
			cascade: true
		})
	];

	return src([paths.src + '/styles/**/*.scss'
	], {since: lastRun('sass')})
		.pipe(
			plumber({
				errorHandler: notify.onError(err => ({
					title: "sass",
					message: err.message
				}))
			})
		) // Window notification
		.pipe(devMode.development(sourcemaps.init()))
		.pipe(dependents()) //Проверяет зависимости в файле
		.pipe(sassInheritance({dir: paths.src + '/styles/'})) //Проверяет зависимости в файлах scss
		.pipe(sass.sync({
			sourceComments: false,
			outputStyle: "expanded"
		}).on('error', sass.logError))
		.pipe(groupmedia()) //групируем медия выражения
		.pipe(devMode.production(debug({title: chalk.cyan.bold(`-> Start style minification`)})))
		.pipe(devMode.production(gulpPostcss(processors))) //делаем проверку стилей на ошибки flexBox и добавляем браузерную приставку
		.pipe(devMode.production(csscomb())) // Format CSS coding style with
		.pipe(devMode.production(csso({
			restructure: true,
			sourceMap: true,
			debug: false
		}))) // делаем проверку стилей
		.pipe(devMode.production(gulpPostcss([cssnano])))  // делаем минификацию файлов
		.pipe(devMode.production(rename({suffix: ".min"}))) // переименовываем файл
		.pipe(devMode.development(sourcemaps.write('.')))
		.pipe(plumber.stop())
		.pipe(dest(paths.dist + '/css/'))
		.pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
});

task('image', () => {
	return src(paths.src + '/images/**/*.+(png|jpg|jpeg|svg)', {since: lastRun('image')})
		.pipe(
			plumber({
				errorHandler: notify.onError(error => ({
					title: 'Image',
					message: error.message /*+ '<%= file.relative %>'*/
				}))
			})
		) // Window notification
		.pipe(devMode.production(imagemin([
			imageminOptipng({pngOptions}), // оптимизируем файлы png
			imageminMozjpeg({mozjpegOptions}), // оптимизируем файлы jpg
			imageminSvgo({plugins: svgOptions}) // оптимизируем файлы svg
		])))
		.pipe(plumber.stop())
		.pipe(dest(paths.dist + '/images/'))
		.pipe(size({title: '[images]'})) // получаем размер файлов
		.pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
});

task('image:webp', () => {
	return src(paths.src + '/images/**/*.+(png|jpg|jpeg)', {since: lastRun('image:webp')})
		.pipe(
			plumber({
				errorHandler: notify.onError(error => ({
					title: 'image:webp',
					message: error.message /*+ '<%= file.relative %>'*/
				}))
			})
		) // Window notification
		.pipe(devMode.production(webp({webpOptions}))) // Оптимизация webp & конвертация jpg/png to webp
		.pipe(plumber.stop())
		.pipe(dest(paths.dist + '/images/'))
		.pipe(size({title: '[images]'})) //Размер картинок
		.pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
});

task('image:avif', () => {
	return src(paths.src + '/images/**/*.+(png|jpg|jpeg)', {since: lastRun('image:avif')})
		.pipe(
			plumber({
				errorHandler: notify.onError(error => ({
					title: 'image:avif',
					message: error.message /*/!*+ '<%= file.relative %>'*!/*/
				}))
			})
		) // Window notification
		.pipe(devMode.production(avif({avifOptions}))) // Конвертация jpg/png to avif
		.pipe(plumber.stop())
		.pipe(dest(paths.dist + '/images/'))
		.pipe(size({title: '[images]'})) //Размер картинок
		.pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
});

task('images', series('image', 'image:webp', 'image:avif'));

task('sprite', () => {
	return src([`${paths.src}/images/sprites/**/*.svg`, `!${paths.src}/images/sprites/sprite.svg`], {since: lastRun('sprite')})
		.pipe(
			plumber({
				errorHandler: notify.onError(error => ({
					title: 'sprite',
					message: error.message /*/!*+ '<%= file.relative %>'*!/*/
				}))
			})
		) // Window notification
		.pipe(
			svgSprite({
				log: 'info',
				shape: {
					id: {
						separator: '-',
						generator: 'svg-%s'
					},
					transform: [
						/!*{ svgo: {} },*/

						// { custom: function (shape, spriter, callback) {
						// 		let old = shape.setNamespace;
						// 		shape.setNamespace = function(ns) {
						// 			return old.call(shape, name + ns);
						// 		};
						// 		callback(null);
						// }},
					]
				},
				svg: {
					transform: [
						function(svg) {
							const defsRegex = /<defs[^>]*>.+?<\/defs>/g;
							const defs = svg.match(defsRegex);

							if (defs) {
								svg = svg.replace(defsRegex, '');
								svg = svg.replace('<symbol ', defs.join('') + '<symbol ');
							}

							return svg;
						}
					]
				},
				mode: {
					symbol: {
						dest: '',
						sprite: paths.src + '/images/sprites/sprite.svg',
						inline: true,
						render: {
							scss: {
								template: 'gulp/sprite/tmpl_scss.mustache',
								dest: paths.src + '/styles/sprites/_sprite.scss'
							}
						}
					}
				},
				variables: {
					baseFz: 20,
					prefixStatic: 'svg-'
				}
			})
		)
		.pipe(plumber.stop())
		.pipe(dest('.'))
});

task('svg_inline', () => {
	let spritesDotSVG;
	try {
		accessSync(`${paths.src}/images/sprites/sprite.svg`, constants.R_OK | constants.W_OK);
		spritesDotSVG = true;
	} catch (err) {
		console.error(chalk.cyan.red('-> File sprites not generated'));
		spritesDotSVG = false;
	} // Делам проверку для того что определить есть ли файл sprite.svg
	return src(`${paths.dist}/index.html`)
		.pipe(
			plumber({
				errorHandler: notify.onError(error => ({
					title: 'svg_inline',
					message: error.message /*/!*+ '<%= file.relative %>'*!/*/
				}))
			})
		) // Window notification
		.pipe(gulpif(spritesDotSVG, replace(/<div id="svg_inline">(?:(?!<\/div>)[^])*<\/div>/g, () => { // Поиск div с id svg_inline для того что бы вставить содержимое файла ./images/sprite_src/sprite.svg
			const svgInline = readFileSync(`${paths.src}/images/sprites/sprite.svg`, 'utf8');  // Открываем файл
			return '<div id="svg_inline">\n' + svgInline + '\n</div>';          // Вставляем в div с id svg_inline содержимое файла ./images/sprite_src/sprite.svg
		})))
		.pipe(prettyHtml({
			indent_size: 4,
			indent_char: ' ',
			unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
		}))// Делаем html красивым с правильной иерархией вложености
		.on('error', err => {
			if (err.message === 'no such file or directory')
				log.error(err.message);
		})
		.pipe(plumber.stop())
		.pipe(dest(paths.dist));
});

task('sprites', series('sprite', 'svg_inline'));

task('js', () => {
	return src([paths.src + '/scripts/**/*.js'], {since: lastRun('js')})
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: "javascript",
				message: err.message
			}))
		})) // Window notification
		.pipe(devMode.development(sourcemaps.init()))
		.pipe(concat('scripts.js')) // Склеиваем файлы в один
		.pipe(babel({
			presets: ['@babel/preset-env']
		})) // Обрабатываем js код бейблом
		.pipe(devMode.production(debug({title: chalk.cyan.bold(`-> Start scripts minification`)})))
		.pipe(devMode.production(terser())) // Минифицируем js код
		.pipe(devMode.development(sourcemaps.write('.')))
		.pipe(plumber.stop())
		.pipe(dest(paths.dist + '/js/'))
		.pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
});

task('serve', () => {
	return browserSync.init({
		server: {
			baseDir: ['dist']
		},
		port: 9000,
		open: true
	});
});

task('fonts:ttf2woff', (cb) => {
	src(paths.src + '/fonts/**/*.ttf')
		.pipe(ttf2woff())  // генерация шрифта из ttf => woff
		.pipe(rename((path) => {
			path.dirname = `/${path.basename.split("-")[0]}/${path.basename.split("-")[1]}/`;
			path.basename = path.basename.split("-")[0];
		})) /* получаем вот такую структуру файлов при работе с шрифтами, автоматически пересабираем в более удобное хранение шрифтов dist/fonts/Montserrat/Bold/Montserrat.woff*/
		.pipe(dest(paths.dist + '/fonts/'))
	cb()
})

task('fonts:ttf2woff2', (cb) => {
	src(paths.src + '/fonts/**/*.ttf')
		.pipe(ttf2woff2()) // генерация шрифта из ttf => woff2
		.pipe(rename((path) => {
			path.dirname = `/${path.basename.split("-")[0]}/${path.basename.split("-")[1]}/`;
			path.basename = path.basename.split("-")[0];
		}))
		.pipe(dest(paths.dist + '/fonts/'))
	cb()
})

function fontsStyle(cb) {
	const weightFont = {
		'Thin': '100',
		'Light': '300',
		'Regular': '400',
		'Medium': '500',
		'SemiBold': '600',
		'Bold': '700',
		'ExtraBold': '800',
		'Black': '900'
	}; /* Обьект с толщинами для шрифтов  */

	/**
	 * font Extensions
	 *
	 * ['.eot', '.svg', '.ttf', '.woff', '.woff2']
	 *
	 * */

	const EOT = '.eot';
	const SVG = '.svg';
	const TTF = '.ttf';
	const WOFF = '.woff';
	const WOFF2 = '.woff2';

	writeFile(paths.src + "/styles/base/_fonts.scss", "", cb) /* очищает файл */
	return readdir(paths.src + "/fonts/", (err, fonts) => {  /* заполняем файл */
		if (fonts) {
			let current_fontName;
			fonts.forEach((font) => {
				if (font.includes(EOT) || font.includes(SVG) || font.includes(TTF) || font.includes(WOFF) || font.includes(WOFF2)) {
					let fullFontName = font.split("."); /* разбиваем имя файла и типа Montserrat-Black.ttf => ['Montserrat-Black', 'ttf'] */
					let fontNameWeight = fullFontName[0]; /* Получаем имя файла без его типа Montserrat-Black.ttf => Montserrat-Black */
					let fontName = fontNameWeight.split("-")[0]; /* Разбиваем полное имя файла на составные части и берем только его имя */
					let fontWeight = fontNameWeight.split("-")[1]; /* Разбиваем полное имя файла на составные части и берем только его размер шрифта */

					if (current_fontName !== fontNameWeight) {
						appendFile(
							paths.src + "/styles/base/_fonts.scss",
							`@include font("${fontName}", "${fontWeight}", "${weightFont[fontWeight]}", "normal");\r\n`,
							cb
						);
					}
					current_fontName = fontNameWeight;
				}
			});
		}
	});
}

task('fonts', parallel('fonts:ttf2woff', 'fonts:ttf2woff2', fontsStyle));

task('pages', series('html', 'svg_inline', 'html:picture'));

task('watchers', () => {
	watch('./src/styles/**/*.scss', parallel('sass')).on('change', browserSync.reload);
	watch('./src/images/sprites/**/*.svg', parallel('js')).on('change', browserSync.reload);
	watch('./src/**/*.html', parallel('pages')).on('change', browserSync.reload);
	watch('./src/images/**/*.+(png|jpg|jpeg|svg)', series('images', 'pages')).on('change', browserSync.reload);
	watch('./src/scripts/**/*.js', series('sprite', 'svg_inline'));
	watch('./src/fonts/**/*.ttf', parallel('fonts'));
	watch('./dist/**/*.html').on('change', browserSync.reload);
});

task('dev', series('clean', 'html', 'sprites', 'html:picture', 'fonts', 'js', parallel('sass', 'images')));

task('default', series('dev', parallel('serve', 'watchers')));
