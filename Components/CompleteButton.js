import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { AppContext, mainColor, windowWidth } from './CONSTANTS'
import { db } from '../firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'
// import { TouchableOpacity } from 'react-native-web'

const CompleteButton = () => {
    const {ride,showToastWithGravity}=useContext(AppContext)
    const navigation=useNavigation()

    const deletHandler=async ()=>{

        try{
            await deleteDoc(doc(db,'rides',ride.number))
            console.log('deleted ride sucessfully')
            navigation.navigate('mainScreen')
            showToastWithGravity("completed ride")

        }catch(e){
            console.log('unable to delet ',e)
            showToastWithGravity("unable to do request")
        }
    }
  return (
    <TouchableOpacity onPress={deletHandler} style={[styles.button,{backgroundColor:mainColor}]} >
      <Text style={[{letterSpacing:1,fontWeight:'bold',color:'white'}]}>completed </Text>
    </TouchableOpacity>
  )
}

export default CompleteButton

const styles=StyleSheet.create({

    button:{
        position:'absolute',
        left:windowWidth*0.22,
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