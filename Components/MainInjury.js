import { View, Text, SafeAreaView ,FlatList, TouchableOpacityBase, TouchableOpacity} from 'react-native'
import React, { useContext, useEffect } from 'react'
import { commonStyles } from './CommonStyles'
import CameraPage from './CameraPage'
import { Image } from 'react-native'
import TestOne from '../assets/TetsTwo.jpg'
import { StyleSheet } from 'react-native'
import { AppContext, windowHeight, windowWidth } from './CONSTANTS'
import { useNavigation } from '@react-navigation/native'
import LogoutComponent from './LogoutComponent'
// import { TouchableOpacity } from 'react-native-web'
// import { FlatList } from 'react-native-web'

const data=[
  {
    key:"1",
    image:TestOne,
    name:'sai'
  },
  {
    key:"2",
    image:TestOne,
    name:'sai'

  },
  {
    key:"3",
    image:TestOne,
    name:'sai'

  },
  {
    key:"4",
    image:TestOne,
    name:'sai'

  },
  {
    key:"5",
    image:TestOne,
    name:'sai'

  },
  {
    key:"6",
    image:TestOne,
    name:'sai'

  },

]

const MainInjury = () => {
  const navigation=useNavigation()
  const {ride}=useContext(AppContext)

  useEffect(()=>{
    if(ride && ride?.taken===true){
      console.log('main injuee called ')
        navigation.navigate('map')

    }
},[ride])
  
  return (
    // <View style={[commonStyles.container]}>
      <SafeAreaView style={[{backgroundColor:"white"}]} >
        <LogoutComponent></LogoutComponent>
        <View style={[{paddingHorizontal:windowWidth*0.05,backgroundColor:'white'}]}>
        <Text style={[styles.mainHeader]}>Select the Injury</Text>

      
        <FlatList
          numColumns={2}
          style={[{}]}
          contentContainerStyle={{ paddingBottom: 100 }}
          
          
          data={data}
          keyExtractor={(item)=>item.key}
          renderItem={({item,index})=>(<TouchableOpacity onPress={()=>{
            navigation.navigate('subInjury',{
              index:index
            })
          }}  style={[styles.card,{marginRight:windowWidth*0.0125},{marginLeft:windowWidth*0.0125}]}>
            <Image source={item.image} style={[styles.imageStyle]}></Image>
          </TouchableOpacity>)}
          
          ></FlatList>

        </View>

       {/* </View> */}


      </SafeAreaView>
    // </View> 
  )
}



export default MainInjury

const styles=StyleSheet.create({
  card:{
    width:windowWidth*0.425,
    height:windowHeight*0.25,
    marginTop:10,
    padding:10,
    backgroundColor:'white',
    marginBottom:10,
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

  imageStyle:{
    width:"100%",
    height:"100%",
 
    resizeMode:'contain'

    
    
  },
  mainHeader:{
    color:"black",
    fontSize:20,
    marginVertical:10
  }
})