import { View, Text, SafeAreaView,FlatList, StyleSheet ,TouchableOpacity} from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AppContext, windowHeight } from './CONSTANTS'
import { commonStyles } from './CommonStyles'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import LogoutComponent from './LogoutComponent'
// import { TouchableOpacity } from 'react-native-web'
// import { FlatList } from 'react-native-web'

const NotificationsArrive = () => {
  const {notification,rides,patientCurrentCoords,userDetails,showToastWithGravity,ride}=useContext(AppContext)
  const navigation=useNavigation()
  useEffect(()=>{
    console.log('notification is ',notification)
    console.log('rides are ',rides)
    console.log("coords are ",patientCurrentCoords)
  },[])

  useEffect(()=>{
    // console.log('ride is  in   notification  ',ride)
    if(ride){
      // console.log('againnnnnnnnnnnnnnnnn  ')
    
      navigation.navigate('map')
    }
  },[ride])

  const buttonHandler=async  (item)=>{
    console.log('in button handler' )
    try{
      await updateDoc(doc(db,'rides',item.number),{
        intialDriverLongitude:patientCurrentCoords.coords.longitude,
        intialDriverLatitude:patientCurrentCoords.coords.latitude,
        taken:true,
        completed:false,
        driverNumber:userDetails.number,
        positionLatitude:patientCurrentCoords.coords.latitude,
        positionLongitude:patientCurrentCoords.coords.longitude
      })
      showToastWithGravity("confirmed sucessfully")
      if(ride){
        navigation.navigate('map')

      }

    }catch(e){
      console.log('execption in confirming the raid ',e)
      showToastWithGravity('error in confirming ')
    }
    
  }
  return (
   <SafeAreaView>
    <LogoutComponent></LogoutComponent>
     {
       rides?.length===0?<View style={[{display:'flex',justifyContent:"center",alignItems:"center",backgroundColor:"white",height:windowHeight}]}>
      <Text style={[{width:"50%",textAlign:"center"}]}>wait for notifications to arrive</Text>
    </View>:<View style={[commonStyles.container]}>

        <Text style={[commonStyles.header]}>Rides</Text>
   
        <FlatList data={rides}
        // style={[{padding:10}]}
        keyExtractor={(item)=>item.number}
        renderItem={({item,index})=><View style={[styles.card]}>
                  <Text style={[styles.hone]}>Ride-{index} </Text>
                  <Text style={[{marginBottom:10}]}>{item.number}</Text>


                  <TouchableOpacity style={[commonStyles.button]} onPress={()=>buttonHandler(item)}>

                      <Text style={[commonStyles.buttonText]}>Confirm</Text>
                  </TouchableOpacity>

  
        </View>}
        >

        </FlatList>
    </View>
     }
    </SafeAreaView>
  )
}



export default NotificationsArrive

const styles=StyleSheet.create({
  card:{
    // marginTop:10,
    padding:10,
    marginHorizontal:5,
    marginVertical:10,
    backgroundColor:'white',
    // marginBottom:10,
    // elevation: 20,
    shadowColor: '#000000', // Set the shadow color to black
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius:10
  },
  hone:{
    fontSize:20,
    letterSpacing:1,
    fontWeight:'bold',
    marginBottom:10
  }

})