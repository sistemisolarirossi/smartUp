<?php

  $languages = array(
    "af" => "Afrikaans",
    "ar" => "Arabic",
    "az" => "Azerbaijani",
    "be" => "Belarusian",
    "bg" => "Bulgarian",
    "bn" => "Bengali",
    "bs" => "Bosnian",
    "ca" => "Catalan",
    "cub" => "Cebuano",
    "cs" => "Czech",
    "cy" => "Welsh",
    "da" => "Danish",
    "de" => "German",
    "el" => "Greek",
    "eo" => "Esperanto",
    "es" => "Spanish",
    "et" => "Estonian",
    "eu" => "Basque",
    "fa" => "Persian",
    "fi" => "Finnish",
    "fr" => "French",
    "ga" => "Irish",
    "gl" => "Galician",
    "gu" => "Gujarati",
    "ha" => "Hausa",
    "hi" => "Hindi",
    "hmn" => "Hmong",
    "hr" => "Croatian",
    "ht" => "Haitian Creole",
    "hu" => "Hungarian",
    "hy" => "Armenian",
    "id" => "Indonesian",
    "ig" => "Igbo",
    "is" => "Icelandic",
    "it" => "Italian",
    "iw" => "Hebrew",
    "ja" => "Japanese",
    "jw" => "Javanese",
    "ka" => "Georgian",
    "km" => "Khmer",
    "kn" => "Kannada",
    "ko" => "Korean",
    "la" => "Latin",
    "lo" => "Lao",
    "lt" => "Lithuanian",
    "lv" => "Latvian",
    "mi" => "Maori",
    "mk" => "Macedonian",
    "mn" => "Mongolian",
    "mr" => "Marathi",
    "ms" => "Malay",
    "mt" => "Maltese",
    "ne" => "Nepali",
    "nl" => "Dutch",
    "no" => "Norwegian",
    "pa" => "Punjabi",
    "pl" => "Polish",
    "pt" => "Portuguese",
    "ro" => "Romanian",
    "ru" => "Russian",
    "sk" => "Slovak",
    "sl" => "Slovenian",
    "so" => "Somali",
    "sq" => "Albanian",
    "sr" => "Serbian",
    "sv" => "Swedish",
    "sw" => "Swahili",
    "ta" => "Tamil",
    "te" => "Telugu",
    "th" => "Thai",
    "tl" => "Filipino",
    "tr" => "Turkish",
    "uk" => "Ukrainian",
    "ur" => "Urdu",
    "vi" => "Vietnamese",
    "yi" => "Yiddish",
    "yo" => "Yoruba",
    "zh-cn" => "Chinese (Simplified)",
    "zh-tw" => "Chinese (Traditional)",
    "zu" => "Zulu",
  );

  foreach ($languages as $key => $val) {
    if (file_exists('app/icons/flags/' . $key . '.png')) {
      #print "[$key] Language ($val) has flag" . "\n";
      ;
    } else {
      print "[$key] Language ($val) is missing flag" . "\n";
    }
  }

  $n = 0;
  $dir = "app/icons/flags/";
  $dh  = opendir($dir);
  while (false !== ($filename = readdir($dh))) {
    if (preg_match('/^\./', $filename)) continue;
    $flag = preg_replace('/.png$/', '', $filename);
    if (isset($languages[$flag])) {
      print "[$flag] flag is supported" . "\n";
      $n++;
    } else {
      print "[$flag] flag is not supported, remove it..." . "\n";
      #unlink("$dir$filename");
    }
  }

  print "\n$n supported languages" . "\n";

?>