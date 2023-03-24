import { View, Text, TouchableOpacity, FlatList,StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { commonStyles } from './CommonStyles'
// import { FlatList } from 'react-native-web'
import { subInjuryData, windowHeight, windowWidth } from './CONSTANTS'
import LogoutComponent from './LogoutComponent'

const SubInjury = ({navigation,route}) => {

    const {index}=route.params
    const clickHandler=()=>{
        navigation.navigate('camera')

    }
  return (
    <SafeAreaView>
      <LogoutComponent></LogoutComponent>
        <View style={[commonStyles.container]}>
        <Text style={[styles.mainHeader]}>Select the Sub Injury</Text>
            <FlatList
            data={subInjuryData[index]}
            contentContainerStyle={{ paddingBottom: 100 }}
            numColumns={2}
            keyExtractor={(item)=>item.key}
            renderItem={({item})=><TouchableOpacity onPress={clickHandler}  style={[styles.card,{marginRight:windowWidth*0.0125},{marginLeft:windowWidth*0.0125}]}><Text>{item.name}</Text></TouchableOpacity>}
            >

            </FlatList>

        </View>
    </SafeAreaView>
  )
}

export default SubInjury


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