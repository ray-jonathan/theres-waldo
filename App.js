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

    // DUE E
    const targetCoords = {lat: 33.8019066533606,lng: -83.72027814388277}

    // // // DUE SW
    // const targetCoords = {lat: 33.351671,lng: -84.69227}

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

    let bearingJune = Math.degrees(Math.atan2(deltaLongitude, deltaPhi)).toFixed(3);
    let headingJune = 0;
    if (this.state.heading){
      let phoneHeading = parseFloat(this.state.heading);
      bearingJune = parseFloat(bearingJune)
      let breakingPoint = bearingJune + 180;
      if (breakingPoint > 360){
        breakingPoint = breakingPoint - 360;
      }
      headingJune = parseFloat((phoneHeading - bearingJune).toFixed(3))
      if (phoneHeading > breakingPoint){
        headingJune = headingJune - 360;
      }
    };
    
    lat = parseFloat(lat).toFixed(6)
    long = parseFloat(long).toFixed(6)
    coordsAccuracy = parseFloat(coordsAccuracy).toFixed(2)
    // bearing = parseFloat(bearing).toFixed(4)
    heading = parseFloat(heading).toFixed(4)
    return (
      <View style={styles.container}>
        {/* <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>Lat: {lat}</Text>
        <Text style={styles.nextLine}>Long: {long}</Text>
        <Text style={styles.nextLine}>(+/- {coordsAccuracy}m)</Text>
        <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>bearing: {headingNew}</Text>
        <Text style={styles.paragraph}>staticBearingJune (deg): {bearingJune}</Text> */}
        <Text style={styles.paragraph}>Destination Heading: {headingJune}</Text>
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