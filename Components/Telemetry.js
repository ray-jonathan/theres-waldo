import React from 'react';
import { Platform, Text, ScrollView, StyleSheet, Image, Dimensions, } from 'react-native';
import Arrow from './Arrow';
import Tag from './Tag';
import { Constants, Location, Permissions, MapView } from 'expo';
import MapPins from './MapPins';

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
    super(props);
    this.state = {
      heading: null,
      users: null,
      flag: null,
    };
  }
  componentDidMount(){  
    this.scrollView.scrollTo({x: width});
    this._getFlagAndUserCoords();
    this._socketToMe();
    this._watchForChanges();
  }
  render() {
    return(
      <ScrollView 
        // style={styles.container}
        ref={(scrollView) => { this.scrollView = scrollView; }}    
        horizontal= {true}
        decelerationRate={0.9} // 'fast'
        snapToInterval={width}
        snapToAlignment={"center"}
      >
        {this.state.users? 
        <>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: this.state.users[this.props.meId].latitude,
              longitude: this.state.users[this.props.meId].longitude,
              latitudeDelta: 0.015,
              longitudeDelta:  0.0015,
            }}
          > 
            <MapPins users={this.state.users} />
          </MapView>
          {this.state.flag? <Arrow style={styles.arrow} heading={this.state.heading} width={width} flag={this.state.flag} flagId={this.props.flagId} user={this.state.users[this.props.meId]} /> : null}
          <Tag style={styles.tag} width={width} />
        </>
        : null}
      </ScrollView>
    )
  }


  _watchForChanges = async () => {
    // We need to check for Permissions but don't do anything with it
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    Location.watchPositionAsync(
      {
        timeInterval: 500, 
        accuracy : 5, 
        distanceInterval : 10
      }, 
      (location) => {
        const { coords, } = location
        const { latitude, longitude, } = coords
          this.setState({ 
            users: {
              ...this.state.users,
              [this.props.meId] : {
                ...this.state.users[this.props.meId],
                latitude,
                longitude,
              }
            }
          }, ()=>{
            if (this.state.socketOn){
              console.log("location set")
              console.log("sending new coords to API")
              this.connection.send(JSON.stringify({
                type: 'user',
                user: {
                  id: this.props.meId,
                  latitude : location.coords.latitude,
                  longitude : location.coords.longitude,  
                },
              }))
            }
            else{
              console.log("Tried sending new coords to API, but socket isn't online.");
            }
          });
      }
    );

    Location.watchHeadingAsync( 
      heading => {
        if(Math.abs(heading.trueHeading - this.state.heading) > 30){
          this.setState({ 
            heading: heading.trueHeading, 
          }, ()=>console.log("heading set"));
        }
      });
  };

  _getFlagAndUserCoords = async () => {
    const dataString = await fetch('http://waldo.jonathan-ray.com/')
    const {flag, users} = await dataString.json();
    this.setState({ flag, users })
    // dataString contains: 
    // {
    //   "flag": {
    //     "1": {
    //       "latitude": 33.7892719875234,
    //       "longitude": -84.3732207378365,
    //     },
    //   },
    //   "users": {
    //     "1": {
    //       "latitude": 33.7864576152285,
    //       "longitude": -84.3775846622431,
    //       "name": "Joe",
    //       "pic": null,
    //     },
    //     "2": {
    //       "latitude": 33.7939726458984,
    //       "longitude": -84.3699373087979,
    //       "name": "Leslie",
    //       "pic": null,
    //     },
    //     "3": {
    //       "latitude": 33.7836522399115,
    //       "longitude": -84.371677005656,
    //       "name": "Margaret",
    //       "pic": null,
    //     },
    //   },
    // } 
  }

  _socketToMe = () => {
    const url = 'ws://waldo.jonathan-ray.com/ws';
    this.connection = new WebSocket(url);
    this.connection.onopen = () => {
      this.setState({socketOn : true})
    }    
    this.connection.onmessage = ({data}) => {
      console.log(" ");
      console.log("The backend sent a socket connention... was it supposed to?");
      console.log(" ");
      const dataJson = (JSON.parse(data));
      console.log(dataJson);
      switch(dataJson.type){
        case("flag"):
          this.setState({
            flag: {
              [this.props.flagId] : {
                latitude: dataJson.flag[this.props.flagId].latitude,
                longitude: dataJson.flag[this.props.flagId].longitude,
              }
            }
          });
          break;
        case("user"):
          // update the "All Users Object" in state
          this.setState({
            users: {...this.state.users, ...dataJson.user}
          });
          break;
        default: 
          break;
      }
    };
    this.connection.onerror = (err) => console.log(`Websocket errored: ${err.message}`);
    this.connection.onclose = () => {
      this.setState({socketOn: false},
        () => {
          console.log(" ");
          console.log(" ");
          console.log(" ");
          console.log("Lost the websocket!");
          console.log(" ");
          console.log(" ");
          console.log("trying again...");
          setTimeout(this._socketToMe, 300);
        })
    };
  }
}