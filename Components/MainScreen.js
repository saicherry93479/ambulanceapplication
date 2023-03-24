import { View, Text,BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'

// import DriverPage from './DriverPage'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainInjury from './MainInjury'
import { AppContext } from './CONSTANTS'
import { registerForPushNotificationsAsync } from '../utils/Utils'
import NotificationsArrive from './NotificationsArrive'
import { useNavigation } from '@react-navigation/native'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase'

const MainScreen = () => {
    const {userDetails,setRide}=useContext(AppContext)

    const navigation=useNavigation()

    useEffect(()=>{
      console.log('userDetails are ',userDetails)
      navigation.addListener('beforeRemove', (e)=>{})
  },[])

// },[navigation])
  // useEffect(()=>{
  //     console.log('userdetails are in main Screen ',userDetails)
  //     BackHandler.addEventListener('hardwareBackPress',()=>{
  //       console.log('clieked back ')
  //       BackHandler.exitApp()})
  // },[])
  
// useEffect(()=>{
//   let unsub
//   if(userDetails!==null){
//     console.log('called  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
//     // const q=query(collection(db,'rides'),where("driverNumber",'==',userDetails.number))
//     let q
//     if(userDetails.type==='Patient'){
//       // console.log('CAME ')
//       q=query(collection(db,'rides'),where('number','==',userDetails.number))
//     }else{
//       // console.log('came')
//       q=query(collection(db,'rides'),where('driverNumber','==',userDetails.number))
//     }
//     console.log('q is ',typeof q)
//     unsub= onSnapshot(q,(snapshot)=>{
//       // console.log(snapshot.exists())
//       // console.log('type of ',typeof snapshot)
//       snapshot.forEach((dd)=>
//       {
//         // console.log(dd.data())
//         setRide(dd.data())
        
//       })

//     //  if(snapshot.exists()){
//     //   //    if(doc[0].exists()){
//     //   //     console.log(doc.data())
//     //   //     setRide(doc.data())
//     //   // }
//     //   console.log('doc exists ')
//     //  }

//   })
//   }
//    return ()=>unsub?unsub():null
   
// },[userDetails])




  const backAction=()=>{
    BackHandler.exitApp()
  }


  return (
    <SafeAreaView>
            {
         userDetails?.type==='Driver'?<NotificationsArrive></NotificationsArrive> :<></>
    }
    {
        userDetails?.type==="Patient"?<MainInjury></MainInjury>:<></>
    }
    </SafeAreaView>
    
 
   
  )
}

export default MainScreen