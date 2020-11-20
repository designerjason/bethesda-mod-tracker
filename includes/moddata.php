<?php
    header("X-Robots-Tag: noindex, nofollow", true);
    $number_results_fixed = true;
    $number_results = isset( $_GET['number_results'] )? $_GET['number_results'] : '';
    $selectGame = filter_input(INPUT_GET,'selectGame', FILTER_SANITIZE_STRING);
    $selectPlatform = filter_input(INPUT_GET,'selectPlatform', FILTER_SANITIZE_STRING);
    $searchText = filter_input(INPUT_GET,'searchText', FILTER_SANITIZE_STRING);

    // let's not go crazy now, we don't want a bum smacking...
    if($number_results_fixed) {
      $number_results = 50;
    }

    $game = isset( $_GET['selectGame'] )? $selectGame : '';
    $platform = isset( $_GET['selectPlatform'] )? $selectPlatform : '';
    $text = isset( $_GET['searchText'] )? $searchText : '';
    $filterURL = 'https://api.bethesda.net/mods/ugc-workshop/list/?number_results=' . $number_results . '&amp;product=' . $game . '&amp;platform='. $platform . '&amp;text='. $text;

    getJson($filterURL);

    //display correct filesize
    function byteConvert($bytes)
    {
        if ($bytes == 0) {
            return "0.0 B";
        }

        $s = array('b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb');
        $e = floor(log($bytes, 1024));

        return round($bytes/pow(1024, $e), 1).$s[$e];
    }

    function getJson($url) {
        //  Initiate curl
        $ch = curl_init();
        // Disable SSL verification
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        // Will return the response, if false it print the response
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // Set the url
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

        // Execute
        $result = curl_exec($ch);
        // Closing
        curl_close($ch);

        if(!empty($result)) {
          $resultArray = json_decode($result, true);
          $modArray = $resultArray['platform']['response']['content'];
          $jsonArray = [];

          foreach($modArray as $item){

              array_push( $jsonArray,
                  array(
                      'id' => $item['content_id'],
                      'name' => str_replace("'", "'", $item['name']),
                      'filesize' => byteConvert($item['depot_size']),
                      'thm' => $item['preview_file_url'],
                      'product' => $item['product'],
                      'platform' => $item['platform'][0]
                  )
              );
          }

          // need to wrap this in a function for the jsonp callback
          echo "modData(".json_encode($jsonArray).")";
        }
    }
