import React from 'react';
import { MapView } from 'expo';
import MapPins from './MapPins';

export default function Map(props){
  // concerned that because <Map/> is getting updated user props to pass
  // to MapPins, it might be re-rendering the map unnecessarily
    return (
      <MapView
        style={props.style}
        initialRegion={{
          latitude: props.me.latitude,
          longitude: props.me.longitude,
          latitudeDelta: 0.015,
          longitudeDelta:  0.0015,
        }}
      >
        {/* {userPins} */}
        <MapPins users={props.users} />
      </MapView>
    );
};