'use strict';
 
app.factory('I18N', function ($rootScope, $window, $route, $http, CFG, gettext, gettextCatalog, tmhDynamicLocale) {
  var defaultLanguage = 'en';

  $rootScope.$on('$localeChangeSuccess', function () { $route.reload(); });

  var I18N = {
    init: function() {
      return {
        selectedLanguage: this.setCurrentLanguage(),
        supportedLanguages: this.getSupportedLanguages(),
        supportedLanguagesSorted: this.getSupportedLanguagesSorted(),
        selectingLanguageFlag: false,
      };
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
    getSupportedLanguagesSorted: function () {
      var languages = this.getSupportedLanguages();
      var sortable = [];
      for (var language in languages) {
        sortable.push({key: language, des: languages[language]});
      }
      sortable.sort(function(a, b) { return (a.des < b.des) ? -1 : (a.des > b.des) ? 1 : 0; });
      return sortable;
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
      return this.getSupportedLanguages()[this.getCurrentLanguage()];
    },
    getCurrentLanguageFlag: function() {
      return 'icons/flags/' + this.getCurrentLanguage() + '.png';
    },
    getCurrentLanguageScript: function() {
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
      if (this.currentLanguage !== previousLanguage) {
        if (this.currentLanguage !== this.getDefaultLanguage()) {
          // switch language translation strings
          gettextCatalog.setCurrentLanguage(this.currentLanguage);
          gettextCatalog.loadRemote('i18n/' + this.currentLanguage + '.json');
        }

        // switch locale
        gettextCatalog.debug = CFG.debug;
        gettextCatalog.setCurrentLanguage(this.currentLanguage);
        tmhDynamicLocale.set(this.currentLanguage);
      }
      return this.currentLanguage;
    },
  };

  return I18N;
});