<?php

/**
 * Auto translate .po (gettext) files with google translate page
 */

  include "PoParser.php";
  
  $poDirectory = isset($argv[1]) ? $argv[1] : "/var/www/smartUp/po";
  $potTemplateFile = "template.pot";
  $sourceLanguage = "en";
  $googleSupportedLanguagesUrl = "https://translate.google.com/?hl=en";



  echo "*** PoAutoTranslate ***" . "\n";
  $languages = getSupportedLanguages($googleSupportedLanguagesUrl);

  foreach ($languages as $language => $languageName) {
    if ($language == $sourceLanguage) continue; # skip source language

    if ($language == "it") continue; # until this script is not stable, avoid breaking manually translated files

    /*
     * We currently process only po files existing in source directory;
     * we could instead handle all Google supported languages;
     * we would just need to build a new po file for each language
     * (with the 'Language' tag set), and add flags support in app...
     */
    if (!file_exists("$poDirectory/$language.po")) continue;

    print $language . "\n";

    /* merge each language po file with templates pot file */
    system("msgmerge --sort-output --update --backup=off --quiet \"$poDirectory/$language.po\" \"$poDirectory/$potTemplateFile\"");

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
    $entries = $poparser->parse("$poDirectory/$language.po");
    foreach ($entries as $entry) {
      for ($i = 0; isset($entry['msgid'][$i]); $i++) {
        $src = $entry['msgid'][$i];
        $dst = $entry['msgstr'][0]; # ???
        if ($src && !$dst) { // no translation: translate it
          $dst = translate($src, $sourceLanguage, $language);
          $poparser->updateEntry($src, $dst);
        }
        break; # waiting for author's explanation for multiline entries...
      }
    }
    $poparser->write("$poDirectory/$language-translated.po");

    /* Sepia PoParser writes iso-8859-1, convert to UTF8 */
    #system("iconv -f ISO_8859-1 -t UTF-8 \"$poDirectory/$language-translated.po\" > \"$poDirectory/$language.po\" && rm \"$poDirectory/$language-translated.po\"");
    encodeFile("$poDirectory/$language-translated.po", "ISO-8859-1", "UTF-8");
    rename("$poDirectory/$language-translated.po", "$poDirectory/$language.po");
  }



  /**
    * Create a new language .po file header
    */
  function createNewPo($language, ... TODO ...) {
    open $fh, ...
    print $fh <<<EOT
msgid ""
msgstr ""
"Project-Id-Version: smartUp\n"
"POT-Creation-Date: \n"
"PO-Revision-Date: \n"
"Last-Translator: Marco <marcosolari@gmail.com>\n"
"Language-Team: \n"
"Language: $language\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Plural-Forms: nplurals=2; plural=(n > 1);\n"
"X-Generator: Poedit 1.6.9\n"
"X-Poedit-SourceCharset: UTF-8\n"
EOT;
     close $fh;
  }

  /**
    * Get all supported languages by google translate
    */
  function getSupportedLanguages($url) {
    $page = curl($url, [], false);
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
    * Convert encoding of file
    */
  function encodeFile($filename, $encodingFrom, $encodingTo) {
    # read in the contents
    $data = file_get_contents($filename);

    # convert the contents, if not already UTF-8
    if (($encodingTo != "UTF-8") || !detectUTF8($data)) {
      $data = iconv($encodingFrom, $encodingTo, $data);

      # write back to the same file
      file_put_contents($filename, $data);
    }
  }

  function detectUTF8($data) {
    return preg_match('%(?:
      [\xC2-\xDF][\x80-\xBF] # non-overlong 2-byte
      |\xE0[\xA0-\xBF][\x80-\xBF] # excluding overlongs
      |[  \xE1-\xEC\xEE\xEF][\x80-\xBF]{2} # straight 3-byte
      |\xED[\x80-\x9F][\x80-\xBF] # excluding surrogates
      |\xF0[\x90-\xBF][\x80-\xBF]{2} # planes 1-3
      |[\xF1-\xF3][\x80-\xBF]{3} # planes 4-15
      |\xF4[\x80-\x8F][\x80-\xBF]{2} # plane 16
      )+%xs', $data);
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
   
    return curl_exec($ch);
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
    return $retval;
  }
?>
