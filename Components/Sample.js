import { View, Text,TouchableOpacity ,SafeAreaView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
// import { TouchableOpacity } from 'react-native-web'
import { db } from '../firebase'
import { commonStyles } from './CommonStyles'
// import { SafeAreaView } from 'react-native-safe-area-context'

const Sample = () => {
    const [count,setCount]=useState(0)

    useEffect(()=>{
       const unsub= onSnapshot(doc(db,'rides','1212121'),(doc)=>{
            if(doc.exists()){
                console.log(doc.data())
                setCount(doc.data().count)
            }

        })
        return ()=>unsub()
    },[])
    const buttonHandler=async ()=>{
        try{
            const data={
                uid:"1212121",
                from:"9515235212",
                accepted:false,
                acceptedBy:'',
                count:1
            }
            await setDoc(doc(db,'rides','1212121'),data)

        }catch(e){
            console.log('exce[tion in add  is ',e)
        }


    }
    const updateHandler=async ()=>{
        try{

            await updateDoc(doc(db,'rides','1212121'),{count:count+1})




        }catch(e){
            console.log("exception in updatehandler ",e)


        }
    }
  return (
    <SafeAreaView>
    <View style={[commonStyles.container]}>
      <Text>Sample</Text>
      {count ?<Text>{count}</Text>:<Text>noo</Text>}
      <TouchableOpacity style={[commonStyles.button]} onPress={buttonHandler}>
        <Text>Click Me</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[commonStyles.button]} onPress={updateHandler}>
        <Text>Update</Text>
      </TouchableOpacity>

    </View>
    </SafeAreaView>
  )
}

export default Sample