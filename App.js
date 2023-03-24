import { View, Text, TouchableOpacity, StatusBar,ToastAndroid } from 'react-native'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Components/LoginScreen';
import * as TaskManager from 'expo-task-manager';
import OtpScreen from './Components/OtpScreen';
import MainInjury from './Components/MainInjury';
import UserSelect from './Components/UserSelect';
import MainScreen from './Components/MainScreen';
import { AppContext } from './Components/CONSTANTS';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import MapPage from './Components/MapPage';
import SubInjury from './Components/SubInjury';
import CameraPage, { getLocation } from './Components/CameraPage';
import * as Location from 'expo-location';
import { Storage } from 'expo-storage'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {  registerForPushNotificationsAsync, setStorageItem } from './utils/Utils';
import EmergencyPage from './Components/EmergencyPage';
import Sample from './Components/Sample';
import { collection, doc, onSnapshot, onSnapshotsInSync, query, where } from 'firebase/firestore';
// import SampleUpdate from './Components/SampleUpdate';
// import SampleAppTwo from './Components/SampleTwo';





const Stack = createNativeStackNavigator();

const getLocationPermission=async ()=>{
  let { status } = await Location.requestForegroundPermissionsAsync();
  console.log('satus is ',status);
  if (status !== 'granted') {
    // setErrorMsg('Permission to access location was denied');
    return;
  }
}
const App = () => {
  // const navigation=useNavigation()
  const [userDetails,setUserDetails]=useState(null)
  const [user,setUser]=useState(null)
  const [token ,setToken]=useState(null)
  const [notification,setNotification]=useState(null)
  const notificationListener=useRef(null)
  const responseListener=useRef(null)
  const [number,setNumber]=useState('')
  const [patientCurrentCoords,setPatientCurrentCoords]=useState(null)
  const [ride,setRide]=useState(null)

  const [rides,setRides]=useState(null)



  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(()=>{
    const unsub=onSnapshot(collection(db,'rides'),(snapShot)=>{
      const rides=[]
      snapShot.forEach((doc)=>{
        if(doc.data().taken===false){
          rides.push(doc.data())
        }
        setRides(rides)

      })

    })

  },[])
  useEffect(()=>{
    let unsub
    if(userDetails!==null){
      console.log('called  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
      // const q=query(collection(db,'rides'),where("driverNumber",'==',userDetails.number))
      let q
      if(userDetails.type==='Patient'){
        // console.log('CAME ')
        q=query(collection(db,'rides'),where('number','==',userDetails.number))
      }else{
        // console.log('came')
        q=query(collection(db,'rides'),where('driverNumber','==',userDetails.number))
      }
      console.log('q is ',typeof q)
      unsub= onSnapshot(q,(snapshot)=>{
        // console.log(snapshot.exists())
        // console.log('type of ',typeof snapshot)
        snapshot.forEach((dd)=>
        {
          // console.log(dd.data())
          setRide(dd.data())
          
        })
  
      //  if(snapshot.exists()){
      //   //    if(doc[0].exists()){
      //   //     console.log(doc.data())
      //   //     setRide(doc.data())
      //   // }
      //   console.log('doc exists ')
      //  }
  
    })
    }
     return ()=>unsub?unsub():null
     
  },[userDetails])

  useEffect(()=>{
      getStorageMain()
  },[])

  const getStorageMain=async ()=>{
    try{
      const item = JSON.parse(
        await Storage.getItem({ key: 'user' })
      )
      console.log('item is ',item)
      setUserDetails(item)
  
    }catch(e){
      console.log('exception in getting item ',e)
      showToastWithGravity("storage get err")
  
    }
    // return null


  }
  
  useEffect(()=>{
    console.log('came in setting  storage useeffecty ')
    if(userDetails){
      console.log("##### setting the user )))))))))))))))))))))))))))))))))))) ")
      setStorageItem('user',userDetails)
    }
  },[userDetails])

 
  useEffect(()=>{
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.url &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      console.log('response last notification')
      setNotification(lastNotificationResponse.notification)
    }

  },[lastNotificationResponse])

 
  useEffect(()=>{
    console.log('getting location permission ')
    getLocationPermission()

  },[])
  useEffect(()=>{
    if(patientCurrentCoords===null){
      console.log('getting location in app useeffect')
      // (
      //   async ()=>{await getLocation()}
      //   )()
      // getLocation()
      // setPatientCurrentCoords((async ()=>{await getLocation()})())
      async function geoLocation() {
        console.log('called the function ')
      
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
          // return location
      
        }catch(e){
          console.log('error in getting location is ',e)
        }
        
        // let location = await Location.getCurrentPositionAsync({});
        // console.log('location is ',location)
      
      }

    }
    geoLocation()
},[])
useEffect(()=>{
  console.log('cords of patient is ',patientCurrentCoords);
},[patientCurrentCoords])


