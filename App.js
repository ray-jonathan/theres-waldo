import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import destVincenty from './utils/destVincenty';
import distVincenty from './utils/distVincenty';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      // location: null,
      latitude: null,
      longitude: null,
      errorMessage: null,
      heading: null,
      accuracy: null,
      coordsAccuracy: null,
    };
  }



  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    // let location = await Location.getCurrentPositionAsync({});
    await Location.watchPositionAsync({timeInterval: 100, accuracy : 5, distanceInterval : 10}, location => 
    {
      console.log(location);
      this.setState({ 
        latitude : location.coords.latitude,
        longitude : location.coords.longitude,
        coordsAccuracy : location.coords.accuracy,
      }, ()=>console.log("location set"));
    });
    Location.watchHeadingAsync((heading) => 
    {
      if(Math.abs(heading.trueHeading - this.state.heading) > 15){
        this.setState({ 
          heading: heading.trueHeading, 
          accuracy: heading.accuracy,
        }, ()=>console.log("heading set"));
      }
    });
  };

  render() {
        // Converts from degrees to radians.
    Math.radians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    
    // Converts from radians to degrees.
    Math.degrees = function(radians) {
      return radians * 180 / Math.PI;
    };
    let text = ' ';
    text = JSON.stringify(this.state.location);
    let lat = this.state.latitude;
    let long = this.state.longitude;
    let heading = this.state.heading;
    let accuracy = this.state.accuracy;
    let coordsAccuracy = this.state.coordsAccuracy;

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


    // let everyDirectionBasedOnHeadingArray = [];
    // for(let i=0; i < 8; i++){
    //   const j = i * 45;
    //   const k = heading + j;
    //   console.log(k);
    //   console.log(heading);
    //   if ( k > 360 ){
    //     k = k - 360;
    //   }
    //   everyDirectionBasedOnHeadingArray.push(k)
    // }
    // const distancesObject = {}
    // everyDirectionBasedOnHeadingArray.forEach(val => {
    //   const waldoCoords = destVincenty(lat, long, val, 10);
    //   const eachDirectionDistance = parseFloat(distVincenty(lat, long, waldoCoords.lat, waldoCoords.lng)).toFixed(1);
    //   distancesObject[eachDirectionDistance] = val
    // });
    // const leastDistance = Math.min(...Object.keys(distancesObject));
    // console.log("least dist ",leastDistance);
    // const leastDirection =  distancesObject[leastDistance];
    
    // const directions = [0, 45, 90, 135, 180, 225, 270, 315];
    // const directions1 = directions.map(d => d + this.state.heading);
    // const distances = {};
    const targetCoords = {lat: 33.8019066533606,lng: -83.72027814388277}
    // const targetCoords = {lat: 90,lng: 0}
    // directions.forEach(direction => {
    //   const destCoords = destVincenty(lat, long, direction, 10)
    //   const key = parseFloat(distVincenty(targetCoords.lat, targetCoords.lng, destCoords.lat, destCoords.lng))
    //   distances[key] = direction;
    // })
    // const shortestDist = Math.min(...Object.keys(distances));
    // // if (!shortestDist){
    // //   console.log("shortestDist: ", shortestDist);
    // // }
    // let shortestDirection = distances[parseFloat(shortestDist)];
    // if (!shortestDirection){
    //   console.log("===========================================================");
    //   console.log("distances: ", distances);
    //   console.log("shortestDist: ", parseFloat(shortestDist));
    //   console.log("===========================================================");
    // }
    // console.log(shortestDirection);
    // shortestDirection = shortestDirection.toString();
    // shortestDistKM = (shortestDist/1000).toFixed(1)

    // const cardinal = {
    //   0 : "North",
    //   45 : "NorthEast",
    //   90 : "East",
    //   135 : "SouthEast",
    //   180 : "South",
    //   225 : "SouthWest",
    //   270 : "West",
    //   315 : "NorthWest",
    // }
    console.log("-----------------------------------------");
    console.log(targetCoords);
    console.log("-----------------------------------------");
    const latitude1 = Math.radians(lat);
    const longitude1 = Math.radians(long);
    const latitude2 = Math.radians(targetCoords.lat);
    const longitude2 = Math.radians(targetCoords.lng);
    const deltaLongitude = longitude2 - longitude1;
    deltaPhi = Math.log(Math.tan(latitude2/2.0+Math.PI/4.0)/Math.tan(latitude1/2.0+Math.PI/4.0))
    if (Math.abs(deltaLongitude) > Math.PI){
      if (deltaLongitude > 0.0){
        deltaLongitude = -(2.0 * Math.PI - deltaLongitude)
      }
      else{
        deltaLongitude = (2.0 * Math.PI + deltaLongitude)
      }
    }
    let bearingNew = (Math.degrees(Math.atan2(deltaLongitude, deltaPhi)) + 360.0) % 360.0;
    let headingNew = ((bearingNew - this.state.heading) * -1).toFixed(3);


    // let lat1 = (0.0174533 * lat);
    // let lng1 = (0.0174533 * long);
    // let lat2 = (0.0174533 * targetCoords.lat)
    // let lng2 = (0.0174533 * targetCoords.lng)
    // let dLat = lat2 - lat1; // difference between the LATITUDES
    // let dLon = lng2 - lng1; // difference between the LONGITUDES
    // let y = Math.sin( dLon ) * Math.cos( dLat ); // 
    // let x = Math.cos( lat1 ) * Math.sin( lat2 ) - Math.sin( lat1 ) * Math.cos( lat2 ) * Math.cos( dLon );
    // let bearing = Math.atan2(y, x);
    // console.log("bearing, ", bearing);
    // if( bearing < 0 ){
    //   console.log("shouldn't see this");
    //   bearing += (2*Math.PI);
    // }
    // bearing = bearing / 0.0174533
    // // const newBearing = (heading* Math.PI / 180)+ bearing;
    // // let newBearing = ((heading* Math.PI / 180)+ bearing)* 57.2958;
    // // let newBearing = ((heading)+ bearing)* 57.2958;
    // let newBearing = ((heading)+ bearing);
    // console.log("heading: ",heading);
    // console.log("bearing: ",bearing);
    // if (newBearing > 360){
    //   newBearing -=360
    // }

    
    lat = parseFloat(lat).toFixed(6)
    long = parseFloat(long).toFixed(6)
    coordsAccuracy = parseFloat(coordsAccuracy).toFixed(2)
    // bearing = parseFloat(bearing).toFixed(4)
    heading = parseFloat(heading).toFixed(4)
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>Lat: {lat}</Text>
        <Text style={styles.nextLine}>Long: {long}</Text>
        <Text style={styles.nextLine}>(+/- {coordsAccuracy}m)</Text>
        <Text style={styles.paragraph}> </Text>
        {/* <Text style={styles.paragraph}>{shortestDistKM}km</Text> */}
        {/* <Text style={styles.nextLine}>{cardinal[shortestDirection]}</Text> */}
        <Text style={styles.paragraph}>bearing: {headingNew}</Text>
        {/* <Text style={styles.nextLine}>leastDirection: {leastDirection.toFixed(2)}</Text> */}
        {/* <Text style={styles.nextLine}>leastDirection: {(leastDirection - heading).toFixed(4)} (corrected)</Text> */}

        <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>Heading: {heading}</Text>
        <Text style={styles.nextLine}>({headingAccuracy}°)</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    marginTop: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  nextLine: {
    fontSize: 18,
    textAlign: 'right',
  },
});