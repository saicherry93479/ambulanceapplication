import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {Camera, CameraType} from 'expo-camera'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppContext, windowHeight, windowWidth } from './CONSTANTS'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location';
import LoadingScree from './LoadingScree'


const CameraPage = () => {
    const cameraref=useRef()
    const [hasPermission,setHasPermission]=useState()
    const [photo,setPhoto]=useState()
    const [type,setType]=useState(CameraType.back)
    const {setPatientCurrentCoords,patientCurrentCoords}=useContext(AppContext)
    const [loading,setLoading]=useState(false)

    const navigation=useNavigation()
    useEffect(()=>{

        
            async function cameraPermission(){
                console.log("getting camera permissions")
                const cameraPermission=await Camera.requestCameraPermissionsAsync()
                setHasPermission(cameraPermission.status==="granted")

            }
        cameraPermission()

    },[])

    useEffect(()=>{
        if(patientCurrentCoords===null){
          console.log('getting location in app useeffect')
            
        
         geoLocation()

        // return ()=>{}
          // setPatientCurrentCoords((async ()=>{await getLocation()})())
        }
    },[])

    const  geoLocation=async ()=>{
      
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('satus is ',status);
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
    
        try{
          console.log('geeteing locaion ')
    
          let location = await Location.getCurrentPositionAsync({});
          setPatientCurrentCoords(location);
          console.log('location  in is ',location)
        //   return location
    
        }catch(e){
          console.log('error in getting location is ',e)
        }
        
        // let location = await Location.getCurrentPositionAsync({});
        // console.log('location is ',location)
      
      }
      
    



    const takePic=async ()=>{
        const options={
            quality:1,
            base64:true,
            exif:false
        }
        const newPhoto=await cameraref.current.takePictureAsync(options)
        console.log("photo is ",Object.keys(newPhoto))
        console.log('photo uri ',newPhoto.uri)
        console.log('width is ',newPhoto.width)
        console.log('hwight is ',newPhoto.height)
        setPhoto(newPhoto)
    }   

   

    if(hasPermission===undefined){
        return <Text>Requesting Permissons....</Text>
    }else if(!hasPermission){
        return <Text>Permissons for camera not granted</Text>
    }

    const continueHandler=async ()=>{
        // try{
        //     const data=await axios.get(`http://localhost:8000/?base=hii`)
        //     console.log('data retirned is ',data)
        // }catch(e){
        //     console.log('error in continue  is ',e)
        // }
        try{
            // if(patientCurrentCoords===null){
            //     console.log('getting location from continue handleer')
            //    await getLocation()

            // }

            
            //TODO : before it is like this 
            // if(patientCurrentCoords!==null && patientCurrentCoords!==undefined){
            //     navigation.navigate('map')
            // }
            setLoading(true)
            console.log('fuuuuuu')
            setTimeout(()=>{
                navigation.navigate('emergencyPage')
            },10000)
            
        }catch(e){
            console.log("error in getting the location in continue  ",e)
        }

    }

  return (
    <SafeAreaView>
        <StatusBar
        animated={true}
        backgroundColor="black"
        barStyle={'light-content'}>

        </StatusBar>
        {loading?<LoadingScree></LoadingScree>:
        
       <><View>{photo ? <Image style={styles.preview} source={{ uri: photo.uri }} /> :
                  <Camera style={[styles.container]} ref={cameraref} type={type}>
                  </Camera>}
              </View><View style={[styles.cameraBottom]}>
                      {photo ? <View style={[styles.camerOptions]}>
                          <TouchableOpacity style={[styles.hideButton]}>

                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.cameraButton]} onPress={() => setPhoto(null)}>
                              <Entypo name="cross" size={35} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.cameraFlip]} onPress={continueHandler}>
                              <AntDesign name="arrowright" size={24} color="white" />

                          </TouchableOpacity>

                      </View> : <View style={[styles.camerOptions]}>
                          <TouchableOpacity style={[styles.cameraFlip]} onPress={() => setType(p => p === CameraType.front ? CameraType.back : CameraType.front)}>
                              <MaterialIcons name="flip-camera-android" size={30} color="white" />

                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.cameraButton]} onPress={takePic}>

                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.hideButton]}>

                          </TouchableOpacity>

                      </View>}

                  </View></>
}
{/* </View> */}

    </SafeAreaView>
  )
}

export default CameraPage

const styles=StyleSheet.create({
    container:{
        height:windowHeight*0.8,
        // flexBasis:'70%'
        // flex:1,
        // alignItems:'center',
        // justifyContent:"center"
    },
    buttonContainer:{
        backgroundColor:'#fff',
        alignSelf:'flex-end'
    },
    preview: {
        height:windowHeight*0.8
      },
    cameraBottom:{
        
        backgroundColor:'black',
        height:windowHeight*0.2

    },
    camerOptions:{
        padding:20,
        flexDirection:'row',
        // paddingTop:20,
        alignItems:"center",
        // gap:windowWidth*0.3
        paddingHorizontal:40,
        justifyContent:'space-between'
        // justifyContent:'space-around'

    },
    cameraFlip:{
        backgroundColor:'#8c8b8b',
        padding:10,
        borderRadius:50

    },
    cameraButton:{
        height:70,
        width:70,
        borderColor:'white',
        borderRadius:50,
        borderWidth:4,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
   
    hideButton:{
        height:40,
        width:40
        
    }

})