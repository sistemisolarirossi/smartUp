'use strict';
 
app.factory('I18N', function ($rootScope, $window, $route, $http, CFG, gettext, gettextCatalog, tmhDynamicLocale) {
  var defaultLanguage = 'en';

  $rootScope.$on('$localeChangeSuccess', function () { $route.reload(); });

  var I18N = {
    // TODO: remove t() if unused...
    t: function(string) {
      //return gettextCatalog.getString(string, null);
      return gettext(string);
    },
    getSupportedLanguages: function() {
      return { /* supported languages: these are main world cultures (those supported by Google *and* Angular) */
        'af': 'Afrikaans',
        'ar': 'Arabic',
        'az': 'Azerbaijani',
        'be': 'Belarusian',
        'bg': 'Bulgarian',
        'bn': 'Bengali',
        'bs': 'Bosnian',
        'ca': 'Catalan',
        'cs': 'Czech',
        'cy': 'Welsh',
        'da': 'Danish',
        'de': 'German',
        'el': 'Greek',
        'en': 'English',
        'eo': 'Esperanto',
        'es': 'Spanish',
        'et': 'Estonian',
        'eu': 'Basque',
        'fa': 'Persian',
        'fi': 'Finnish',
        'fr': 'French',
        'ga': 'Irish',
        'gl': 'Galician',
        'gu': 'Gujarati',
        'ha': 'Hausa',
        'hi': 'Hindi',
        'hr': 'Croatian',
        'hu': 'Hungarian',
        'hy': 'Armenian',
        'id': 'Indonesian',
        'ig': 'Igbo',
        'is': 'Icelandic',
        'it': 'Italian',
        'iw': 'Hebrew',
        'ja': 'Japanese',
        'ka': 'Georgian',
        'km': 'Khmer',
        'kn': 'Kannada',
        'ko': 'Korean',
        'lo': 'Lao',
        'lt': 'Lithuanian',
        'lv': 'Latvian',
        'mk': 'Macedonian',
        'mn': 'Mongolian',
        'mr': 'Marathi',
        'ms': 'Malay',
        'mt': 'Maltese',
        'ne': 'Nepali',
        'nl': 'Dutch',
        'no': 'Norwegian',
        'pa': 'Punjabi',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'ro': 'Romanian',
        'ru': 'Russian',
        'sk': 'Slovak',
        'sl': 'Slovenian',
        'so': 'Somali',
        'sq': 'Albanian',
        'sr': 'Serbian',
        'sv': 'Swedish',
        'sw': 'Swahili',
        'ta': 'Tamil',
        'te': 'Telugu',
        'th': 'Thai',
        'tl': 'Filipino',
        'tr': 'Turkish',
        'uk': 'Ukrainian',
        'ur': 'Urdu',
        'vi': 'Vietnamese',
        'yo': 'Yoruba',
        'zh-cn': 'Chinese (Simplified)',
        'zh-tw': 'Chinese (Traditional)',
        'zu': 'Zulu',
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
      //return this.getSupportedLanguages()[this.getCurrentLanguage()].name;
      return this.getSupportedLanguages()[this.getCurrentLanguage()];
    },
    getCurrentLanguageFlag: function() {
      //return this.getSupportedLanguages()[this.getCurrentLanguage()].flag;
      return 'icons/flags/' + this.getCurrentLanguage() + '.png';
    },
    getCurrentLanguageScript: function() {
      //return this.getSupportedLanguages()[this.getCurrentLanguage()].script;
      return 'scripts/i18n/angular-locale_' + this.getCurrentLanguage() + '.js';
    },
    setCurrentLanguage: function(language) {
      var previousLanguage = this.currentLanguage;
      if (language) {
        if (this.getSupportedLanguages()[language]) {
          this.currentLanguage = language;
        } else { // unsupported language, use defauòt
          this.currentLanguage = this.getDefaultLanguage();
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
        // switch language translation strings
        gettextCatalog.setCurrentLanguage(this.currentLanguage);
        gettextCatalog.loadRemote('/i18n/' + this.currentLanguage + '.json');

        // switch locale
        gettextCatalog.debug = CFG.DEBUG;
        gettextCatalog.setCurrentLanguage(this.currentLanguage);
        tmhDynamicLocale.set(this.currentLanguage);
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
      var nextLanguage; // = keys[0]; // the default, in case current language is default la
//console.info(Object.keys(languages).length);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] === this.currentLanguage) {
          nextLanguage = keys[++i >= keys.length ? 0 : i];
          break;
        }
      }
//console.info(this.setCurrentLanguage(nextLanguage));
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