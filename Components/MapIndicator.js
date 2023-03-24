import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { mainColor, windowWidth } from './CONSTANTS'

const MapIndicator = ({type}) => {
  return (
    <View style={[styles.indicator]}>
      <Text style={[{letterSpacing:1,fontWeight:'bold',color:mainColor}]}>{type}</Text>
    </View>
  )
}

export default MapIndicator


const styles=StyleSheet.create({

    indicator:{
        position:'absolute',
        left:windowWidth*0.02,
        zIndex:1,
        backgroundColor:'white',
        shadowColor: '#000000', // Set the shadow color to black
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        top:5,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        padding:10

    },
  

})