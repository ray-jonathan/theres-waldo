import React from 'react';
import { Platform, Text, ScrollView, StyleSheet, Image, Dimensions, } from 'react-native';
import Arrow from './Arrow';
import Map from './Map';

const { width } = Dimensions.get('window');

export default class Telemetry extends React.Component{
  constructor(props){
    super(props)
  }
  componentDidMount(){
    this.scrollView.scrollTo({x: width});
  }
  render() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // ...StyleSheet.absoluteFillObject,
      // height: 400,
      // width: 400,
      // justifyContent: 'flex-end',
      // alignItems: 'center',
  
    },
    // paragraph: {
    //   marginTop: 24,
    //   fontSize: 18,
    //   textAlign: 'center',
    // },
    // nextLine: {
    //   fontSize: 18,
    //   textAlign: 'right',
    // },
    arrow: {
      marginTop: 100,
      width: width,
      margin: 0,
      height: 400,
    },
    map: {
      marginTop: 100,
      width: width,
      margin: 0,
      height: 400,
    },
  });

    const { accuracy, coordsAccuracy, heading, latitude, longitude, targetCoords, } = this.props;
    
    // Converts from degrees to radians.
    Math.radians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    
    // Converts from radians to degrees.
    Math.degrees = function(radians) {
      return radians * 180 / Math.PI;
    };
  
    let headingAccuracy = " "
    switch (accuracy){
      case 1:
        headingAccuracy = "< +/- 50"
        break;
      case 2:
        headingAccuracy = "< +/- 35"
        break;
      case 3:
        headingAccuracy = "< +/- 20"
        break;
      default:
        headingAccuracy = "> +/- 50"
        break;
    }
  
  
    // console.log("-----------------------------------------");
    // console.log(targetCoords);
    // console.log("-----------------------------------------");
    const latitude1 = Math.radians(latitude);
    const longitude1 = Math.radians(longitude);
    const latitude2 = Math.radians(targetCoords.lat);
    const longitude2 = Math.radians(targetCoords.lng);
    const deltaLongitude = longitude2 - longitude1;
    deltaPhi = Math.log(Math.tan(latitude2/2.0+Math.PI/4.0)/Math.tan(latitude1/2.0+Math.PI/4.0))
  
  
    // //  KEEP IN CASE OF NEED  // //
    // if (Math.abs(deltaLongitude) > Math.PI){
    //   if (deltaLongitude > 0.0){
    //     deltaLongitude = -(2.0 * Math.PI - deltaLongitude)
    //   }
    //   else{
    //     deltaLongitude = (2.0 * Math.PI + deltaLongitude)
    //   }
    // }
    // // // // // // // // // // //
  
  
    // let bearingNew = (Math.degrees(Math.atan2(deltaLongitude, deltaPhi)) + 360.0) % 360.0;
    // let headingNew = ((bearingNew - this.state.heading) * -1).toFixed(3);
  
    let bearingJune = Math.degrees(Math.atan2(deltaLongitude, deltaPhi)).toFixed(3);
  
    let phoneHeading = parseFloat(heading);
    bearingJune = parseFloat(bearingJune)
    let breakingPoint = bearingJune + 180;
    if (breakingPoint > 360){
      breakingPoint = breakingPoint - 360;
    }
    let headingJune = parseFloat((phoneHeading - bearingJune).toFixed(3))
    if (phoneHeading > breakingPoint){
      headingJune = headingJune - 360;
    }
    
    // lat = parseFloat(lat).toFixed(6)
    // long = parseFloat(long).toFixed(6)
    // coordsAccuracy = parseFloat(coordsAccuracy).toFixed(2)
    // bearing = parseFloat(bearing).toFixed(4)
    // heading = parseFloat(heading).toFixed(4)
    return(
    <ScrollView 
    // style={styles.container}
    ref={(scrollView) => { this.scrollView = scrollView; }}    horizontal= {true}
    decelerationRate={0}
    snapToInterval={width}
    snapToAlignment={"center"}
    >
      <Map style={styles.map}/>
      <Arrow style={styles.arrow} headingJune={headingJune} width={width} />
    </ScrollView>
    )
  }
}