import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import Arrow from './Components/Arrow';
import Map from './Components/Map';
import destVincenty from './utils/destVincenty';
import distVincenty from './utils/distVincenty';
import Telemetry from './Components/Telemetry';
// import * as firebase from 'firebase';
// import '@firebase/firestore';

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCMtnFpkDbP-dpDnmgHeNoThkCikn4HE_k",
//   authDomain: "theres-waldo-7b890.firebaseapp.com",
//   databaseURL: "https://theres-waldo-7b890.firebaseio.com/",
//   storageBucket: "gs://theres-waldo-7b890.appspot.com"
// };

// firebase.initializeApp(firebaseConfig);

// const dbh = firebase.firestore();

// dbh.collection("characters").doc("mario").set({
//   employment: "plumber",
//   outfitColor: "red",
//   specialAttack: "fireball"
// })

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
      targetCoords: null,
    };
  }

  // componentDidMount(){
  //   console.log(" ");
  //   console.log(" ");
  //   console.log(" ");
  //   console.log(" ");
  //   console.log("Trying to establish socket.");
  //   const url = 'ws://waldo.jonathan-ray.com/ws'
  //   // this.connection = new WebSocket(url);
  //   this.connection = new WebSocket(url)

  //   this.connection.onopen = () => {
  //     this.connection.send(JSON.stringify({message: 'hey'}));
  //   };

  //   this.connection.onerror = (error) => {
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(`WebSocket error: ${error}`);
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //   };

  //   this.connection.onmessage = (e) => {
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(e.data);
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //     console.log(" ");
  //   };
  //   console.log(" ");
  //   console.log(" ");
  //   console.log(" ");
  //   console.log(" ");
  // }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
      this._fetchTargetCoords();
    }
  }

  _getLocationAsync = async () => {
    Location.watchPositionAsync({timeInterval: 100, accuracy : 5, distanceInterval : 10}, location => 
    {
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

  _fetchTargetCoords = async () => {
    console.log("_fetchTargetCoords begins");
    const url = 'ws://waldo.jonathan-ray.com/ws'
    this.connection = new WebSocket(url)
    this.connection.onopen = () => {
      console.log("Sending hey");
      this.connection.send(JSON.stringify({message: 'hey'}));
    };
    this.connection.onmessage = ({data}) => {
      const targetCoords = (JSON.parse(data)).coordinates
      this.setState({targetCoords})
    };
  }

  render() {
    return (
      <View style={styles.container}>

        {/* <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>Lat: {lat}</Text>
        <Text style={styles.nextLine}>Long: {long}</Text>
        <Text style={styles.nextLine}>(+/- {coordsAccuracy}m)</Text>
        <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>bearing: {headingNew}</Text>
        <Text style={styles.paragraph}>staticBearingJune (deg): {bearingJune}</Text> */}
        
        {/* <Text style={styles.paragraph}>Destination Heading: {headingJune}</Text>
        <Text style={styles.paragraph}> </Text> */}
        {this.state.targetCoords && this.state.latitude? <Telemetry {...this.state} /> : null}
        {/* <Arrow headingJune={headingJune} /> */}
        {/* <Text style={styles.paragraph}> </Text>
        <Text style={styles.paragraph}>Heading: {heading}</Text>
        <Text style={styles.nextLine}>({headingAccuracy}°)</Text> */}


        {/* <Map style={styles.map}/> */}

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
    // ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    // justifyContent: 'flex-end',
    // alignItems: 'center',

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
  map: {
    // ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});