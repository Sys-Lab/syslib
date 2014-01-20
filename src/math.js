//
// NS:MATH
// REQUIRE:CORE
// NEED:NONE
//
var __Math=SYSLIB.namespace("syslib.math");
__Math.has =  function ($a,$b) {
            var $has = 0;
      $a = ($a.length)?$a:[$a];
      $b = ($b.length)?$b:[$b];
      for(var $j = 0;$j<$a.length;$j++) {
        for(var $k = 0;$k<$b.length;$k++) {
          if($a[$j] == $b[$k]) {
            $has++;
          }
        }
      }
            return ($has>= $b.length)
};
__Math.rand =  function (min,max,length) {
    var $rand = min+(Math.random() * (max-min));
    if(length) {
      if(length>0) {
        $rand = ($rand.toString()).split(".");
        $rand[1] = $rand[1].substr(0,length);
        $rand = $rand.join(".");
        return parseFloat($rand);
      }else{
        return $rand;
      }
    }else{
            return Math.floor($rand);
    }
};

