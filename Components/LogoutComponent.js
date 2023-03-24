import { TouchableOpacity, Text, StyleSheet,SafeAreaView } from 'react-native'
import React, { useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from './CONSTANTS'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Storage } from 'expo-storage'
import { useNavigation, useNavigationBuilder } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { TouchableOpacity } from 'react-native-web';

const LogoutComponent = () => {
    const {setUserDetails,showToastWithGravity,setNumber,setRide}=useContext(AppContext)
    const navigation=useNavigation()
    const signOutHandler=async ()=>{
        signOut(auth).then(async ()=>{
            setUserDetails(null)
            setNumber('')
            setRide(null)

            showToastWithGravity('signin sucessfull')
            navigation.navigate('login')
            console.log("signed out sucessfully ")
            try{
                await Storage.removeItem({ key: 'user' }) 
                console.log('removed sucessfully')
            } catch(e){
                console.log('unable to remove ',e)
            }
        }).catch(err=>{
            console.log('error in signing out ',err)
            showToastWithGravity('unable to signin ')
            

        })
    }
  return (
    // <SafeAreaView>
        <TouchableOpacity style={[styles.logButton]} onPress={signOutHandler}>
        <MaterialIcons name="logout" size={24} color="gray" />
     
    </TouchableOpacity>
   
  )
}

export default LogoutComponent

const styles=StyleSheet.create({
    logButton:{
        padding:10,
        borderRadius:40,
        position:'absolute',
        right:10,
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
        alignItems:'center'

    }

})