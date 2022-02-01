import React from 'react'
import {View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput, AsyncStorage, ScrollView} from 'react-native'
import {default as AntDesign} from 'react-native-vector-icons/AntDesign';
import {default as Fontisto} from 'react-native-vector-icons/dist/Fontisto';
import {default as FontAwesome} from 'react-native-vector-icons/dist/FontAwesome5';
import {default as Entypo} from 'react-native-vector-icons/dist/Entypo';
import {default as SimpleLineIcons} from 'react-native-vector-icons/dist/SimpleLineIcons';
import {Button} from 'react-native-elements';

import {GetNews, AddUserToFamily, encodeFormData, TrackNearestUsers, UpdateCovidStatus} from '../AllApi';
import { withNavigation } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';

class Drawer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            UserId:0,
            FamilyId:0,
        }
    }
 async getFromAsync(){
  var UserID = await AsyncStorage.getItem('UserID',null);
  this.setState({UserID});
}
async componentDidMount(){
   this.getFromAsync();
}
AddToFamily(){
    var UserID = this.state.UserID;
    if(UserID == null){
        this.props.navigation.navigate('Profile');
    }
    else
    {
        var FamilyUserID = this.state.FamilyId;
    
        var body = {
            UserID:UserID,
            FamilyUserID:FamilyUserID
        }
        // console.log(body);
        var params = encodeFormData(body);
        if(UserID != 0 & FamilyUserID !=0)
        {
        fetch(AddUserToFamily,{
            method:'POST',
            headers:{
            'Content-Type':'application/x-www-form-urlencoded'    
            },
            body:params
        })
        .then((res)=>res.json())
        .then((json)=>{
        var Result = json.Result;
        if(Result.Code =="00"){
            alert('successfully added to family...')
        }
        else{
            alert('An error occured')
        }
        })
        .catch((err)=>{
        // console.log(err)
        });
        }
    }
  
}
      