useEffect(()=>{
  // console.log('#############################################################')
  // console.log("ride is ",ride)

},[ride])




  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setToken(token));
    Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
          
    });
    const receivedSub = Notifications.addNotificationReceivedListener(notification => {
      console.log('notification is ',notification)
      setNotification(notification);
    });
  
    const  responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('notification clicked ');
      console.log('response is ',response)
      setNotification(response.notification)
    //   // navigation.navigate('login')
      
    });
    const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    console.log('Received a notification in the background!');
    // Do something with the notification data
    console.log('data in taskmanager is ',data)
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  
    return () => {
      receivedSub.remove()
      responseSub.remove()
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK)
      // Notifications.removeNotificationSubscription(notificationListener.current);
      // Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  useEffect(()=>{
    console.log("------------------->>######################################")
    var d = new Date();
    let h=d.getHours(); // => 9
    let m=d.getMinutes(); // =>  30
    let s=d.getSeconds();
    console.log("%%%%%%%% TIME %%%%%%%%%%%%%%%%%%%%%")
    console.log(h,":",m,":",s)
    console.log('notification ',notification?.request?.content)

    


    console.log("------------------->>######################################")




  },[notification])

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravity(
      `${data}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };


  const value={
    userDetails,
    setUserDetails,
    user,
    setUser,
    token,
    setToken,
    notification,
    number,
    setNumber,
    patientCurrentCoords,
    setPatientCurrentCoords,
    showToastWithGravity,
    ride,
    setRide,
    rides,
    setRides
  }

  return (
    // <SafeAreaView>
    <AppContext.Provider value={value}>
      <NavigationContainer>
             <StatusBar
        animated={true}
        backgroundColor="white"
        barStyle={'dark-content'}
      
      />

          
          <Stack.Navigator>
            {/* <Stack.Screen name='sampleUpdate' component={SampleUpdate}></Stack.Screen> */}
            {/* <Stack.Screen name="sample" component={SampleAppTwo}></Stack.Screen> */}
        { !userDetails &&  <Stack.Screen name="login" component={LoginScreen} options={{headerShown:false}} />}
        {!userDetails && <Stack.Screen name='userSelect' component={UserSelect} options={{headerShown:false,gestureEnabled:false,headerLeft:null}}></Stack.Screen>}
        
            <Stack.Screen name='mainScreen' component={MainScreen} options={{headerShown:false}}></Stack.Screen>
          {userDetails?.type==='Patient'?  <Stack.Screen name='emergencyPage' component={EmergencyPage} options={{headerShown:false}}></Stack.Screen>:<></>}
          {
            userDetails?.type==='Patient'?     <><Stack.Screen name='subInjury' component={SubInjury} options={{headerShown:false}}></Stack.Screen>

            <Stack.Screen name='camera' component={CameraPage} options={{headerShown:false}}></Stack.Screen>
            </>  :<></>
          }
        
           {
            ride ?<Stack.Screen name='map' component={MapPage} options={{headerShown:false}}></Stack.Screen>
                :<></>
           }
 
            
            
          </Stack.Navigator>
        
      </NavigationContainer>
      </AppContext.Provider>
  
  )
}

export default App