import React from 'react';
import { Platform, Text, View, StyleSheet, Image, Dimensions, } from 'react-native';

export default function Tag(props){
  return(
    < View style={props.style}>
      <Text style={styles.paragraph}>
        This is where tagging will be implemented.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  paragraph: {
    // marginTop: 24,
    fontSize: 18,
    textAlign: 'center',
    left: 0,
  },
});