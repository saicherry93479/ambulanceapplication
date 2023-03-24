import { View, Text,ActivityIndicator,StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
// import { ActivityIndicator } from 'react-native-web
import { mainColor, windowHeight } from './CONSTANTS'
import { StatusBar } from 'react-native'
// import { StyleSheet } from 'react-native'

const LoadingScree = () => {
  return (
    <SafeAreaView>
        <StatusBar
        animated={true}
        backgroundColor="white"
        barStyle={'dark-content'}
      
      />
        <View style={[styles.container]}>
            {/* <Text>hii</Text> */}
            <ActivityIndicator size='large' color={mainColor}></ActivityIndicator>

        </View>
    </SafeAreaView>
  )
}

export default LoadingScree



const styles=StyleSheet.create({

    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        height:windowHeight,
        backgroundColor:"white"

      },

})