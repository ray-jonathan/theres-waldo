import React from 'react';
import { Image, View } from 'react-native';
export default function Arrow({headingJune, width}){
  return(
  <View style={{width : width, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <Image
      style={{width: 150, height: 150, transform: [{ rotate: `${(parseFloat(headingJune)*-1)}deg` }]}}
      source={require('./waldo-arrow.png')}
    />
  </View>
  )
}
