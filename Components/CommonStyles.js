import { StyleSheet } from "react-native";
import { headerColor, mainColor, paraColor, windowHeight, windowWidth } from "./CONSTANTS";


export const commonStyles=StyleSheet.create({
    container:{
        paddingHorizontal:windowWidth*0.05,
        paddingVertical:10,
        // flex:1
        // height:windowHeight,
        minHeight:windowHeight,
        backgroundColor:'white',
        position:"relative"
        // alignItems:"center"
        // backgroundColor:'yellow'
        
    
      },header:{
        textAlign:"center",
        fontSize:30,
        color:headerColor,
        fontWeight:'bold'
    
      },
      subTag:{
    
        textAlign:"center",
        color:paraColor,
        // width:200,
        color:'gray',
    
        margin:'auto',
        marginTop:10,
        letterSpacing:1
      },
      button:{
        backgroundColor:mainColor,
        display:'flex',
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        // paddingHorizontal:16,
        padding:16,
        borderRadius:20
        
    
      },
      buttonText:{
        // backgroundColor:'red'
        color:"white",
        fontWeight:'bold',
        letterSpacing:1
    
    
      },
      loginTop:{
        width:windowWidth*0.8,
        // backgroundColor:"red",
        alignSelf:'center'
        
      },
      loginBottom:{
        // backgroundColor:"red",
        flex:1,
        justifyContent:'center',
        // flexGrow:1
      },
      textInput:{
        display:'flex',
        flexDirection:"row",
        // justifyContent:"center",
        alignItems:"center",
        gap:20,
        borderWidth:1,
        // borderEndColor:'gray'
        borderColor:"gray",
        borderRadius:20,
        padding:10,
        marginBottom:30
    
    
      },
    
})