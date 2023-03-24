import { View, Text, StyleSheet} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import MapView, { Marker,Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import { AppContext } from './CONSTANTS';
import axios from 'axios';
import LogoutComponent from './LogoutComponent';
import * as TaskManager from "expo-task-manager"
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import MapIndicator from './MapIndicator';
import CompleteButton from './CompleteButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from './CommonStyles';
// import * as Location from "expo-location"



// const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null

// Define the background task for location tracking
// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//   if (error) {
//     console.error(error)
//     return
//   }
//   if (data) {
//     // Extract location coordinates from data
//     const { locations } = data
//     const location = locations[0]
//     if (location) {
//       console.log("Location in background", location.coords)
//     }
//   }
// })


const MapPage = () => {
  const {ride,userDetails}=useContext(AppContext)
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef=useRef(null)
  const [patientCoords,setPatientCoords]=useState(null)
  const [driverIntialCoords,setDriverIntialCoords]=useState(null)
  const [hospitalCoords,setHospitalCoords]=useState(null)


  const [coords,setCords]=useState()
  const [coordsTwo,setCordsTwo]=useState()
  useEffect(() => {
    // if (!patientCurrentCoords ) return;

    console.log('-------------------->>>>>called $$$$$$$$$$$$$$$$$$$ ')

    var i = setInterval(() => {
      console.log("i Before", i);

      mapRef?.current?.fitToSuppliedMarkers(["origin", "destination",'hospital'], {
        edgePadding: {
          top: 200,
          right: 100,
          left: 100,
          bottom: 100,
          aimated: true,
        },
      });
      clearInterval(i);
      console.log("i After clear interval", i);
    }, 50);
  }, []);

  useEffect(() => {
    if(userDetails?.type==='Driver'){
      
      const requestPermissions = async () => {
        const foreground = await Location.requestForegroundPermissionsAsync()
        if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
      }
      requestPermissions()
      startForegroundUpdate()
    }
    return ()=> foregroundSubscription?.remove()
    
  }, [userDetails])

  const startForegroundUpdate = async () => {
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove()

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      async (location) => {
        // console.log('location is ',location.coords)
        try{
          const docRef=doc(db,'rides',ride.number)
          await updateDoc(docRef,{
            positionLongitude:location.coords.longitude,
            positionLatitude:location.coords.latitude
            })
          

        }catch(e){
          console.log('unable to update the location live one ')

        }
      }
    )
  }

  useEffect(()=>{
    const patient = {
      "accuracy": 14.295000076293945,
      "altitude": -57.5,
      "altitudeAccuracy": 1,
      "heading": 0,
      "latitude": ride.patientLatitude,
      "longitude": ride.patientLongitude,
      "speed": 0,
    }
    const driver = {
      "accuracy": 14.295000076293945,
      "altitude": -57.5,
      "altitudeAccuracy": 1,
      "heading": 0,
      "latitude": ride.intialDriverLatitude,
      "longitude": ride.intialDriverLongitude,
      "speed": 0,
    }
    const hospital= {
      "accuracy": 14.295000076293945,
      "altitude": -57.5,
      "altitudeAccuracy": 1,
      "heading": 0,
      "latitude": ride.hospitalLatitude,
      "longitude": ride.hospitalLongitude,
      "speed": 0,
    }
    // console.log(patient)
    // console.log(driver)
    // console.log('hospital is ',hospital)
    setPatientCoords(patient)
    setDriverIntialCoords(driver)
    setHospitalCoords(hospital)

  },[])

  useEffect(() => {
    // console.log('came into useeffect ')
    // console.log('patient location is ',patientCurrentCoords)
    // if(!patientCurrentCoords) return 
    if(!hospitalCoords || !patientCoords || !driverIntialCoords ) return
    getCords()
    getCordsTwo()
  }, [hospitalCoords,patientCoords,driverIntialCoords]);



  const getCordsTwo=async ()=>{
    // console.log('patient location is ',patientCurrentCoords)
    const url=`https://api.mapbox.com/directions/v5/mapbox/driving/${patientCoords.longitude}%2C${patientCoords.latitude}%3B${hospitalCoords.longitude}%2C${hospitalCoords.latitude}?alternatives=true&geometries=geojson&overview=full&steps=false&access_token=sk.eyJ1Ijoic2FpY2hlcnJ5IiwiYSI6ImNsZmJoYWJiYTBlcXozcG4xMHdsMXZyMXAifQ.6WWiJY1CPKIY2viyzjyxkA`
    // const url=`https://api.mapbox.com/directions/v5/mapbox/driving/${ride.PatientLongitude}%2C${ride.patientLatitude}%3B${tokyoRegion.longitude}%2C${tokyoRegion.latitude}?alternatives=true&geometries=geojson&overview=full&steps=false&access_token=sk.eyJ1Ijoic2FpY2hlcnJ5IiwiYSI6ImNsZmJoYWJiYTBlcXozcG4xMHdsMXZyMXAifQ.6WWiJY1CPKIY2viyzjyxkA`
   
    // console.log('url is  is ',url)
    try{
      const data=await axios.get(url)
      // console.log('data is ',data)
      // const jsonData=await data.json()
      let dat=data['data']['routes']?.[0]?.['geometry']?.['coordinates']
      let coordinates=[]
      // coordinates.push(tokyoRegion)
      for(let i=0;i<dat.length;i++){
          let obj={
              longitude : dat[i][0],
              latitude : dat[i][1],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
          }
          coordinates.push(obj)
  
      }
      // console.log('dat is ',coordinates[0])
      // console.log('region is ',chibaRegion)
      setCordsTwo(coordinates)
    }
    catch(e){
      console.log("exception is in coords two  ",e)
    }
 
}



  const getCords=async ()=>{
    // console.log('patient location is ',patientCurrentCoords)
    const url=`https://api.mapbox.com/directions/v5/mapbox/driving/${patientCoords.longitude}%2C${patientCoords.latitude}%3B${tokyoRegion.longitude}%2C${tokyoRegion.latitude}?alternatives=true&geometries=geojson&overview=full&steps=false&access_token=sk.eyJ1Ijoic2FpY2hlcnJ5IiwiYSI6ImNsZmJoYWJiYTBlcXozcG4xMHdsMXZyMXAifQ.6WWiJY1CPKIY2viyzjyxkA`

    //  console.log('url is  is ',url)
    try{
      const data=await axios.get(url)
      // console.log('data is ',data)
      // const jsonData=await data.json()
      let dat=data['data']['routes']?.[0]?.['geometry']?.['coordinates']
      let coordinates=[]
      // coordinates.push(tokyoRegion)
      for(let i=0;i<dat.length;i++){
          let obj={
              longitude : dat[i][0],
              latitude : dat[i][1],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
          }
          coordinates.push(obj)
  
      }
      // console.log('dat is ',coordinates[0])
      // console.log('region is ',chibaRegion)
      setCords(coordinates)
    }
    catch(e){
      console.log("exception is ",e)
    }
 
}



  // useEffect(()=>{
  //   if(!patientCurrentCoords) return 

  //   mapRef.current.fitToSuppliedMarkers(['origin'],{edgePadding:{top:50,right:50,bottom:50,left:50}})
  // },[patientCurrentCoords])

  const tokyoRegion = {
    "accuracy": 14.295000076293945,
    "altitude": -57.5,
    "altitudeAccuracy": 1,
    "heading": 0,
    "latitude": 12.9249,
    "longitude": 80.23,
    "speed": 0,
  }
  const westRegion = {
    "accuracy": 14.295000076293945,
    "altitude": -57.5,
    "altitudeAccuracy": 1,
    "heading": 0,
    "latitude": 24.382460,
    "longitude": 80.1000,
    "speed": 0,
  }


  return (
    <SafeAreaView>
       <MapIndicator type={userDetails?.type}></MapIndicator>
      {userDetails?.type==='Driver'?<CompleteButton></CompleteButton>:<></>}
      <LogoutComponent></LogoutComponent>
    <View style={[commonStyles.container,{paddingHorizontal:0,paddingVertical:0}]}>
     
      {/* <Text style={styles.paragraph}>{JSON.stringify(patientCurrentCoords?.coords)}</Text> */}
      <MapView style={[styles.container]}  mapType={"mutedStandard"}  ref={mapRef}  >
       {patientCoords ? <Marker coordinate={tokyoRegion} identifier='origin' ></Marker>:<></>}
       {driverIntialCoords? <Marker coordinate={driverIntialCoords}  identifier='destination'></Marker>:<></>}
       {/* <Marker coordinate={westRegion} identifier='destionationTwo'></Marker> */}
       {coords && <Polyline
            strokeColor={"black"}
            strokeWidth={4}
            lineDashPattern={[1]}
            coordinates={coords}
            ></Polyline>}
              {coordsTwo && <Polyline
            strokeColor={"green"}
            strokeWidth={4}
            lineDashPattern={[1]}
            coordinates={coordsTwo}
            ></Polyline>}
            {hospitalCoords ?<Marker coordinate={hospitalCoords}  identifier='hospital' ></Marker>:<></>}
            {ride?<Marker coordinate={{
              "accuracy": 14.295000076293945,
              "altitude": -57.5,
              "altitudeAccuracy": 1,
              "heading": 0,
              "latitude": ride.positionLatitude,
              "longitude": ride.positionLongitude,
              "speed": 0
            }}>
              <CustomMarker />

            </Marker>:<></>}

      </MapView>

      
    </View>
  </SafeAreaView> 
  );
}

export default MapPage

function CustomMarker() {
  return (
    <View style={styles.marker}>
      {/* <Text style={styles.color}>Tokyo</Text> */}
      <View style={styles.markerTwo}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {


    // width:50,
    // height:50,
       
    // borderRadius: 50,
    padding:10,
    display:'flex',
    alignItems:'center',
    justifyContent:"center",
     borderRadius: 50,
    
    
  
    // padding:5,
    backgroundColor:'rgba(52, 177, 235,0.7)',
    
    // paddingVertical: 10,
    // paddingHorizontal: 30,
    // backgroundColor: "#007bff",
    // borderColor: "#eee",
    // borderRadius: 5,
    elevation: 100000,
    

    

  },
  markerTwo:{
    // width: 20,
    // height:20,
    backgroundColor:'#34a8eb',
    borderRadius:20,
    width:20,
    height:20,
    // margin:20


  }

});

