'use strict';
 
app.factory('I18N', function ($rootScope, $window, $route, CFG, gettext, gettextCatalog, tmhDynamicLocale) {
  var defaultLanguage = 'en';

  $rootScope.$on('$localeChangeSuccess', function () { $route.reload(); });

  var I18N = {
    t: function(string) {
      //return gettextCatalog.getString(string, null);
      return gettext(string);
    },
    getSupportedLanguages: function() {
      return { /* supported Languages */
        en: {
          name: 'English',
          flag: 'icons/flags/en.png',
          angularLocaleScript: 'scripts/18n/angular-locale_en.js',
        },
        de: {
          name: 'Deutsch',
          flag: 'icons/flags/de.png',
          angularLocaleScript: 'scripts/18n/angular-locale_de.js',
        },
        es: {
          name: 'Español',
          flag: 'icons/flags/es.png',
          angularLocaleScript: 'scripts/18n/angular-locale_es.js',
        },
        fr: {
          name: 'Français',
          flag: 'icons/flags/fr.png',
          angularLocaleScript: 'scripts/i18n/angular-locale_fr.js',
        },
        it: {
          name: 'Italiano',
          flag: 'icons/flags/it.png',
          angularLocaleScript: 'scripts/i18n/angular-locale_it.js',
        }
      };
    },
    getDefaultLanguage: function () {
      return defaultLanguage;
    },
    getBrowserLanguage: function () {
      return $window.navigator.userLanguage || $window.navigator.language;
    },
    getCurrentLanguage: function() {
      return this.currentLanguage ? this.currentLanguage : this.getDefaultLanguage();
    },
    getCurrentLanguageName: function() {
      return this.getSupportedLanguages()[this.getCurrentLanguage()].name;
    },
    getCurrentLanguageFlag: function() {
      return this.getSupportedLanguages()[this.getCurrentLanguage()].flag;
    },
    getCurrentLanguageScript: function() {
      return this.getSupportedLanguages()[this.getCurrentLanguage()].script;
    },
    setCurrentLanguage: function(language) {
      var previousLanguage = this.currentLanguage;
      if (language) {
        if (this.getSupportedLanguages()[language]) {
          this.currentLanguage = language;
        } else {
          this.currentLanguage = this.getDefaultLanguage(); // unsupported language...
        }
      } else { // no language specified: set current language from browser's language
        this.browserLanguage = this.getBrowserLanguage();
        this.currentLanguage = this.getDefaultLanguage();
        if (this.browserLanguage) {
          if (this.getSupportedLanguages()[this.browserLanguage]) {
            this.currentLanguage = this.browserLanguage;
          } else {
            var languageSimple = this.browserLanguage.replace(/-.*$/, '');
            if (this.getSupportedLanguages()[languageSimple]) {
              this.currentLanguage = languageSimple;
            }
          }
        }
      }
      if (previousLanguage !== this.currentLanguage) {
        gettextCatalog.debug = CFG.DEBUG;
        ////gettextCatalog.currentLanguage = this.currentLanguage;
        gettextCatalog.setCurrentLanguage(this.currentLanguage);
        tmhDynamicLocale.set(this.currentLanguage);
        //$route.reload();
      }
      return this.currentLanguage;
    },
    setNextLanguage: function () {
      // scan supported languages associative array and find lexically next language
      var languages = this.getSupportedLanguages();
      var keys = [];
      for (var key in languages) {
        if (languages.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      keys.sort();
      var nextLanguage;
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] === this.currentLanguage) {
          nextLanguage = keys[++i >= keys.length ? 0 : i];
          break;
        }
      }
      return this.setCurrentLanguage(nextLanguage);
    },
  };

  return I18N;
});

/*
  Multilingual date formats are:

  'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
  'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
  'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
  'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010)
  'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
  'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
  'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
  'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
*/