import { async } from '@firebase/util';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Storage } from 'expo-storage'


export const setStorageItem=async (key,value)=>{
  try{
    await Storage.setItem({
      key: key,
      value: JSON.stringify(value)
    })
  }catch(e){
    console.log('exception in adding item ',e)
    showToastWithGravity("storage set err")
  }
}

export const getStorage=async (key)=>{
  try{
    const item = JSON.parse(
      await Storage.getItem({ key: key })
    )
    console.log('item is ',item)
    return item

  }catch(e){
    console.log('exception in getting item ',e)
    showToastWithGravity("storage get err")

  }
  return null
}


export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function sendPushNotification(expoPushToken,id) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Ride Came',
    body: 'Take the ride and help the need',
    data: { rideId: `${id}` },
  };
  console.log('sending push notification')

 try{
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  console.log('sent sucessfully ')
 }
 catch(e){
  console.log('error is ----->>>>>   ',e)
 }
}



export const distanceCalculator=async (lat1,lon1,lat2,lon2)=>{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d.toFixed(1);

}
function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
