import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker,Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import axios from "axios";

const MapPage = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [coords,setCords]=useState(null)

    useEffect(() => {
      // console.log('in useeffect of lcoation permission ')
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log("permission not gratnted for location")
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          console.log('location is ',location)
          setLocation(location);
        })();
      });
      useEffect(()=>{
        // sk.eyJ1Ijoic2FpY2hlcnJ5IiwiYSI6ImNsZmJoYWJiYTBlcXozcG4xMHdsMXZyMXAifQ.6WWiJY1CPKIY2viyzjyxkA

        (async ()=>{
            const url='https://api.mapbox.com/directions/v5/mapbox/driving/77.2090057%2C28.6138954%3B80.270186%2C13.083694?alternatives=true&geometries=geojson&overview=full&steps=false&access_token=sk.eyJ1Ijoic2FpY2hlcnJ5IiwiYSI6ImNsZmJoYWJiYTBlcXozcG4xMHdsMXZyMXAifQ.6WWiJY1CPKIY2viyzjyxkA'
            // const url='https://api.mapbox.com/directions/v5/mapbox/cycling/-84.518641,39.134270;-84.512023,39.102779?geometries=geojson&access_token=sk.eyJ1Ijoic2FpY2hlcnJ5IiwiYSI6ImNsZmJoYWJiYTBlcXozcG4xMHdsMXZyMXAifQ.6WWiJY1CPKIY2viyzjyxkA'
            // const url='https://api.mapbox.com/directions/v5/mapbox/driving/77.2090057%2C28.6138954%3B80.270186%2C13.083694?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=sk.eyJ1Ijoic2FpY2hlcnJ5IiwiYSI6ImNsZmJoYWJiYTBlcXozcG4xMHdsMXZyMXAifQ.6WWiJY1CPKIY2viyzjyxkA'
            const data=await axios.get(url)
            // const jsonData=await data.json()
            let dat=data['data']['routes'][0]['geometry']['coordinates']
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
            console.log('dat is ',coordinates[0])
            console.log('region is ',chibaRegion)
            setCords(coordinates)
        })()
      },[])
   
      const tokyoRegion = {
        longitude: 28.704060,
        latitude: 77.102493,
       
      };
      const chibaRegion = {
        latitude: 35.6074,
        longitude: 140.1065,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      const [region, setRegion] = useState({
        latitude: 51.5079145,
        longitude: -0.0899163,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
  return (
    <View style={styles.container}>
       {location !==null ?<MapView style={styles.map} 
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,

          }}
          //onRegionChangeComplete runs when the user stops dragging MapView
          onRegionChangeComplete={(region) => setRegion(region)}
        >
             {coords && location ?<Marker coordinate={coords[0]} />:<></>}
            {coords?<Polyline
            strokeColor={"#000"}
            strokeWidth={1}
            // lineDashPattern={[1]}
            coordinates={coords}
            ></Polyline>:<></>}
           {location? <Marker coordinate={location} 
            pinColor={'green'}></Marker>:<></>}
            {/* <Marker coordinate={}></Marker> */}
            {coords ? <Marker coordinate={coords[coords.length-1]}></Marker>:<></>}
            </MapView>:<></>}
  </View>
  )
}

export default MapPage
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });