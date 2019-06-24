import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
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
      latitude: null,
      longitude: null,
      errorMessage: null,
      heading: null,
      accuracy: null,
      coordsAccuracy: null,
      targetCoords: null,
      users: null,
    };
  }

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

  render() {
    return (
      <View style={styles.container}>
        {this.state.targetCoords && this.state.latitude? <Telemetry {...this.state} /> : null}
      </View>
    );
  }

  _getLocationAsync = async () => {
    // We check for Permissions but don't do anything with it
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    Location.watchPositionAsync(
      {
        timeInterval: 500, 
        accuracy : 5, 
        distanceInterval : 10
      }, 
      location => 
      {
        this.setState({ 
          latitude : location.coords.latitude,
          longitude : location.coords.longitude,
          coordsAccuracy : location.coords.accuracy,
        }, ()=>console.log("location set"));
      }
    );

    Location.watchHeadingAsync((heading) => 
    {
      if(Math.abs(heading.trueHeading - this.state.heading) > 30){
        this.setState({ 
          heading: heading.trueHeading, 
          accuracy: heading.accuracy,
        }, ()=>console.log("heading set"));
      }
    });
  };

  _fetchTargetCoords = async () => {
    const url = 'ws://waldo.jonathan-ray.com/ws'
    this.connection = new WebSocket(url)
    this.connection.onopen = () => {
      this.connection.send(JSON.stringify({message: 'hey'}));
    };
    this.connection.onmessage = ({data}) => {
      const dataJson = (JSON.parse(data))
      const targetCoords = dataJson.coordinates
      const users = dataJson.users
      this.setState({targetCoords, users,})
    };
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