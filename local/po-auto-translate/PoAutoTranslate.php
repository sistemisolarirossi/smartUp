<?php

/**
 * Auto translate .po (gettext) files with google translate page
 */

  include "PoParser.php";
  
  $version = "0.1";

  $projectName = isset($argv[1]) ? $argv[1] : "defaultAppName";
  $projectDirectory = isset($argv[2]) ? $argv[2] : getcwd();
  $poDirectory = $projectDirectory . "/" ."po";
  $i18nAppDirectory = $projectDirectory . "/" . "app/scripts/i18n";
  $i18nSrcDirectory = $projectDirectory . "/" . "bower_components/angular-i18n";
  $translatorName = "PoAutoTranslate";
  $potTemplateFile = "template.pot";
  $sourceLanguage = "en";
  $googleSupportedLanguagesUrl = "https://translate.google.com/?hl=en";

  print "* PoAutoTranslate *" . "\n";

  /*
   * We process all Google supported languages
   */
  $languages = getSupportedLanguages($googleSupportedLanguagesUrl);
  foreach ($languages as $language => $languageName) {
    $language = strtolower($language);
    if ($language == $sourceLanguage) continue; # skip source language

    /* if existing, copy angular-locales from source dir to app dir, if not yet present there */
    if (!file_exists($i18nSrcDirectory. "/" . "angular-locale_" . $language . ".js")) {
      // source locale does not exist, Angular doesn't support it: skip this language
      continue;
    } else { // source locale does exist
      if (!file_exists($i18nAppDirectory. "/" . "angular-locale_" . $language . ".js")) {
        copy(
          $i18nSrcDirectory. "/" . "angular-locale_" . $language . ".js",
          $i18nAppDirectory. "/" . "angular-locale_" . $language . ".js"
        ) or
          die("Can't copy source i18n language $language locale file to app");
      } else {
        // destination exists already, ignore it
      }
    }

    print $language . " ";

    /* create a new language .po file header for this language, if it doesn't exist yet */
    createNewPo($language,
      array(
        "poDirectory" => $poDirectory,
        "projectName" => $projectName,
        "translatorName" => $translatorName,
      )
    );

    $poFilePath = "$poDirectory/$language.po";
    $poTemplatePath = "$poDirectory/$potTemplateFile";

    /* merge each language po file with templates pot file */
    system("msgmerge --no-wrap --sort-output --update --backup=off --quiet \"$poFilePath\" \"$poTemplatePath\"");

    /* parse each po entry and translate it, if empty */
    $poparser = new Sepia\PoParser();
    /*
      PoParser parse entries:
      $entry['msgid']     // message ID
      $entry['msgstr']    // translation
      $entry['reference'] // reference
      $entry['msgctxt']   // message context
      $entry['tcomment']  // translator comment
      $entry['ccomment']  // code comment
      $entry['obsolete']  // is obsolete?
      $entry['fuzzy']     // is fuzzy?
    */
    $entries = $poparser->parse($poFilePath);
    foreach ($entries as $entry) {
      for ($i = 0; isset($entry['msgid'][$i]); $i++) {
        $src = $entry['msgid'][$i];
        $dst = $entry['msgstr'][0]; # WAITING FOR AUTHOR ANSWER ABOUT MULTI-LINE ENTRIES...
        $fuzzy = isset($entry['fuzzy']);
        if ($src) {
          if (!$dst or $fuzzy) {
            // no translation, or fuzzy translation: translate it
            $dst = translate($src, $sourceLanguage, $language);

            // remove zero-space blanks
            $dst = str_replace('\\u200B', '', $dst);

            // keep capitalization
            if (startsUppercase($src) and startsLowercase($dst)) {
              $dst = mb_strtoupper(mb_substr($dst, 0, 1, "UTF-8"), "UTF-8") . mb_substr($dst, 1);
            }
            if (startsLowercase($src) and startsUppercase($dst)) {
              $dst = mb_strtolower(mb_substr($dst, 0, 1, "UTF-8"), "UTF-8") . mb_substr($dst, 1);
            }

            // remove extra spaces before punctuation marks
            $dst = preg_replace('/\s+([[:punct:]])/', '\\1', $dst);

/*
            if ($fuzzy) {
              print "{$dst}" . " ";
            } else {
              print "[$dst]" . " ";
            }
*/

            // update poParser entry with auto translated string
            $poparser->updateEntry($src, $dst);
          }
        }
        break; # waiting for author's explanation for multiline entries...
      }
    }
    // update poFile with poParser translated entries
    $translatedFilename = tempnam("/tmp", $language . ".po-");
    $poparser->write($translatedFilename);
    /* Sepia PoParser writes iso-8859-1: convert to UTF8 */
    fileEncodeToUTF8($translatedFilename);
    rename($translatedFilename, $poFilePath);
  }
  print "\n";



  /**
    * Create a new language .po file header, if it doesn't exist yet
    */
  function createNewPo($language, $params) {
    $filename = $params["poDirectory"] . "/" . $language . ".po";
    if (!file_exists($filename)) {
      if (($fh = fopen($filename, "w")) === false) {
        $lastError = error_get_last();
        die("Unable to create language file $filename (" . $lastError["message"] . ")");
      }
      $projectName = $params["projectName"];
      $potCreationDate = "";
      $poRevisionDate = "";
      $translatorName = $params["translatorName"];
      $languageTeam = "";
      $mimeVersion = "1.0";
      $contentType = "text/plain; charset=UTF-8";
      $contentTransferEncoding = "8bit";
      $pluralForms = "nplurals=2; plural=(n > 1);";
      $po = <<< EOT
msgid ""
msgstr ""
"Project-Id-Version: $projectName\\n"
"POT-Creation-Date: $potCreationDate\\n"
"PO-Revision-Date: $poRevisionDate\\n"
"Last-Translator: $translatorName\\n"
"Language-Team: $languageTeam\\n"
"Language: $language\\n"
"MIME-Version: $mimeVersion\\n"
"Content-Type: $contentType\\n"
"Content-Transfer-Encoding: $contentTransferEncoding\\n"
"Plural-Forms: $pluralForms\\n"
EOT;
      fwrite($fh, $po);
      fclose($fh);
    }
  }

  /**
    * Get all supported languages by google translate
    */
  function getSupportedLanguages($url) {
    $page = curl($url, array(), false);
    preg_match("/<select id=gt-sl.*?>(.*?)<\/select>/", $page, $matches);
    $options = $matches[1];
    preg_match_all("/<option value=(.*?)>(.*?)<\/option>/", $page, $matches, PREG_SET_ORDER);
    $languages = array();
    foreach ($matches as $item) {
      $languageCode = $item[1];
      $languageName = $item[2];
      if ($languageCode == "separator disabled") continue;
      $languages[$languageCode] = $languageName;
    }
    return $languages;
  }

  /**
    * Convert encoding of file to UTF-8, if needed
    */
  function fileEncodeToUTF8($filename) {
    # read in the contents
    $data = file_get_contents($filename);

    # convert the contents, if not already UTF-8
    if (
      !mb_check_encoding($data, 'UTF-8') or
      !($data ===
        mb_convert_encoding(
          mb_convert_encoding($data, 'UTF-32', 'UTF-8' ),
          'UTF-8', 'UTF-32')
        )
      ) {
        $data = mb_convert_encoding($data, 'UTF-8'); 
        file_put_contents($filename, $data);
    }
  }

  /**
    * Retrieve url contents (possibly using cookies)
    */
  function curl($url, $params = array(), $is_coockie_set = false) {
    if (!$is_coockie_set) {
      /* create a cookie file */
      $ckfile = tempnam('/tmp', 'CURLCOOKIE');
   
      /* visit the homepage to set the cookie properly */
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_COOKIEJAR, $ckfile);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      $output = curl_exec($ch);
    }
  
    $str = '';
    $str_arr = array();
    foreach ($params as $key => $value) {
      $str_arr[] = urlencode($key) . '=' . urlencode($value);
    }
    if (!empty($str_arr)) {
      $str = '?' . implode('&', $str_arr);
    }
  
    /* visit cookiepage.php */
    $ch = curl_init($url . $str);
    curl_setopt($ch, CURLOPT_COOKIEFILE, $ckfile);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   
    $retval = curl_exec($ch);
    unlink($ckfile);
    return $retval;
  }

  function translate($word, $languageFrom = 'en', $languageTo = 'it') {
    $word = urlencode($word);
    $url =
      'http://translate.google.com/translate_a/t?client=t&text=' .
      $word .
      '&hl=en&sl=' . $languageFrom . '&tl=' . $languageTo .
      '&multires=1&otf=2&pc=1&ssel=0&tsel=0&sc=1'
    ;
    $translation = curl($url);
    /* Google translate page returns a nonsense format answer... */
    preg_match("/\[\[(.*?)\]\]/", $translation, $matches);
    $m1 = $matches[1];
    preg_match_all("/\[\"(.*?)\",/", $m1, $matches);
    $m2 = $matches[1];
    $retval = implode('', $m2);
print $retval;
    return utf8_encode($retval);
  }

  function startsUppercase($str) {
    $chr = mb_substr($str, 0, 1, "UTF-8");
    return mb_strtolower($chr, "UTF-8") != $chr;
  }

  function startsLowercase($str) {
    $chr = mb_substr($str, 0, 1, "UTF-8");
    return mb_strtoupper($chr, "UTF-8") != $chr;
  }

?>
