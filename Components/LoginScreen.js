import { View, Text, TouchableOpacity, KeyboardAvoidingView, Keyboard,Animated } from 'react-native'
import React,{useState,useRef, useContext, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput,StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import {  AppContext, windowHeight, windowWidth } from './CONSTANTS';
import { commonStyles } from './CommonStyles';
import { useNavigation } from '@react-navigation/native';
import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha'
import { auth, db, firebaseConfig } from '../firebase';
import { onAuthStateChanged, signInWithPhoneNumber } from 'firebase/auth';
import OtpScreen from './OtpScreen';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { AppContext } from '../App';
import * as Location from 'expo-location';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../utils/Utils';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const LoginScreen = () => {
  
  const navigation=useNavigation()
  const [otpSent,setOtpSent]=useState(false)
  const recaptchRef=useRef(null)
  const [result,setResult]=useState(null)
  const [otp,setOtp]=useState('')

  // const responseListener=useRef()

  // const [notification,setNotification]=useState(null)
  const {notification,setNotification,setToken}=useContext(AppContext)


  // const navigation=useNavigation()



  const {setUserDetails,token,userDetails,user,number,setNumber, setUser,showToastWithGravity}=useContext(AppContext)



  const onChangeNumber=(value)=>{
    setNumber(value)

  }
  useEffect(()=>{
    setOtp('')
    setOtpSent(false)
    setResult(null)

  },[navigation])

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setToken(token));

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //       navigation.navigate('login')
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        // console.log('user is logged in  in app js ',user)
      }else{
        // console.log('user is logged out in app js')
      }
    })
  })

  const otpHandler=()=>{
    console.log('otp button clicked')
    if(number.length!==10){
      showToastWithGravity('Enter a valid phone number')
      return 
    }
    // navigation.navigate('otp')
    signInWithPhoneNumber(auth,`+91${number}`,recaptchRef.current).then((result)=>{
      console.log('result is ',result)
      setResult(result)
      setOtpSent(true)
      showToastWithGravity('Otp Sent Sucessfully')

 

    }).catch(e=>{
      console.log("unable to send  e is ",e)
      showToastWithGravity('Unable to Send Otp')
    })
    

  }
  const onOtpConfirm=async ()=>{
    result.confirm(otp).then(async (result) => {
      // User signed in successfully.
      showToastWithGravity('OTP verified Successfully')
      const user = result.user;
      console.log('login sucessfull ',user)
      const isUserPresent= await checkUserPresent(user.uid)
      if(isUserPresent.bool){
        console.log('data is ',isUserPresent.userData)
        // console.log('userdetails is ',userDetails)
        if(isUserPresent.userData.token!==token){
          const dat={...isUserPresent.userData,token:token}
          console.log('data is concluding is ',dat)
         try{
          await setDoc(doc(db,'users',user.uid),dat)
          console.log('sent the data sucessfully updated token ')
         }catch(e){
          console.log('error in updating the token ',e)
         }
        }
        if(!isUserPresent.userData.type){
          navigation.navigate('userSelect')
        }
        navigation.navigate('mainScreen')
       
        return

      }
      navigation.navigate('userSelect',{userId:user.uid})
      return 



      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      console.log('no failed ',error)
      showToastWithGravity('Unable to verify OTP.Try Again')
      // ...
    });
    
  }

  const checkUserPresent=async (userId)=>{  
    const ref=doc(db,"users",userId)
    const document = await getDoc(ref)
    if(document.exists()){
      console.log("already in databse present")
      setUserDetails(document.data())
      
      return {bool:true,userData:document.data()}
    }
    console.log("in databse not  present")
    return {bool:false}



  }
  
 
  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      {/* <KeyboardAvoidingView behavior="padding"> */}
       {
        otpSent?<OtpScreen setOtpSent={setOtpSent}  setOtp={setOtp} setResult={setResult} otp={otp} onOtpConfirm={onOtpConfirm} phNumber={number}></OtpScreen>: <View style={[commonStyles.container]}>
        <View style={commonStyles.loginTop}>
          <Text style={[commonStyles.header]}>Login Account </Text>
          <Text style={[commonStyles.subTag]}>Please provide with 
          a valid phone number</Text>
        </View>

         <View style={[commonStyles.loginBottom]}>
            <View style={[commonStyles.textInput]}>
                <Text>+91</Text>
                <TextInput
                style={[{width:"100%"}]}
                // style={commonStyles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Please enterphone number"
                keyboardType="numeric"
              />

            </View>
            <TouchableOpacity style={[commonStyles.button]} onPress={otpHandler}>
              <Text style={[commonStyles.buttonText]}>Send Otp</Text>
            </TouchableOpacity>
        </View>
       
      <FirebaseRecaptchaVerifierModal ref={recaptchRef} firebaseConfig={firebaseConfig}></FirebaseRecaptchaVerifierModal>
        
        
    </View>
       }
        
       
        {/* </KeyboardAvoidingView> */}
        </TouchableWithoutFeedback>
    </SafeAreaView>
    
  )
}


export default LoginScreen

