import React from 'react';
import { MapView } from 'expo';

export default function Map(props){
    let userPins = [];
    props.users.forEach(({id, name, latitude, longitude}) => {
      userPins.push(        
        <MapView.Marker
          coordinate={{
            latitude,
            longitude,  
          }}
          title={name}
          key={id}
          // description={"desss"}
        />
      )
    })
    return (
      <MapView
        style={props.style}
        initialRegion={{
          latitude: 33.78724001903128,
          longitude: -84.3727580424407,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
      >
        {userPins}
      </MapView>
    );
};