//
// NS:GEO
// REQUIRE:CORE
// NEED:NONE
//
__Geo=SYSLIB.namespace("syslib.geo");
__Geo.get=function (scb,err) {
  	var getgeo = function (scb,scb2,err) {
    	if (navigator.geolocation) {
          	navigator.geolocation.getCurrentPosition(scb,function (error) {
        		switch(error.code) {
		            case error.PERMISSION_DENIED:
		                console.log("GEO: User denied the request for Geolocation.");
		                break;
		            case error.POSITION_UNAVAILABLE:
		                console.log("GEO: Location information is unavailable.");
		                break;
		            case error.TIMEOUT:
		                console.log("GEO: The request to get user location timed out.");
		                break;
		            case error.UNKNOWN_ERROR:
		                console.log("GEO: An unknown error occurred.");
		                break;
            	}
        		if(scb2) {
        			scb2();
        		}else{ 
        			if(err) {
        				err();
        			}
        		}
      		});
       	}else{
      		if(scb2) {
      			scb2();
      		}
    	}
  	}
  	getgeo(function (e) {
    	snack.JSONP({
       		url:'http://api.map.baidu.com/geocoder/v2/',
			key:'callback',
       		data:{ak:'6f7bcd8ebbe8209777f27f32fed49746',location:(e.coords.latitude+","+e.coords.longitude),output:'json',pois:1}
       	},function (data) {
	        if(!data||!data.result) {
	          	return err();
	        }
	        var pos = {
	          	accuracy:e.coords.accuracy,
	          	altitude:e.coords.altitude,
	          	altitudeAccuracy:e.coords.altitudeAccuracy,
	          	heading:e.coords.heading,
	          	latitude:e.coords.latitude,
	          	longitude:e.coords.longitude,
	          	speed:e.coords.speed,
	          	timestamp:e.timestamp,
	          	address:data.result.formatted_address,
	          	city:data.result.addressComponent.city,
	          	district:data.result.addressComponent.district,
	          	province:data.result.addressComponent.province,
	          	street:data.result.addressComponent.street,
	          	street_number:data.result.addressComponent.street_number
	        }
        	scb(pos);
    	});
  	},function (e) {
    	snack.JSONP({
	       	url:'http://api.map.baidu.com/location/ip',
	       	data:{ak:'6f7bcd8ebbe8209777f27f32fed49746'},
	       	key:'callback'
	    },function (data) {
	        if(!data||!data.content) {
	          	return err();
	        }
	        var pos = {
	          	accuracy:0,
	          	altitude:0,
	          	altitudeAccuracy:0,
	          	heading:0,
	          	latitude:data.content.point.x,
	          	longitude:data.content.point.y,
	          	speed:0,
	          	timestamp:(new Date()).getTime(),
	          	address:data.content.address,
	          	city:data.content.address_detail.city,
	          	district:data.content.address_detail.district,
	          	province:data.content.address_detail.province,
	          	street:data.content.address_detail.street,
	          	street_number:data.content.address_detail.street_number
	        }
        	scb(pos);
    	});
  	},err)
}