updateStatus(value){
    var UserID = this.state.UserID;
    if(UserID == 0 || UserID == null){
        this.props.navigation.navigate('Profile');
    }
    else{
        if(typeof(value.Corona) !="undefined"){
     
            var CategoryID = 5;
            var Status = value.Corona;
        
            var params = {
              UserID:UserID,
              CategoryID:CategoryID,
              Status:Status
            }
            var body = encodeFormData(params);
            fetch(UpdateCovidStatus,{
              method:'POST',
              headers:{
                Accept:'application/json',
                'Content-Type':'application/x-www-form-urlencoded'
              },
              body:body
            })
            .then((res)=>res.json())
            .then((json)=>{
              if(json.Result.Code == "00"){
        
                alert('Successfully updated');
              }
            })
            .catch((err)=>{
              console.log(err)
            });
          }
          if(typeof(value.Vaccine) !="undefined"){
            var CategoryID = 6;
            var Status = value.Vaccine;
        
            var params = {
              UserID:UserID,
              CategoryID:CategoryID,
              Status:Status
            }
            var body = encodeFormData(params);
            fetch(UpdateCovidStatus,{
              method:'POST',
              headers:{
                Accept:'application/json',
                'Content-Type':'application/x-www-form-urlencoded'
              },
              body:body
            })
            .then((res)=>res.json())
            .then((json)=>{
              if(json.Result.Code == "00"){
                alert('Successfully updated');
              }
            })
            .catch((err)=>{
              console.log(err)
            });
        
          }
    }
  
  }


  async logout(){
    await AsyncStorage.removeItem('UserID');
    await AsyncStorage.removeItem('CountryCode');
    console.log(111)
    this.props.navigation.navigate('Login')
  }
    render(){
      this.getFromAsync();
        return(
        <>
        <SafeAreaView style={{paddingTop:20}}>
          <ScrollView style={{height:'100%', width:'100%'}}>
          <View style={{height:100, width:'100%', padding:10}}>
          <TouchableOpacity
            onPress={()=>this.props.navigation.closeDrawer(null)}
            style={{padding:10, height:50}}>
            <Entypo name={"chevron-left"} size={40} color={"#39867E"}/>
            </TouchableOpacity>
          </View>

            <View style={{height:80, width:'100%', padding:10}}>
           <TouchableOpacity 
         onPress={()=>this.props.navigation.navigate('Profile')}
         style={{flex:2.5, flexDirection:'row', }}>
        <View style={{flex:0.5}}>

        <View style={{backgroundColor:'#39867E', width:50, height:50, borderRadius:10,justifyContent:'center', alignItems:'center'}}>
        <AntDesign name={'user'} size={32} color={"#fff"}/>
        </View>

        </View>
        <View style={{flex:2, justifyContent:'center', height:50, alignItems:'flex-start'}}>
        <Text style={{ fontWeight:'bold', color:'#266b63', textAlign:'left', fontSize:20}}>
         Profile
        </Text>
        </View>
         </TouchableOpacity>
         </View>



            <View style={{height:80, width:'100%', padding:10}}>
         <View style={{flex:2.5, flexDirection:'row', height:80,}}>
        <View style={{flex:0.5}}>

        <View style={{backgroundColor:'#39867E', width:50, height:50, borderRadius:10,justifyContent:'center', alignItems:'center'}}>
        <FontAwesome name={'users'} size={32} color={"#fff"}/>
        </View>

        </View>
        <View style={{flex:1, justifyContent:'center', height:50}}>
        <Text style={{fontWeight:'bold', color:'#266b63', textAlign:'left', fontSize:20}}>
         Add To Family
        </Text>
        </View>
        <View style={{flex:1, justifyContent:'center', height:50}}>
        <TextInput 
        keyboardType={"phone-pad"} 
        returnKeyType='done' 
        onChangeText={(FamilyId)=>this.setState({FamilyId})}
        style={{color:'#000', fontSize:16}} placeholder={"Enter family Id"}
        onSubmitEditing={()=>this.AddToFamily()}
        />
        </View>
         </View>
            </View>

         
            <View style={{height:80, width:'100%', padding:10}}>
           <TouchableOpacity 
         onPress={()=>this.props.navigation.navigate('Profile')}
         style={{flex:3, flexDirection:'row', }}>
        <View style={{flex:0.5}}>

        <View style={{backgroundColor:'#39867E', width:50, height:50, borderRadius:10,justifyContent:'center', alignItems:'center'}}>
        <AntDesign name={'user'} size={32} color={"#fff"}/>
        </View>

        </View>
        <View style={{flex:1.5, justifyContent:'center', height:50, alignItems:'flex-start'}}>
        <Text style={{ fontWeight:'bold', color:'#266b63', textAlign:'left', fontSize:20}}>
         Family ID
        </Text>
        </View>
        <View style={{flex:1, justifyContent:'center', height:50,}}>
          <Text style={{ fontSize:18, fontWeight:'bold', color:'#266b63', letterSpacing:2 }}>
          {this.state.UserID}
          </Text>
        </View>
         </TouchableOpacity>
         </View>
        

         <View style={{height:80, width:'100%', padding:10}}>
         <TouchableOpacity 
         onPress={()=>this.logout()}
         style={{flex:2.5, flexDirection:'row',  height:80}}>
        <View style={{flex:0.5}}>

        <View style={{backgroundColor:'#39867E', width:50, height:50, borderRadius:10,justifyContent:'center', alignItems:'center'}}>
        <SimpleLineIcons name={'logout'} size={32} color={"#fff"}/>
        </View>

        </View>
        <View style={{flex:2, justifyContent:'center', height:50, alignItems:'flex-start'}}>
        <Text style={{fontWeight:'bold', color:'#266b63', textAlign:'left', fontSize:20}}>
         Logout
        </Text>
        </View>
         </TouchableOpacity>
         </View>

          </ScrollView>
          </SafeAreaView>
          </>
        )
    }
}
export default withNavigation(Drawer);


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
  
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputIOSContainer:{
    //   borderWidth:3,
    //   borderColor:'grey',
    //   backgroundColor:'red'
    },
    viewContainer:{
      backgroundColor:'red'
    }
  });
  