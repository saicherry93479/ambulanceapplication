import { View, Text, FlatList,StyleSheet, StatusBar, TouchableOpacity, BackHandler } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { commonStyles } from './CommonStyles'
import { AppContext, windowHeight, windowWidth } from './CONSTANTS'
import { AntDesign } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const data=[
    {
    id:"1",name:"Patient"
    },
    {
        id:'2',name:'Driver'
    }    
]



const UserSelect = ({route}) => {
    const {userId} = route.params
    const {setUserDetails,token,number,showToastWithGravity}=useContext(AppContext)
    const navigation=useNavigation()

    // useLayoutEffect(()=>{
    //     navigation.setOptions({
    //         gestureEnabled: false, // disables the swipe gesture
    //       });
    // },[navigation])
    // useEffect(()=>{
    //     navigation.addListener('beforeRemove', (e)=>{})
    // },[navigation])
      useEffect(()=>{
    // //   console.log('userdetails are in main Screen ',userDetails)
    //   BackHandler.addEventListener('hardwareBackPress',()=>{
    //     console.log('clieked back ')
    //     BackHandler.exitApp()})
  },[])

  


    const addUser=async (name)=>{
        console.log(name)
        console.log('id is ',userId)
        try{
            console.log('token is ',token)
            console.log('type is ',typeof token)
            const dat={
                type:name,
                token:token,
                number:number
            }
            await setDoc(doc(db,'users',userId),dat)
            const ref=doc(db,"users",userId)
            const document = await getDoc(ref)
            setUserDetails(document.data())
            navigation.navigate('mainScreen')
            showToastWithGravity(`Registered as ${name}`)
            
            

          

            
        }catch(e){
            console.log("exception in adding new user ",e)
        }

    }
  return (
    <SafeAreaView>
    
        <View style={[commonStyles.container]}>
            <Text style={[styles.logo]}>Ambulance</Text>
            <FlatList 
            horizontal
            data={data}
            keyExtractor={(item)=>item.id}

            renderItem={({item})=>(
            <View >
                <TouchableOpacity style={[styles.listItem]} onPress={()=>addUser(item.name)}>
                    <Text style={[styles.listTag]}>{item.name}</Text>
                    <TouchableOpacity style={[styles.rightArrow]}>
                        <AntDesign name="arrowright" size={24} color="white" />
                    </TouchableOpacity>
                </TouchableOpacity>

            </View>
            
            )}


            >
                
            </FlatList>
        </View>
    </SafeAreaView>
  )
}

export default UserSelect


const styles=StyleSheet.create({
    logo:{
        fontSize:windowHeight*0.05,
        fontWeight:'bold',
        marginBottom:20
    },
    listItem:{
        backgroundColor:"#E6E7E9",
        padding:20,
        marginRight:10,
        // height:windowHeight*0.3,
        borderRadius:3,
        width:windowWidth*0.4,
        justifyContent:'space-between',
        display:"flex",
        gap:20
    },
    listTag:{
        fontSize:windowHeight*0.022,
        fontWeight:500
    },
    rightArrow:{
        backgroundColor:"black",
        width:40,
        height:40,
        display:'flex',
        justifyContent:"center",
        alignItems:"center",
        borderRadius:40
        
    }

})