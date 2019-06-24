import React from 'react';
import { Platform, Text, ScrollView, StyleSheet, Image, Dimensions, } from 'react-native';
import Arrow from './Arrow';
import Map from './Map';
import Tag from './Tag';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  tag: {
    marginTop: 100,
    width: width,
    margin: 0,
    height: 400,
  },
});


export default class Telemetry extends React.Component{
  constructor(props){
    super(props)
    console.log(props);
  }
  componentDidMount(){
    this.scrollView.scrollTo({x: width});
  }
  render() {
    const { heading, latitude, longitude, targetCoords, } = this.props;
    
    // Converts from degrees to radians.
    Math.radians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    
    // Converts from radians to degrees.
    Math.degrees = function(radians) {
      return radians * 180 / Math.PI;
    };

    // Declination calculation
    const latitude1 = Math.radians(latitude);
    const longitude1 = Math.radians(longitude);
    const latitude2 = Math.radians(targetCoords.lat);
    const longitude2 = Math.radians(targetCoords.lng);
    const deltaLongitude = longitude2 - longitude1;
    deltaPhi = Math.log(Math.tan(latitude2/2.0+Math.PI/4.0)/Math.tan(latitude1/2.0+Math.PI/4.0))
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

    return(
    <ScrollView 
      // style={styles.container}
      ref={(scrollView) => { this.scrollView = scrollView; }}    horizontal= {true}
      decelerationRate={0.9} // 'fast'
      snapToInterval={width}
      snapToAlignment={"center"}
    >
      <Map style={styles.map} users={this.props.users} />
      <Arrow style={styles.arrow} headingJune={headingJune} width={width} />
      <Tag style={styles.tag} width={width} />
    </ScrollView>
    )
  }
}