//angular.module('CFG', [])
app

.constant('CFG.package', {name:'smartUp',version:'0.0.4',company:'Sistemi Solari Rossi',author:'Marco Solari <marcosolari@gmail.com>',repository:{type:'git',url:'git://github.com/sistemisolarirossi/smartUp.git'},dependencies:{'imagemin-gifsicle':'~1.0.0','grunt-ng-constant':'~1.0.0'},devDependencies:{grunt:'^0.4.1','grunt-autoprefixer':'^0.7.3','grunt-concurrent':'^0.5.0','grunt-contrib-clean':'^0.5.0','grunt-contrib-concat':'^0.4.0','grunt-contrib-connect':'^0.7.1','grunt-contrib-copy':'^0.5.0','grunt-contrib-cssmin':'^0.9.0','grunt-contrib-htmlmin':'^0.3.0','grunt-contrib-imagemin':'^0.7.0','grunt-contrib-jshint':'^0.10.0','grunt-contrib-uglify':'^0.4.0','grunt-contrib-watch':'^0.6.1','grunt-filerev':'^0.2.1','grunt-google-cdn':'^0.4.0','grunt-newer':'^0.7.0','grunt-ngmin':'^0.0.3','grunt-svgmin':'^0.4.0','grunt-usemin':'^2.1.1','grunt-wiredep':'^1.7.0','jshint-stylish':'^0.2.0','load-grunt-tasks':'^0.4.0','time-grunt':'^0.3.1','grunt-karma':'^0.8.3','karma-phantomjs-launcher':'^0.1.4',karma:'^0.12.17','karma-jasmine':'^0.1.5','grunt-favicons':'~0.6.4',phantomjs:'~1.9.7-14','grunt-auto-install':'^0.1.1','grunt-remove-logging':'~0.2.0','grunt-exec':'^0.4.6','grunt-angular-gettext':'~0.2.15'},engines:{node:'>=0.10.0'},scripts:{test:'grunt test'}})
.constant('CFG', {
  'APP_LOGO': 'icons/logo.png',
  'CFG.FIREBASE_URL': 'https://smartup.firebaseio.com/',
  'CFG.SYSTEM_EMAIL': 'sistemisolarirossi@gmail.com',
  'CFG.APPCACHE': false,
  'CFG.DEBUG': true
});