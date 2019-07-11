import React from 'react';
import { Image, } from 'react-native';
import { MapView } from 'expo';

function MapPins(props){
  let userPins = [];
  Object.keys(props.users).forEach(userId => {
    // create the array of Markers
    if(userId === "YSecAbQYWIe51VyQV9yZwOsm0yHe7UD0"){
      console.log(props.users[userId]);
    }
    const title = userId === "YSecAbQYWIe51VyQV9yZwOsm0yHe7UD0"? "Google" : "Facebook";
    if(userId !== "null"){
      if(props.users[userId].latitude){
        console.log("props.users[userId]: ", props.users[userId]);
        userPins.push(        
          <MapView.Marker
            coordinate={{
              latitude: props.users[userId].latitude,
              longitude: props.users[userId].longitude,   
            }}
            title={title}
            key={userId}
            // {tagged? description={"TAGGED"} : null}
          >
            {/* this is where the player's picture goes */}
            {/* {props.users[userId].picture ? <Image source={require('./waldo-arrow.png')} style={{width: 30, height: 30,}} />  : null} */}
            {props.users[userId].picture ? <Image source={{uri:props.users[userId].picture}} style={{width: 30, height: 30, borderRadius: 15,}} />  : null}
          </MapView.Marker>
        )
      }
    }
    else{
      console.log("ALMOST GOT ME");
    }
    
  })
  // console.log("userPins: ");
  // console.log(userPins);
  return(
  <>
    {userPins}
  </>
  )
}
export default MapPins;