import React from 'react';
import { Platform, Text, View, StyleSheet, Image, } from 'react-native';
import { MapView } from 'expo';
import centroidCoords from '../utils/centroidCoords';

export default function Map(props){
    let userPins = [];
    let arrayOfCoords = [];
    props.users.forEach(({id, name, latitude, longitude, picture}) => {
      // create the array of Markers
      userPins.push(        
        <MapView.Marker
          coordinate={{
            latitude,
            longitude,   
          }}
          title={name}
          key={id}
          // {tagged? description={"TAGGED"} : null}
        >
          {/* this is where the player's picture goes */}
          {picture ? <Image source={require('./waldo-arrow.png')} style={{width: 30, height: 30,}} />  : null}
        </MapView.Marker>
      )
      // create the array of coordinates for centroid calc
      arrayOfCoords.push({x: latitude, y:longitude})
    })
    // find where the center of the map should be
    const centroid = centroidCoords(arrayOfCoords)
    // find appropriate deltas for lat/long
    arrayOfCoords.sort((a, b) => (a.x > b.x) ? 1 : -1)
    const latitudeDelta = arrayOfCoords[arrayOfCoords.length-1].x - arrayOfCoords[0].x + 0.005
    arrayOfCoords.sort((a, b) => (a.y > b.y) ? 1 : -1)
    const longitudeDelta = arrayOfCoords[arrayOfCoords.length-1].y - arrayOfCoords[0].y + 0.0005
    return (
      <MapView
        style={props.style}
        initialRegion={{
          latitude: centroid.x,
          longitude: centroid.y,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        }}
      >
        {userPins}
      </MapView>
    );
};