import React from 'react';
import { 
  Platform, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  Dimensions, 
  View, 
  TouchableOpacity, 
  RCTNetworking,
  NativeModules,
} from 'react-native';
import Arrow from './Arrow';
import Tag from './Tag';
import { Constants, Location, Permissions, MapView, WebBrowser } from 'expo';
import MapPins from './MapPins';
import distVincenty from '../utils/distVincenty';

import { connect } from "react-redux";
import { updateCoords, sleep, play } from "../redux/actions";

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

class Telemetry extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      heading: null,
      users: {},
      flag: null,
      me:{
        id : null,
        latitude: null,
      }
    };
  }
  componentDidMount(){  
    this._getFlagAndUserCoords();
    if(this.scrollView){
      setTimeout(()=> this.scrollView.scrollTo({x: width}), 1000);
    }
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   // Want to check if everything BUT the 'me' object in State is the same.
  //   const shouldRender = (this.state.me && this.state.me.latitude )|| false ? true : false;
  //   if(this.state.me.id){
  //     console.log("Condition 1: this.state.me.id ");
  //   }
  //   else{
  //     console.log("Fail this.state.me");
  //   }
  //   if(this.state.me.id && this.state.me.latitude){
  //     console.log("Condition 2:  this.state.me.latitude ");
  //   }
  //   else{
  //     console.log("Fail this.state.me.latitude ");
  //   }
  //   if((this.state.me && this.state.me.latitude) && !shouldRender){
  //     if(this.state.me.latitude != nextState.me.latitude){
  //       console.log(" ");
  //       console.log("shouldComponentUpdate SHOULD return false");
  //     }
  //     if(this.state != nextState){
  //       thisStateKeys = Object.entries(this.state).filter(key => key[0] != 'me' );
  //       nextStateKeys = Object.entries(nextState).filter(key => key[0] != 'me' );
  //       thisStateKeys.sort((a,b) => a[0]-b[0]);
  //       nextStateKeys.sort((a,b) => a[0]-b[0]);
  //       console.log("The keys comparison method worked!");
  //       if(this.state.me.latitude != nextState.me.latitude){
  //         console.log("shouldComponentUpdate is working as intended!");
  //         console.log(" ");
  //         console.log(" ");
  //         console.log(" ");
  //         console.log(" ");
  //         return false;
  //       }
  //       console.log("But the function doesn't think the position updated.");
  //       console.log(" ");
  //       console.log(" ");
  //       console.log(" ");
  //       console.log(" ");
  //     }
  //     if(this.state.me.latitude != nextState.me.latitude){
  //       console.log("You need to rewrite your shouldComponentUpdate method.");
  //       console.log(" ");
  //       console.log(" ");
  //       console.log(" ");
  //       console.log(" ");
  //     }
  //   }
  //   return true;
  // }
  render() {
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log("The following is coming from Redux!");
    console.log(this.props.meRedux);
    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log(" ");
    const shouldRender = (this.props.me.id && this.state.me.latitude) || false ? true : false;
    return(
      <>
      {shouldRender? 
        <ScrollView 
          // style={styles.container}
          ref={(scrollView) => { this.scrollView = scrollView; }}    
          horizontal= {true}
          // decelerationRate={0.9} // 'fast'
          decelerationRate={0} // 'new speed'
          snapToInterval={width}
          snapToAlignment={"center"}
          height={width}
        >
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: this.state.me.latitude,
            longitude: this.state.me.longitude,
            latitudeDelta: 0.015,
            longitudeDelta:  0.0015,
          }}
          > 
          <MapPins users={this.state.users} />
        </MapView>
        {this.state.flag && this.state.me.latitude? <Arrow style={styles.arrow} heading={this.state.heading} width={width} flag={this.state.flag} flagId={this.props.flagId} user={this.state.users[this.props.me.id]} /> : null}
        <Tag style={styles.tag} width={width} />
        </ScrollView>
      : null}
      

      <TouchableOpacity onPress={this._signOut}>
        <Text>
          You are on Team {this.props.flagId}.
        </Text>
      </TouchableOpacity>


      <View style={{flexDirection: 'row', height:'15%'}}>
        <View style={{flex: 0.5, height:'100%' , width:'50%',}} >
          <TouchableOpacity style={{opacity: this.state.decoyDisable? .2 : 1 }} onPress={this._deployDecoy} disabled={this.state.decoyDisable} >
            <Image
              style={{
                width:"100%", 
                height:"100%", 
              }}
              source={require('../assets/decoy_progress.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.5, height:'100%' , width:'50%',}} >
        <TouchableOpacity style={{opacity: this.state.hintDisable? .2 : 1 }} onPress={this._displayHint} disabled={this.state.hintDisable} >
            <Image
              style={{
                width:"100%", 
                height:"100%", 
              }}
              source={require('../assets/hint_progress.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      </>
    )
  }


  _watchForChanges = async () => {
    // We need to check for Permissions but don't do anything with it
    console.log("_watchForChanges firing");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    Location.watchPositionAsync(
      {
        timeInterval: 500, 
        accuracy : 5, 
        distanceInterval : 10
      }, 
      (location) => {
        console.log("... detected change in location");
        const { coords, } = location
        console.log("tele coords: ", coords);
        this.props.updateCoords({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        const { latitude, longitude, } = coords
          if(this.state.users){
            this.setState({ 
              me: {
                  ... this.state.me,
                  latitude,
                  longitude,
                }
              }, ()=>{
              if (this.state.socketOn){
                console.log("location set")
                console.log("sending new coords to API")
                this.connection.send(JSON.stringify({
                  type: 'user',
                  user: {
                    id: this.props.me.id,
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
    const dataString = await fetch(`https://waldo.jonathan-ray.com/first/${this.props.flagId}`)
    const {flag, users} = await dataString.json();
    console.log("_getFlagAndUserCoords ran");
    this.setState({ flag, users }, () =>  {
      console.log("_getFlagAndUserCoords setState was successful");
      this._socketToMe();
      this._watchForChanges();
    })
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
    const url = 'wss://waldo.jonathan-ray.com/ws';
    this.connection = new WebSocket(url);
    this.connection.onopen = () => {
      console.log("a socket was established");
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
          if(dataJson.flag[this.props.flagId] || false){
            this.setState({
              flag: {
                [this.props.flagId] : {
                  latitude: dataJson.flag[this.props.flagId].latitude,
                  longitude: dataJson.flag[this.props.flagId].longitude,
                }
              },
              decoyDisable: dataJson.flag[this.props.flagId].decoy,
            });
          }
          break;
        case("user"):
          // update the "All Users Object" in state
          if(dataJson.user.team === this.props.flagId){
            this.setState({
              users: {...this.state.users, ...dataJson.user}
            }, () => console.log(this.state.users));
          }
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
          console.log(`${this.props.me.name}-${this.props.me.id} Lost the websocket!`);
          console.log(" ");
          console.log(" ");
          console.log("trying again...");
          setTimeout(this._socketToMe, 300);
        })
    };
  }

  _deployDecoy = () => {
    if(this.state.socketOn && this.state.users){
      const {latitude, longitude} = this.state.me
      let flagId = this.props.flagId === 1? 2 : 1;

      // Lock the user out for some timeout
      // // by setting a bool to state that 
      // // will disable the Decoy button.
      this.setState({decoyDisable : true},
        () => setTimeout(() => this.setState({decoyDisable : false}), 1000 * 5)
      )

      this.connection.send(JSON.stringify({
        type: 'flag',
        decoy: true,
        flag: {
          id: flagId,
          latitude,
          longitude,  
        },
      }))
    }
  }

  _displayHint = () => {
    this.setState({hintDisable : true},
      () => setTimeout(() => this.setState({hintDisable : false}), 1000 * 5)
    )
    const {flag, me} = this.state
    const lat1 = me.latitude
    const lon1 = me.longitude
    const lat2 = flag[this.props.flagId].latitude
    const lon2 = flag[this.props.flagId].longitude
    const distance = distVincenty(lat1, lon1, lat2, lon2)
    console.log("distance to target in meters: ", distance);
  }

  _signOut = async () => {
    if (this.state.socketOn){
      console.log("Signing user out");
      this.connection.send(JSON.stringify({
        type: 'user',
        action: 'remove',
        user: {
          id: this.props.me.id,
        },
      }))
      console.log("Message sent.");
      this.props.logout()
    }
    else{
      console.log("Socket not available at this time.");
    }
    // const value = await WebBrowser.openBrowserAsync('https://dev-35k9xvev.auth0.com/v2/logout?federated&returnTo=http://google.com&client_id=YSecAbQYWIe51VyQV9yZwOsm0yHe7UD0')
    // console.log(value);
    // const Networking = NativeModules.Networking;
    // Networking.clearCookies((cleared) => {
    // console.debug('cleared hadCookies: ' + cleared.toString());
    // });
    // RCTNetworking.clearCookies(() => {});
  }
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
)(Telemetry);