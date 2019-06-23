import React from 'react';
import { Image, } from 'react-native';
export default function Arrow({headingJune}){
  return(
  <>
    <Image
      style={{width: 150, height: 150, transform: [{ rotate: `${(parseFloat(headingJune)*-1)}deg` }]}}
      source={require('./waldo-arrow.png')}
    />
  </>
  )
}
