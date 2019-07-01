import React from 'react';
import { MapView } from 'expo';

function MapPins(props){
  let userPins = [];
  Object.keys(props.users).forEach(userId => {
    // create the array of Markers
    if(userId !== "null"){
      console.log("userId: ", userId);
      userPins.push(        
        <MapView.Marker
          coordinate={{
            latitude: props.users[userId].latitude,
            longitude: props.users[userId].longitude,   
          }}
          title={props.users[userId].name}
          key={userId}
          // {tagged? description={"TAGGED"} : null}
        >
          {/* this is where the player's picture goes */}
          {props.users[userId].picture ? <Image source={require('./waldo-arrow.png')} style={{width: 30, height: 30,}} />  : null}
        </MapView.Marker>
      )
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