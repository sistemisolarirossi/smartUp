<?php
class GoogleTranslate {
	private $url = "http://translate.google.com/translate_a/t";
	private $inputEncoding = "UTF-8";
	private $outputEncoding = "UTF-8";
	private $client = "p"; # p: JSON, t: STRING
	private $multires = 1; # ?
	private $otf = 1; # ?
	private $pc = 1; # ?
	private $trs = 1; # ?
	private $ssel = 3; # ?
	private $tsel = 6; # ?
	private $sc = 1; # ?

	private function curl($url, $params = array()) {
		# retrieve url + params contents
		$arr = array(); foreach ($params as $key => $value) $arr[] = urlencode($key) . "=" . urlencode($value);
		$str = empty($arr) ? '' : '?' . implode('&', $arr);
		$ch = curl_init($url . $str);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}
	 
	public function translate($text, $fromLanguage = 'auto', $toLanguage = 'en') {
		# explode text into sentences (to limit request size);
		# we need this because apparently google translate v2 doesn't accept POST requests,
		# and GET requests are limited in size...
		$maxSize = 1024;
#print $text; print "<hr>\n";
		#$sentences = preg_split('/(\.\s)/', $text, -1, PREG_SPLIT_DELIM_CAPTURE);
		preg_match_all("/(.*?(?:\.\s|$))/s", $text, $matches); $sentences = $matches[0];
#print_r($sentences); exit;
		# build groups of sentences not longer than $maxSize
		for ($group = "", $i = 0; $i <= count($sentences); $i++) { # using <= to do one more loop at the end
			if ($i == count($sentences)) { # after last sentence
				if ($group) $groups[] = $group;
			} else {
				$sentence = $sentences[$i];
				if (strlen($group . $sentence) <= $maxSize) {
					$group .= $sentence;
				} else {
					# if a sentence is longer than maxSize it will pass as-is,
					# we make no effort to split it some other way...
					if ($group) $groups[] = $group;
					$group = $sentence;
				}
			}
		}

		$results = "";
		foreach ($groups as $group) {
			$json = json_decode($this->curl($this->url,	array(
														'text' => $group,
														'client' => $this->client,
														'hl' => $toLanguage,
														'sl' => $fromLanguage,
														'tl' => $toLanguage,
														'ie' => $this->inputEncoding,
														'oe' => $this->outputEncoding,
														'multires' => $this->multires,
														'ssel' => $this->ssel,
														'tsel' => $this->tsel,
														'sc' => $this->sc,
													)
			));
			if (isset($json) and isset($json->responseStatus) and $json->responseStatus != 200) {
  				if (isset($json) and isset($json->responseDetails)) {
  					$result = "Error: $json->responseDetails";
	 			} else {
  					$result = "Error: unknown problem";
  				}
 			} else {
 				if (isset($json->sentences)) {
					$result = ""; foreach ($json->sentences as $value) $result .= $value->trans;
	 			} else {
  					$result = "Error: no result";
  				}
			}
			$results .= $result;
		}
		return $results;
	}
}

$g = new GoogleTranslate();
$text = "La «Doctrine de Truman»:Comment réunir l'Italie de l'après-guerre à l'Egypte d'aujourd'hui D. Marie NASSIF-DEBS Depuis soixante ans, et plus précisément à partir du mois de mars 1947, et quel que soit le parti au pouvoir, la politique extérieure des USA se caractérise par la mise en œuvre de la doctrine préconisée par Harry Truman, président étasunien bien connu pour son anti communisme primitif et ses tentatives visant à diriger la planète et à mettre la main sur les richesses qu'elle recèle.";
$italiano = $g->translate($text, 'auto', 'it');
print $italiano;

?>