import React from 'react';
import { MapView } from 'expo';

export default class Map extends React.Component {
  constructor(props){
    super(props)
    // console.log("props", props);
    // console.log("props", props);
    // console.log("props", props);
    // console.log("props", props);
  }
  render() {
    return (
      <MapView
        style={this.props.style}
        initialRegion={{
          latitude: 33.78724001903128,
          longitude: -84.3727580424407,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
      />
    );
  }
};