import React from 'react';
// import { Svg } from 'expo';
import { Image, View, PixelRatio } from 'react-native';

import { connect } from "react-redux";
import { updateCoords, sleep, play } from "../redux/actions";


const Arrow = ({user, flag, flagId, heading, width, meRedux, }) => {
  // Converts from degrees to radians.
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };
  
  // Converts from radians to degrees.
  Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
  };

  // Declination calculation
  const latitude1 = Math.radians(meRedux.latitude);
  const longitude1 = Math.radians(meRedux.longitude);
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
  
  // console.log("PixelRatio: ", PixelRatio.get());
  return(
  <View style={{
    width : width, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
  }}>
    {/* <Svg 
      width="150" 
      height="150"
      // x="0px" 
      // y="0px" 
      viewBox="0 0 50 50" 
      style={{
        enableBackground: "new 0 0 150 150", 
        xml:space="preserve",
      }}
    >
      <Svg.Path d="M25,33.5L25,33.5c-0.3,0-0.5-0.2-0.5-0.5V17c0-0.3,0.2-0.5,0.5-0.5l0,0c0.3,0,0.5,0.2,0.5,0.5v16
        C25.5,33.3,25.3,33.5,25,33.5z"
          fill="none"
          stroke='#FF0000'
          stroke-width={150}
          stroke-miterlimit={150}
        />
      <Svg.Path  d="M31.7,18.5L31.7,18.5c-0.2,0.2-0.5,0.2-0.7,0l-6.4-6.4c-0.2-0.2-0.2-0.5,0-0.7l0,0c0.2-0.2,0.5-0.2,0.7,0
        l6.4,6.4C31.9,18,31.9,18.3,31.7,18.5z"
          fill='none'
          stroke='#FF0000'
          stroke-width={150}
          stroke-miterlimit={150}
        />
      <Svg.Path  d="M18.3,18.5L18.3,18.5c-0.2-0.2-0.2-0.5,0-0.7l6.4-6.4c0.2-0.2,0.5-0.2,0.7,0l0,0c0.2,0.2,0.2,0.5,0,0.7L19,18.5
        C18.8,18.7,18.5,18.8,18.3,18.5C18.3,18.6,18.3,18.5,18.3,18.5z"
          fill='none'
          stroke='#FF0000'
          stroke-width={150}
          stroke-miterlimit={150}
        />
    </Svg> */}

    {/* <Svg width="41" height="32">
      <Svg.Path
        d="M34.212 12.79a6.11 6.11 0 0 1 .783-.05c3.317 0 6.005 2.665 6.005 5.955 0 3.289-2.688 5.955-6.005 5.955a6.01 6.01 0 0 1-4.051-1.56C27.991 28.38 23.288 32 17.234 32 6.49 32 .079 20.03 0 8.706c-.078-11.324 34.468-11.889 34.468 0 0 1.373-.087 2.74-.256 4.083zm.783 8.909c1.673 0 3.03-1.345 3.03-3.004 0-1.66-1.357-3.005-3.03-3.005-1.673 0-3.029 1.345-3.029 3.005 0 1.659 1.356 3.004 3.03 3.004z"
        fill="#000"
        fillRule="evenodd"
      />
    </Svg> */}
    <Image
      style={{
        width: 150, 
        height: 150, 
        transform: [{ rotate: `${(parseFloat(headingJune)*-1)}deg` }],
        backgroundColor:'#BF1400',
        borderRadius: 150 / 2,
        // borderRadius: 225 / PixelRatio.get(),
        // borderWidth: 1,
        borderColor: '#BF1400'
      }}
      source={require('../assets/waldo-arrow-arrow.png')}
    />
  </View>
  )
}


const mapDispatchToProps = dispatch => {
  return {
    updateCoords: (coords) => dispatch(updateCoords(coords)),
    sleep: () => dispatch(sleep()),
    play: () => dispatch(play())
  };
};

const mapStateToProps = state => {
  const { meRedux } = state;
  return meRedux;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arrow);