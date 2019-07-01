import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import Telemetry from './Components/Telemetry';
import AuthO from './Components/AuthO';


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      me: {}
    };
  }

  // componentWillMount() {
  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      // begin auth
      // collect the user's team assignment for their flagId and meId
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.me.team? null : <AuthO saveUser={this._updateMe} />}
        {this.state.me.team? <Telemetry flagId={this.state.me.team} meId={this.state.me.id} /> : null}
        {/* {this.state.targetCoords && this.state.latitude? <Telemetry {...this.state} /> : null} */}
      </View>
    );
  }

  _updateMe = async (data) => {
    this.setState({
      me: {
        id: data.aud,
        name: data.name,
        picture: data.picture,
      }
    },
    async () => {
      console.log("updating Me...");
      const {id, name, picture} = this.state.me
      const data = {id, name, picture}
      console.log("data: ");
      console.log(data);
      fetch(`https://waldo.jonathan-ray.com/generate-user`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .catch(e => console.log("error: ", e))
      .then(async (response) => {
        const {user} = await response.json();
        console.log("Working on getting team assignment...");
        console.log("user: ", user);
        const {team} = user
        return team;
      })
      .then(team => {
        this.setState({
          me : {
            ... this.state.me,
            team,
          }
        },
        ()=> {console.log(`Team assignent is ${team}.`);console.log(this.state.me);})
      })
    })
  }

  // _getLocationAsync = async () => {
  //   // We check for Permissions but don't do anything with it
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);

  //   Location.watchPositionAsync(
  //     {
  //       timeInterval: 500, 
  //       accuracy : 5, 
  //       distanceInterval : 10
  //     }, 
  //     location => {
  //         this.setState({ 
  //           latitude : location.coords.latitude,
  //           longitude : location.coords.longitude,
  //           coordsAccuracy : location.coords.accuracy,
  //         }, ()=>{
  //           if (this.state.socketOn){
  //             console.log("location set")
  //             console.log("sending new coords to API")
  //             this.connection.send(JSON.stringify({
  //               // need a dynamic user identifier
  //               type: 'user',
  //               user: {
  //                 id: 1,
  //                 latitude : location.coords.latitude,
  //                 longitude : location.coords.longitude,  
  //               },
  //             }))
  //           }
  //           else{
  //             console.log("Tried sending new coords to API, but socket isn't online.");
  //           }
  //         });
  //     }
  //   );

  //   Location.watchHeadingAsync((heading) => 
  //   {
  //     if(Math.abs(heading.trueHeading - this.state.heading) > 30){
  //       this.setState({ 
  //         heading: heading.trueHeading, 
  //         accuracy: heading.accuracy,
  //       }, ()=>console.log("heading set"));
  //     }
  //   });
  // };

  // _fetchTargetCoords = async () => {
  //   const dataString = await fetch('http://waldo.jonathan-ray.com/')
  //   const initialDataSet = await dataString.json();
  //   // initialDataSet contains: 
  //   // {
  //   //   "flag": {
  //   //     "1": {
  //   //       "latitude": 33.7892719875234,
  //   //       "longitude": -84.3732207378365,
  //   //     },
  //   //   },
  //   //   "users": {
  //   //     "1": {
  //   //       "latitude": 33.7864576152285,
  //   //       "longitude": -84.3775846622431,
  //   //       "name": "Joe",
  //   //       "pic": null,
  //   //     },
  //   //     "2": {
  //   //       "latitude": 33.7939726458984,
  //   //       "longitude": -84.3699373087979,
  //   //       "name": "Leslie",
  //   //       "pic": null,
  //   //     },
  //   //     "3": {
  //   //       "latitude": 33.7836522399115,
  //   //       "longitude": -84.371677005656,
  //   //       "name": "Margaret",
  //   //       "pic": null,
  //   //     },
  //   //   },
  //   // } 
  //   this.setState({
  //     users: initialDataSet.users,
  //     targetCoords: {
  //       latitude: initialDataSet.flag[1].latitude,
  //       longitude: initialDataSet.flag[1].longitude,
  //     }
  //   })
  // }

  // _socketToMe = () => {
  //   const url = 'ws://waldo.jonathan-ray.com/ws';
  //   this.connection = new WebSocket(url);
  //   this.connection.onopen = () => {
  //     this.setState({socketOn : true})
  //   }    
  //     this.connection.onmessage = ({data}) => {
  //       console.log(data);
  //       console.log(" ");
  //       console.log("The backend sent a socket connention... was it supposed to?");
  //       console.log(" ");
  //       const dataJson = (JSON.parse(data));
  //       console.log(dataJson);
  //       switch(dataJson.type){
  //         case("flag"):
  //           const id = Object.keys(dataJson.flag)[0];
  //           this.setState({
  //             targetCoords: {
  //               latitude: dataJson.flag[id].latitude,
  //               longitude: dataJson.flag[id].longitude,
  //             }
  //           });
  //           break;
  //         case("user"):
  //           // update the "All Users Object" in state
  //           this.setState({
  //             users: {...this.state.users, ...dataJson.user}
  //           });
  //           break;
  //         default: 
  //           break;
  //       }
  //     };
  //     // this.connection.onerror(err => console.log("error!! ", err))
  //     this.connection.onerror = (err) => console.log(`Websocket errored: ${err.message}`);
  //     this.connection.onclose = () => {
  //       this.setState({socketOn: false},
  //         () => {
  //           console.log(" ");
  //           console.log(" ");
  //           console.log(" ");
  //           console.log("Lost the websocket!");
  //           console.log(" ");
  //           console.log(" ");
  //           console.log("trying again...");
  //           setTimeout(this._socketToMe, 300);
  //         })
  //     };
  //   // };

  // }
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