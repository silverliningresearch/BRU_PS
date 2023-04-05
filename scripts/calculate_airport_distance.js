function distance(lat1,lat2, lon1, lon2)
{

  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 =  lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2)* Math.pow(Math.sin(dlon / 2),2);
  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return(c * r);
}

function get_geocode(airport_name)
{
  var geocoder = new google.maps.Geocoder();

  var airport_lat; 
  var airport_long;

  geocoder.geocode( { 'address': airport_name}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      airport_lat = results[0].geometry.location.lat();
      airport_long = results[0].geometry.location.lng();
      console.log("airport_name: ", airport_name);      
      console.log("airport_lat: ", airport_lat);
      console.log("airport_long: ", airport_long);
    } else {
      console.log(airport_name + ": geocode was not successful for the following reason: ", status);
    }
  });
}

function calculate_distance()
{
  var geocoder = new google.maps.Geocoder();
  var next_airport_name = "CAG Airport"; 
  var final_airport_name = "SGN Airport"; 

  var next_airport_lat; 
  var next_airport_long; 
  var final_airport_lat; 
  var final_airport_long; 

  var BRU_airport_lat=50.900999; 
  var BRU_airport_long= 4.485574;

  var BRU_next_distance, BRU_final_distance, next_final_distance;

  next_airport_name =api.fn.answers().Q9_recoded + " Airport";
  final_airport_name =api.fn.answers().Q11_Recoded + " Airport";

  console.log("next_airport_name:", next_airport_name);     
  console.log("final_airport_name:", final_airport_name);     

  geocoder.geocode( { 'address': next_airport_name}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      next_airport_lat = results[0].geometry.location.lat();
      next_airport_long = results[0].geometry.location.lng();
        geocoder.geocode( { 'address': final_airport_name}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            final_airport_lat = results[0].geometry.location.lat();
            final_airport_long = results[0].geometry.location.lng();
      
            BRU_next_distance = distance(next_airport_lat, BRU_airport_lat, next_airport_long, BRU_airport_long);
            BRU_final_distance = distance(BRU_airport_lat, final_airport_lat, BRU_airport_long, final_airport_long);
            next_final_distance = distance(next_airport_lat, next_airport_lat, next_airport_long, final_airport_long);
            
            console.log(" BRU_next_distance: ", BRU_next_distance);  
            console.log(" BRU_final_distance: ", BRU_final_distance);
            console.log(" next_final_distance: ", next_final_distance);

            api.fn.answers({Q11_BRU_next_distance: BRU_next_distance}); 
            api.fn.answers({Q11_BRU_final_distance: BRU_final_distance}); 
            api.fn.answers({Q11_next_final_distance: next_final_distance}); 
            
            api.fn.answers({Q11_next_airport_lat: next_airport_lat}); 
            api.fn.answers({Q11_next_airport_long: next_airport_long}); 
            api.fn.answers({Q11_final_airport_lat: final_airport_lat}); 
            api.fn.answers({Q11_final_airport_long: final_airport_long}); 

            //old: if ((BRU_next_distance + BRU_final_distance) > 2*next_final_distance)
            if ((BRU_next_distance +next_final_distance) > 2*BRU_final_distance)
            {
              api.fn.answers({Q11_Detour_Check_Result: 1});     
              api.fn.answers({Q11_Detour_Check: 1}); //used for condition           
              console.log("result: this route seems like a detour");     
            }
            else
            {
              api.fn.answers({Q11_Detour_Check_Result: 0});  
              api.fn.answers({Q11_Detour_Check: 0}); //used for condition               
              console.log("result: this route seems a actual route");  
            }

          } else {
            console.log("Q11_airport Geocode was not successful for the following reason: ", status);
          }
        });
    } else {
      console.log("Q7_airport Geocode was not successful for the following reason: ", status);
    }
  });
}
