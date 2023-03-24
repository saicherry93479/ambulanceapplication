import { View, Text,TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from './CommonStyles';
import { mainColor, paraColor } from './CONSTANTS';



const OtpScreen = ({otp,setOtp,onOtpConfirm,setResult,setOtpSent,phNumber}) => {
 
 
  const onChangeOtp=(value)=>{
    setOtp(value)
  }
 
  return (
  
    <View style={[commonStyles.container]} >

            <Ionicons name="chevron-back"  size={35} color={mainColor} 
            onPress={()=>{
          setResult(null)
          setOtpSent(false)}}  />
       
        
      <View style={[commonStyles.loginTop]}>

            <Text style={[commonStyles.header]}>OTP Verification</Text>
            <Text style={[commonStyles.subTag]}>We sent your code to +91 ${phNumber} </Text>
      </View>
      <View style={[commonStyles.loginBottom]}>
        <View style={[commonStyles.textInput]}>
          <TextInput   
              style={[{width:"100%"}]}
              onChangeText={onChangeOtp}
              value={otp}
              placeholder="Please enter otp"
              keyboardType="numeric"></TextInput>

        </View>
        <TouchableOpacity style={[commonStyles.button]} onPress={onOtpConfirm}>
            <Text style={[commonStyles.buttonText]} >Confirm Otp</Text>

        </TouchableOpacity>

      </View>
    </View>

  )
}

export default OtpScreen