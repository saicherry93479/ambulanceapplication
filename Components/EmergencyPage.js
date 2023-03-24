import { View, Text,  TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { commonStyles } from './CommonStyles'
import { AppContext, windowHeight } from './CONSTANTS'
import LoadingScree from './LoadingScree'
import { collection, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { sendPushNotification } from '../utils/Utils'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import LogoutComponent from './LogoutComponent'
// import { ActivityIndicator } from 'react-native-web'

const EmergencyPage = () => {

    const [loading,setLoading]=useState(false)
    // const {showToastWithGravity}=useContext(AppContext)
    const {showToastWithGravity,userDetails,patientCurrentCoords,ride}=useContext(AppContext)
    const [tokes,setTokens]=useState(null)
    const navigation=useNavigation()
    // const [userDetails,setUserDetails]=useState({
    //     number: "9133662352",
    //     token: "ExponentPushToken[bmyh4ONtdk3adrYxSC6vn2]",
    //     type: "Patient"
    //   })
    //   const [patientCurrentCoords,setPatientCurrentCoords]=useState({
    //     coords:{
    //         accuracy: 14.838000297546387,
    //         altitude: -57.5,
    //         altitudeAccuracy: 1,
    //         heading: 0,
    //         latitude: 12.9462489,
    //         longitude: 80.2324988,
    //         speed: 0,
    //       }
    //   })
    useEffect(()=>{
        if(ride && ride?.taken===true){
            console.log('i am only ')
            navigation.navigate('map')

        }
    },[ride])
    useEffect(()=>{

        console.log("##################################################")
        console.log("EmergencyPage")
        console.log('user details are ',userDetails)
        // console.log('patient coords are ',patientCurrentCoords.coords)
        console.log("##################################################")

    },[])

    useEffect(()=>{
        if(!userDetails || !patientCurrentCoords) return
        addRide()
        

    },[])

    const addRide=async ()=>{
        console.log("##################################################")
        console.log('add ride ')
        let hospital={}
        try{
            const url=`https://discover.search.hereapi.com/v1/discover?at=${patientCurrentCoords.coords.latitude},${patientCurrentCoords.coords.longitude}&limit=10&q=near+hospitals+to+me&apiKey=SXfvTSzHGo4lbMGo1dihsyVKdZc9hKqCqgNym01WA5c`
            const data=await axios.get(url)
            // console.log('data in fetch is ',data)
            hospital=data.data.items[0].position
        }catch(e){
            console.log('unable to get the data ',e)

        }

        const data={token:userDetails.token,number:userDetails.number,
            patientLongitude:patientCurrentCoords.coords.longitude,
            patientLatitude:patientCurrentCoords.coords.latitude,
            taken:false,
            hospitalLatitude:hospital.lat,
            hospitalLongitude:hospital.lng
        }
        console.log('data is ',data)
        try{
            console.log('sending to datbases')
            await setDoc(doc(db,'rides',userDetails.number),data)
            showToastWithGravity('wait click to add send requests')
            
        }catch(e){
            console.log('erro in sending to firestore ',e)
            showToastWithGravity('error in sending the rides ')

        }

        console.log("##################################################")


        
    }



    const buttonHandler=async ()=>{


       
        showToastWithGravity('sending the ride requests')
        try{
            
            const colRef=collection(db,'users')
            const q=query(colRef,where('type','==','Driver'))
            console.log('colref is ',typeof colRef)
            console.log('q is ',typeof q)
            
            const docsSnap=await getDocs(q)
            let tokens=[]
            docsSnap.forEach(doc=>{
                console.log('doc is ',doc.data())
                if(tokens.includes(doc.data().token)){

                } else{
                tokens.push(doc.data().token)
                }
            })
            setTokens(tokens)
            console.log('tokens are ',tokens)
            for(let i=0;i<tokens.length;i++){
              
                sendPushNotification(tokens[i],userDetails.number)

                
            }


            


        }catch(e){
            console.log('exception is ',e)
            showToastWithGravity('error try again')


        }

        
    }
  return (
    <SafeAreaView style={[{backgroundColor:"white"}]}>
        <View style={[commonStyles.container]}>
        <LogoutComponent ></LogoutComponent>
       {
            loading ?<LoadingScree></LoadingScree> :<View style={[styles.container]}>
            <Text style={[styles.emergencyext]}>It is an Emergency</Text>
            <TouchableOpacity style={[commonStyles.button]} onPress={buttonHandler}>
                <Text style={[commonStyles.buttonText]}>Contact Ambulances</Text>
            </TouchableOpacity>
        </View>
        }
        </View>
    </SafeAreaView>
  )
}

export default EmergencyPage

const styles=StyleSheet.create({
    container:{
            height:windowHeight,
            justifyContent:'center'
    },emergencyext:{
        textAlign:'center',
        marginBottom:20,
        fontSize:20,


    }

})