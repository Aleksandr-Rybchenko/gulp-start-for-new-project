# Gulp Starter
## :fire: Особенности
* используется препроцессор [SCSS](https://sass-lang.com/)
* используется транспайлер [Babel](https://babeljs.io/) для поддержки современного JavaScript (ES6) в браузерах

## :hammer_and_wrench: Установка
* установите [NodeJS](https://nodejs.org/en/)
* Должна быть от 16 и выше версии
* Версия NodeJS

`node -v`

* Установите глобально:
    * [Gulp](https://gulpjs.com/): ```npm i -g gulp```
    * Версия Gulp

`gulp -v`

```
CLI version: 2.3.0
Local version: 4.0.2
```

* CLI version это установка глобально пакета gulp-cli

`npm install --global gulp-cli`

* скачайте сборку с помощью [Git](https://git-scm.com/downloads): ```git clone https://gitlab.com/igor_dan/gulp-starter```
* перейдите в скачанную папку со сборкой: ```cd gulp-starter```
* скачайте необходимые зависимости: ```npm i или npm i --unsafe-perm```
* чтобы начать работу, введите команду: ```npm run dev``` (режим разработки c watchers )
* чтобы начать работу, введите команду: ```npm run start``` (режим разработки)
* чтобы собрать проект, введите команду ```npm run build``` (режим сборки)


## :open_file_folder: Файловая структура

```
gulp-starter
├── dist
├── gulp
├── src
│   ├── fonts
│   ├── images
│   │  ├── favicons
│   │  └── sprites
│   ├── scripts
│   ├── styles
│   │  ├── base
│   │  ├── blocks
│   │  ├── functions
│   │  ├── mixins
│   │  ├── sections
│   │  ├── sprites
│   │  └── variables
│   └── views
│   │  └── pages
├── gulpfile.babel.js
├── package.json
├── global.paths.config.js
├── .editorconfig
├── .babelrc.js
├── .eslintrc.json
├── .stylelintrc
├── .stylelintignore
└── .gitignore
```

* Корень папки:
	* ```.babelrc.js``` — настройки Babel
	* ```.gitignore``` – запрет на отслеживание файлов Git'ом
	* ```gulpfile.babel.js``` — настройки Gulp
	* ```global.paths.config.js``` — конфиг с глобальным обьектом путей в проекте
	* ```package.json``` — список зависимостей
* Папка ```src``` - используется во время разработки:
    * шрифты: ```src/fonts```
    * изображения: ```src/images```
      * изображения svg sprites: ```src/images/sprites```
    * JS-файлы: ```src/scripts```
    * SCSS-файлы: ```src/styles```
      * base -- SCSS-файлы общие для всего проекта: ```src/styles/base```
      * blocks -- SCSS-файлы самодостаточных блоков: ```src/styles/blocks```
      * functions -- SCSS-файлы вспомогательные функции для облегчения верстки: ```src/styles/functions```
      * mixins -- SCSS-файлы вспомогательные для облегчения верстки: ```src/styles/mixins```
      * sections -- SCSS-файлы самодостаточных секций: ```src/styles/sections```
      * sprites -- SCSS-файл сгенерированный файл таской спрайт: ```src/styles/sprites```
      * variables -- SCSS-файлы с переменными: ```src/styles/variables```
    * HTML-файлы: ```src/views```
      * страницы сайта: ```src/views/pages```
* Папка ```dist``` - папка, из которой запускается локальный сервер для разработки (при запуске ```npm run dev```)
* Папка ```gulp``` - папка с Gulp-тасками или конфигурациями

## :keyboard: Команды
* ```npm run lint:styles``` - проверить SCSS-файлы. Для VSCode необходимо установить [плагин](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint). Для WebStorm
  или PHPStorm необходимо включить Stylelint в ```Languages & Frameworks - Style Sheets - Stylelint```
* ```npm run setup``` - установить все зависимости проекта
* ```npm run update:outdated``` - проверить версии пакетов
* ```npm run update:start``` - проверить версии пакетов и установить их
* ```npm run dev``` - запуск сервера для разработки проекта c watchers
* ```npm run start``` - собрать проект в dist
* ```npm run build``` - собрать проект с оптимизацией без запуска сервера production version
* ```npm run build:html``` - собрать HTML-файлы
* ```npm run build:styles``` - скомпилировать SCSS-файлы
* ```npm run build:scripts``` - собрать JS-файлы
* ```npm run build:images``` - собрать изображения и оптимизировать картинки сгенерировать webp & avif форматы
* ```npm run build:sprites```- собрать спрайты
* ```npm run build:fonts``` - собрать шрифты
* ```npm run start:serve``` - старт сервера
* ```npm run start:watchers``` - старт вотчера
* ```npm run lint:styles --fix``` - исправить ошибки в SCSS-файлах согласно настройкам Stylelint
* ```npm run lint:scripts``` - проверить JS-файлы
* ```npm run lint:scripts --fix``` - исправить ошибки в JS-файлах согласно настройкам ESLint
## :bulb: Рекомендации по использованию
### Шрифты
* шрифты находятся в папке ```src/fonts```
	* используйте [форматы](https://caniuse.com/#search=woff) ```.woff``` и ```.woff2```
	* шрифты подключаются в файл ```src/styles/base/_fonts.scss```

### Изображения
* изображения находятся в папке ```src/images```
    * изображения автоматически конвертируются в формат ```.webp и в .avif```
    * изображение для генерации фавиконок должно находиться в папке ```src/images/favicon``` и иметь размер не менее ```1024px x 1024px```
    * изображение для генерации спрайта должно находиться в папке ```src/images/sprites``` в которой можно разделить по категориям спрайты ```main, products, socials```
	Чтобы вставить изображение формата ```.webp и .avif```
    * [WebP image format](https://caniuse.com/webp)
    * [AVIF image format](https://caniuse.com/avif)
    * Плагин который делает структуру ```<picture></picture>``` [gulp-html-picture](https://github.com/tobolyakov/gulp-html-picture)
```html
// Input
<img src="/images/gallery.jpg">

// Output
<picture>
	<source srcset="/images/gallery.webp" type="image/webp">
	<source srcset="/images/gallery.avif" type="image/avif">
	<img src="/images/gallery.jpg">
</picture>
```

Чтобы вставить обычные изображение без конструкции ``` <picture>```

```html
<img src="/images/gallery.jpg" class="no_picture">
```

### SVG-спрайты

Для создания спрайтов изображения ```.svg``` должны находиться в папке ```src/images/sprites```  в которой можно разделить по категориям спрайты ```main, products, socials```.
После генерации спрайта появится файл ```sprite.svg``` в папке ```src/images/sprites```, а так же файл стилей ```_sprite.scss``` в ```src/styles/sprites```. После содежимое файла ```sprite.svg``` в html в div с классом ```svg_inline```
Например, у нас есть файлы ```logo.svg```, ```icon-2.svg``` и ```icon-3.svg```, и мы должны обратиться к ```logo.svg```. Для этого в HTML нужно воспользоваться тегом ```<use>```:

```html
<div id="svg_inline">
	<svg width="0" height="0" style="position:absolute">
		<symbol viewBox="0 0 24 24" id="svg-main-logo" xmlns="http://www.w3.org/2000/svg"><path d="M17.8 5.8h-1.6C16.1 3.8 14.3 2 12 2 9.7 2 7.8 3.8 7.8 5.8H6.2c-2.1 0-3.2 1-3.2 3V19c0 2 1.1 3 3.2 3h11.9c1.8 0 2.9-1 2.9-3V8.8c0-2-1.1-3-3.2-3zM12 3.5c1.4 0 2.5 1 2.6 2.3H9.4c.1-1.3 1.2-2.3 2.6-2.3zm7.4 15.4c0 1-.6 1.5-1.3 1.5H6.2c-1 0-1.6-.5-1.6-1.5v-10c0-1 .6-1.5 1.6-1.5h11.6c1 0 1.6.5 1.6 1.5v10z" fill-rule="evenodd" clip-rule="evenodd"/></symbol>
	</svg>
</div>
<span class="svg-main-logo">
	<svg><use xlink:href="#svg-main-logo"></use></svg>
</span>
```
Изменить стили svg-иконки из спрайта в CSS:
```css
.svg-main-logo {
    fill: red;
}
```
Бывает такая ситуация, когда стили иконки поменять не получается. Это связано с тем, что при экспорте из Figma в svg добавляется лишний код. Например:
```html
<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.90918 4.04542L13.091 9.54088L4.90918 14.9545L4.90918 4.04542Z" fill="#1B1B1D"/>
</svg>
```
Нужно удалить ```fill="none"``` и ```fill="#1B1B1D"```. Должно получиться так:
```html
<svg width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.90918 4.04542L13.091 9.54088L4.90918 14.9545L4.90918 4.04542Z"/>
</svg>
```

### Сторонние библиотеки
* все сторонние библиотеки устанавливаются в папку ```node_modules```
	* для их загрузки воспользуйтеcь командой ```npm i -D package_name``` (например, ```npm i -D jquery```)
	* для подключения JS-файлов библиотек импортируйте их в самом начале JS-файла, например:
    ```javascript
    import $ from "jquery";
    ```
	* для подключения стилевых файлов библиотек импортируйте их в файл ```src/styles/vendor/_libs.scss```
	* JS-файлы и стилевые файлы библиотек самостоятельно изменять нельзя

## Ошибки которые могут возникнуть

1. Python

   ```
   npm ERR! command failed
   npm ERR! command C:\WINDOWS\system32\cmd.exe /d /s /c node build.js || nodejs build.js
   npm ERR! gyp info it worked if it ends with ok
   npm ERR! gyp info using node-gyp@8.4.1
   npm ERR! gyp info using node@16.13.1 | win32 | x64
   npm ERR! gyp ERR! find Python
   npm ERR! gyp ERR! find Python Python is not set from command line or npm configuration
   npm ERR! gyp ERR! find Python Python is not set from environment variable PYTHON
   ```

   Если вот такой кусок ошибки то у вас нету пакета Python его нужно скачать с оф. сайта и установить. (Ошибка была замечена на Windows OS)

   Download Python | Python.org  https://www.python.org/downloads/

2. ES Module

    ```
    Error [ERR_REQUIRE_ESM]: require() of ES Module E:\gulp-starter\node_modules\gulp-imagemin\index.js from E:\gulp-starter\gulpfile.babel.js not supported.
    Instead change the require of index.js in E:\gulp-starter\gulpfile.babel.js to a dynamic import() which is available in all CommonJS module
    s.
    ```

Такое замечено с плагинами: gulp-imagemin, imagemin, chalk, imagemin, imagemin-mozjpeg, imagemin-optipng, imagemin-svgo
Что бы это решить:
1)можно откотится до старой версии если это gulp-imagemin, imagemin => 7v npm i -D gulp-imagemin@7.0.1;
2)Можно обновить package.json добавив строку "type": "module", нужно подключить babel и gulpfile.js, и переименовать в gulpfile.babel.js
все require заменить на import

3. Unsupported gulp version

   `gulp -v`

   ```
   CLI version: 2.3.0
   Local version: 1.0.0
   ```

   Нужно установить последнею версию gulp

   `npm i -D gulp`

   `gulp -v`

   Должен быть такой результат.

   ```
   CLI version: 2.3.0
   Local version: 4.0.2
   ```

## :point_right: Рекомендации

Для изучение Gulp лучше сначала посмотреть уроки Ильи Кантора

https://learn.javascript.ru/screencast/gulp а уже потом смотреть остальные.
