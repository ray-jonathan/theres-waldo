import React from 'react';
import { Image, View } from 'react-native';
export default function Arrow({user, flag, flagId, heading, width}){
  // Converts from degrees to radians.
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };
  
  // Converts from radians to degrees.
  Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
  };

  // Declination calculation
  const latitude1 = Math.radians(user.latitude);
  const longitude1 = Math.radians(user.longitude);
  const latitude2 = Math.radians(flag[flagId].latitude);
  const longitude2 = Math.radians(flag[flagId].longitude);
  const deltaLongitude = longitude2 - longitude1;
  const deltaPhi = Math.log(Math.tan(latitude2/2.0+Math.PI/4.0)/Math.tan(latitude1/2.0+Math.PI/4.0))
  let bearingJune = Math.degrees(Math.atan2(deltaLongitude, deltaPhi)).toFixed(3);  
  let phoneHeading = parseFloat(heading);
  bearingJune = parseFloat(bearingJune);
  let breakingPoint = bearingJune + 180;
  if (breakingPoint > 360){
    breakingPoint = breakingPoint - 360;
  }
  let headingJune = parseFloat((phoneHeading - bearingJune).toFixed(3))
  if (phoneHeading > breakingPoint){
    headingJune = headingJune - 360;
  }
  
  return(
  <View style={{width : width, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <Image
      style={{width: 150, height: 150, transform: [{ rotate: `${(parseFloat(headingJune)*-1)}deg` }]}}
      source={require('./waldo-arrow.png')}
    />
  </View>
  )
}
