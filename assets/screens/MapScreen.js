/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Picker,
  AsyncStorage,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
var PushNotification = require("react-native-push-notification");
const countries = require('../countries.json');

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Button} from 'react-native-elements';
import {default as Fontisto} from 'react-native-vector-icons/dist/Fontisto';
import {default as MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';
import {default as MaterialIcons} from 'react-native-vector-icons/MaterialIcons';
import {default as Octicons} from 'react-native-vector-icons/Octicons';
import {default as AntDesign} from 'react-native-vector-icons/AntDesign';
import {default as Ionicons} from 'react-native-vector-icons/Ionicons';
import CovidVideos from './CovidVideos';


import Modal from 'react-native-modal';
import { FloatingAction } from 'react-native-floating-action';
import RNPickerSelect from 'react-native-picker-select';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import {default as FontAwesome} from 'react-native-vector-icons/dist/FontAwesome5';
import Geolocation from '@react-native-community/geolocation';
import {GetNews, AddUserToFamily, encodeFormData, TrackNearestUsers, UpdateCovidStatus, UserCountryVise} from '../AllApi';
import BGAndroid from './BGAndroid';
import BGIos from './BGIos';
import { thistle } from 'color-name';

const actions = [
//   {
//   text: 'W H O',
//   icon: require('../images/who.png'),
//   name: 'bt_who',
//   position: 1
// },
//  {
//   text: 'User States',
//   icon: require('../images/hotel.png'),
//   name: 'bt_local',
//   position: 3
// },
{
  text: 'Country Stats',
  icon: require('../images/report.png'),
  name: 'bt_stats',
  position: 4
}
];


export default class MapScreen extends React.Component{
    constructor(props){
        super(props);
     
        this.state={btnInActive:true,
                    visibleState:1,
                    questionId:0,
                    anwsers:[],
                    age:0,
                    questionFinished:0,
                    isLoading:true,
                    isModalVisible: false,
                    textInputValue: '',
                    UserId:0,
                    FamilyId:0,
                    countries:null,
                    LastMsgDate:null,
                    CurrentLocation:'',
                    LocalData:null,
                    CountryCode:null,
                    MapState:'WHO',
                    Loading:true,
                    NDList:null,
                    NeedReload:0,
                    mapsMarker:<View/>
                  }
      }
 
getNews(){

  if(Platform.OS == "ios"){
    BackgroundTimer.start();
  }
  const newsinterval = BackgroundTimer.setInterval(() => {
    var countryCode = this.state.CountryCode;
    console.log(countryCode);
    if(countryCode != null){
      if(countryCode == 'PK'){
        var countryId = 2;
      }
      if(countryCode == 'CA'){
        var countryId = 1;
      }
    fetch(`${GetNews}?CountryID=${countryId}`)
    .then((res)=>res.json())
    .then((json)=>{
    var result = json.Result.NDList;
    this.setState({NDList: result});
    })
    .catch((err)=>{
      // console.log(err)
    
    });
    BackgroundTimer.clearInterval(newsinterval);
    }
  }, 1000);
 
}
renderNotifications(){
 return this.state.NDList.map((val)=>{
   return(
    <TouchableOpacity
    onPress={()=>this.props.navigation.navigate('NDetails', {Url: val.URL})}
    style={{flex:3, flexDirection:'row', marginTop:10, backgroundColor:'#fff', padding:20, borderWidth:5, borderColor:'lightgray',}}>
    <View style={{flex:1, alignItems:'center'}}>
    <Image source={require('../images/openMail.png')} style={{ borderColor:'#B2B2B2', borderWidth:3, borderRadius:50 }}/>
    </View>
    <View style={{flex:2}}>
    <Text 
    numberOfLines={1}
    style={{fontSize: 18, fontWeight:'bold', textAlign:'left'}}>
          {val.Heading}
        </Text>
        <Text 
        numberOfLines={2}
        style={{fontSize:12, color:'#828282', paddingTop:2}}>
         {val.Details}
        </Text>
        
    </View>
    </TouchableOpacity>
   )
  });
}
// getCountries(){
//   fetch('https://fhrdevelopers.000webhostapp.com/api.php', {
//       method:'GET'
//     })
//   .then((res)=> res.json())
//   .then((json)=>{
  
//     this.setState({countries:json})
//   })
//   .catch((err)=>{
//   // console.log(err);
//   });
// }
async getNearestUserIos(){
  var UserID = await AsyncStorage.getItem('UserID',0);

  BackgroundTimer.start();
  BackgroundTimer.setInterval(()=>{
    BGIos((coords)=>{
      var val = coords.coords;

      var Latitude = val.latitude;
      var Longitude = val.longitude;
      if(Latitude !=null || Longitude !=null || UserID != null || UserID !=0){
        var CurrentLocation = Latitude+','+Longitude;
        var CurrentLatitude = Latitude;
        var CurrentLongitude = Longitude;
  
        var params = {
          UserID:UserID,
          CurrentLocation: CurrentLocation,
          CurrentLatitude: CurrentLatitude,
          CurrentLongitude: CurrentLongitude
        }

        console.log(params)
        console.log(params)

        
        var Body = encodeFormData(params);
  
        fetch(TrackNearestUsers,{
          method:'POST',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/x-www-form-urlencoded',
          },
          body:Body
        })
        .then((res)=>res.json())
        .then(async(json)=>{
          console.log(json.Result.Code)
          if(json.Result.Code == "00"){

            PushNotification.localNotification({
              /* Android Only Properties */
              id: "0", // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
              ticker: "My Notification Ticker", // (optional)
              autoCancel: true, // (optional) default: true
              largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
              smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
              bigText: json.Result.Message, // (optional) default: "message" prop
              subText: "This is a subText", // (optional) default: none
              color: "red", // (optional) default: system default
              vibrate: true, // (optional) default: true
              vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
              tag: "some_tag", // (optional) add tag to message
              group: "group", // (optional) add group to message
              ongoing: false, // (optional) set whether this is an "ongoing" notification
              priority: "high", // (optional) set notification priority, default: high
              visibility: "private", // (optional) set notification visibility, default: private
              importance: "high", // (optional) set notification importance, default: high
              allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
              ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
             
              /* iOS only properties */
              alertAction: "view", // (optional) default: view
              category: "", // (optional) default: empty string
              userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
             
              /* iOS and Android properties */
              title: "Covid 19 Alert", // (optional)
              message: json.Result.Message, // (required)
              playSound: true, // (optional) default: true
              soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
              number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
              // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
              // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
            });
          }
          else
          {
  
          }
        })
        .catch((err)=>{
  
        });
      }

    })
  }, 1000)
}
async getNearestUsersAndroid(){
  BGAndroid(async (val)=>{
    console.log(val)

    var UserID = await AsyncStorage.getItem('UserID',0);
if(UserID == null){
  console.log(UserID)
}
    var Latitude = val.latitude;
    var Longitude = val.longitude;
    if(Latitude !=null || Longitude !=null){
      var CurrentLocation = Latitude+','+Longitude;
      var CurrentLatitude = Latitude;
      var CurrentLongitude = Longitude;

      var params = {
        UserID:UserID,
        CurrentLocation: CurrentLocation,
        CurrentLatitude: CurrentLatitude,
        CurrentLongitude: CurrentLongitude
      }
      console.log(params)
      var Body = encodeFormData(params);  

      fetch(TrackNearestUsers,{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/x-www-form-urlencoded',
        },
        body:Body
      })
      .then((res)=>res.json())
      .then(async(json)=>{
        console.log(json.Result)
        if(json.Result.Code == "00"){
          PushNotification.localNotification({
            /* Android Only Properties */
            id: "0", // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            ticker: "My Notification Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            bigText: json.Result.Message, // (optional) default: "message" prop
            subText: "This is a subText", // (optional) default: none
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: "some_tag", // (optional) add tag to message
            group: "group", // (optional) add group to message
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            importance: "high", // (optional) set notification importance, default: high
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
           
            /* iOS only properties */
            alertAction: "view", // (optional) default: view
            category: "", // (optional) default: empty string
            userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
           
            /* iOS and Android properties */
            title: "Covid 19 Alert", // (optional)
            message: json.Result.Message, // (required)
            playSound: true, // (optional) default: true
            soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
            // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
          });
        }
        else
        {

        }
      })
      .catch((err)=>{

      });
    }
  });
}

getGPSLocation(value){
  Geolocation.getCurrentPosition((val)=>{
    var latLng = val.coords.latitude+','+val.coords.longitude;
    this.setState({CurrentLocation: latLng, Latitude: val.coords.latitude, Longitude: val.coords.longitude})
    // console.log(latLng)
    if(value == 1){
      this.reverseGeoCode(latLng);
    }
   
  }, (err)=>{
    // console.log(err)
  },
  {
    enableHighAccuracy: false,
    timeout: 20000, 
    maximumAge: 1000
  });
}

intervals(){
  if(Platform.OS == "ios"){
    BackgroundTimer.start();
  }
  const checkLatLng = BackgroundTimer.setInterval(()=>{
      if(this.state.CountryCode == null){
          this.getGPSLocation(1);
      }
      else{
          this.getGPSLocation(0);
      }
  },2000)
}


updateStatus(value){
  var UserID = this.state.UserID;
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
getLocalData(){
  const localDataInterval = setInterval(() => {
    var countryCode = this.state.CountryCode;
  
  if(countryCode == 'PK'){
    var countryId = 2;
  }
  if(countryCode == 'CA'){
    var countryId = 1;
  }
  if(countryId !=null){
    fetch(`${UserCountryVise}?CountryID=${countryId}`,{
      method:'GET'
    })
    .then((res)=>res.json())
    .then((json)=>{
      // console.log(json)
      if(json.Result.Code == "00"){
        this.setState({LocalData: json.Result.UList})
        clearInterval(localDataInterval);
      }
    })
    .catch((err)=>{
  
    });
  }
 
  }, 1000);
  
}


 async componentDidMount(){
    this.getDataApi();
    this.getNews();
    // this.getCountries();
    this.intervals();
    // this.getLocalData()
   
    var UserID = await AsyncStorage.getItem('UserID',0);


    if(Platform.OS == "android")
    {
      this.getNearestUsersAndroid();

    }
    if(Platform.OS == "ios"){
      this.getNearestUserIos();
    }
    
    var CountryCode = await AsyncStorage.getItem('CountryCode', null);
    this.setState({isLoading:false, Data:null, UserID, CountryCode});
  }
  
  getDataApi(){
    fetch('https://api.covid19api.com/summary', {
      method:'GET'
    })
    .then((res)=> res.json())
    .then((resposeJson)=>{
      // console.log(resposeJson)
      if(typeof(resposeJson.Countries) != "undefined"){
        this.setState({NeedReload :0})
        var Data = resposeJson.Countries;
        // console.log(Data)
        this.setState({Data});
      }
      else{
        this.setState({NeedReload :1})
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }

reverseGeoCode(latLng)
{
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=AIzaSyAKnZLRNSsR0lKyuHEvtt7pzWZE3mFdJe0`,{
        method:'GET',
        headers:{
            Accept:'application/json'
        }
    })
    .then((res)=>res.json())
    .then((json)=>{
        var array = json.results[0].address_components;

        array.map((val)=>{
        var type = val["types"];
        if(type.includes("country"))
        {
            var cc = val.short_name;
            this.setState({CountryCode: cc});

            var data = countries[cc];
            console.log(data[0].Latitude);
            console.log(data[0].Longitude);
      
            AsyncStorage.setItem('CountryCode', cc);
            let coords = {
                latitude: 	 	JSON.parse(data[0].Latitude),
                longitude: 		JSON.parse(data[0].Longitude),
                latitudeDelta: 4.9956,
                longitudeDelta: 30.9924,
            }
            this.setState({CountryLatitude: data[0].Latitude,
                            CountryLongitude: data[0].Longitude});
            this._map.animateToRegion(coords, 1000);
          
            
        }
        });
    })
    .catch((err)=>{
        // console.log(err);
    })
}
renderQuestions(){
  if(this.state.questionFinished == 1)
  {
    return(
      <View style={{justifyContent:'center', height:'100%', }}>
        <Text style={{textAlign:'center', fontSize:26, fontWeight:'bold'}}>
          Thank you for cooperation.
        </Text>
      </View>
    )
  }
  else{
  return(

    <View style={{padding:10}}>
   <View>
   <Text style={{fontSize:16, }}>
     {questions[this.state.questionId].question}
   </Text>
   </View>
   <View style={{paddingTop:10}}>
     {(questions[this.state.questionId].type == 'select')?
     <>
        {(questions[this.state.questionId].options.map((val)=>{
          return(
            <View style={{paddingTop:20}}>
            <Button title={val.value}
                    titleStyle={{color:'#fff'}}
                    buttonStyle={{backgroundColor:'#39867E'}}
                    onPress={()=>this.anwser(val.id)} />
           </View>
          )
        }))}
      </>
      :
      null}
       {(questions[this.state.questionId].type == 'TextInput')?
       <>
      <TextInput keyboardType={questions[this.state.questionId].keyboardType} style={{borderColor:"#39867e", borderWidth:3, height:30,marginTop:20}} onChangeText={(val)=>this.setState({age:val})} />
       <Button title={'Submit'}
                    titleStyle={{color:'#fff'}}
                    buttonStyle={{backgroundColor:'#39867E'}}
                    containerStyle={{marginTop:20}}
                    onPress={()=>this.anwser(this.state.age)} />

      </>
       :
       null
      }
   </View>

   </View>
  );
}
}
anwser(id){
  var lenght = questions.length;

  var array = [];

  var questionId = this.state.questionId;
  var newQuestionId = questionId+1;
  if(newQuestionId != lenght)
  {
    var anwser = {
      questionId: questionId,
      answerId: id
    }

    array.push(anwser);
    this.setState({
        questionId: newQuestionId,
        anwsers:anwser
    });
    // console.log({
    //   questionId: newQuestionId,
    //   anwsers:anwser
    // });
  }
  else
  {
    this.setState({questionFinished:1})
  }

}
AddToFamily(){
  var UserId = this.state.UserID;
  var FamilyUserID = this.state.FamilyId;

  var body = {
    UserID:UserId,
    FamilyUserID:FamilyUserID
  }
  // console.log(body);
  var params = encodeFormData(body);
if(UserId != 0 & FamilyUserID !=0)
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

renderMarkers()
{
if(this.state.MapState == 'WHO')
{
  if(Platform.OS == "ios"){
    BackgroundTimer.start();
  }
const inter = BackgroundTimer.setInterval(()=>{
  if(this.state.Data != null & countries !=null){
    
 
  
    const markers =  this.state.Data.map((val)=>{
     var CountryCode = val.CountryCode;
     var TotalCasses  = val.TotalConfirmed;
     var data = countries[CountryCode];
    //  console.log(data);
     if(TotalCasses < 100)
     {
       var color = 'rgba(0,0,255, 0.4)';
   
     }
     else if(TotalCasses < 500)
     {
       var color = 'rgba(0,0,255, 0.5)';
     }
     else if (TotalCasses < 1000)
     {
       var color = 'rgba(0,0,255, 0.6)';
     }
     else if (TotalCasses < 5000 )
     {
       var color = 'rgba(0,0,255, 0.7)';
     }
     else if (TotalCasses < 10000 )
     {
       var color = 'rgba(0,0,255, 0.8)';
     }
     else if (TotalCasses < 20000)
     {
       var color = 'rgba(0,0,255, 0.9)';
     }
     else if (TotalCasses < 30000)
     {
       var color = 'rgba(0,0,255, 1)';
     }
     else if (TotalCasses < 40000)
     {
       var color = 'rgba(255,0,0, 0.4)';
     }
     else if (TotalCasses < 50000)
     {
       var color = 'rgba(255,0,0, 0.5)';
     }
     else if (TotalCasses < 60000)
     {
       var color = 'rgba(255,0,0, 0.6)';
     }
     else if (TotalCasses < 70000)
     {
       var color = 'rgba(255,0,0, 0.7)';
     }
     else if (TotalCasses < 80000)
     {
       var color = 'rgba(255,0,0, 0.7)';
     }
     else if (TotalCasses < 100000)
     {
       var color = 'rgba(255,0,0, 0.8)';
   
     }
     else if (TotalCasses < 200000)
     {
       var color = 'rgba(255,0,0, 0.8)';
   
     }
     else if (TotalCasses < 300000)
     {
       var color = 'rgba(255,0,0, 0.9)';
     }
     else if (TotalCasses < 400000)
     {
       var color = 'rgba(255,0,0, 0.9)';
     }
     else if (TotalCasses < 500000)
     {
       var color = 'rgba(255,0,0, 0.9)';
   
     }
     else if (TotalCasses < 600000)
     {
       var color = 'rgba(255,0,0, 1)';
     }
     else if (TotalCasses < 700000)
     {
       var color = 'rgba(255,0,0, 1)';
     }
     else if (TotalCasses < 800000)
     {
       var color = 'rgba(255,0,0, 1)';
     }
     else if (TotalCasses < 900000)
     {
       var color = 'rgba(255,0,0, 1)';
     }
     else if (TotalCasses < 1000000)
     {
       var color = 'rgba(255,0,0, 1)';
     }
     else if (TotalCasses > 1000000)
     {
       var color = 'rgba(255,0,0, 1)';
     }
     
   
     
     
     if(typeof(data) !="undefined")
     {
       var json = data[0];
   
       var latitude = parseFloat(json.Latitude);
       var lng = parseFloat(json.Longitude);
       
       var Name = json.Name;
   
       
       if(typeof(latitude) !='undefined' )
       {
        //  console.log(latitude+","+ lng)  
         return(
           <Marker
           coordinate={{"latitude":  latitude, "longitude":lng}}
           tracksViewChanges={false}
           >
           <View style={{height:50, width:50, backgroundColor:color, borderRadius:50, justifyContent:'center', alignItems:'center', borderWidth:3, borderColor:'rgba(0,0,0,0.4)'}}>
           <Text style={{color:'#fff', fontWeight:'bold'}}>
             {TotalCasses}
           </Text>
           </View>
           </Marker>
         )
       }
    
     }
     });

    this.setState({mapsMarker:markers, Loading:false,})
    BackgroundTimer.clearInterval(inter);  
    //  return(markers);
     
   }
},1000)
}
if(this.state.MapState == 'Local')
{
  console.log(this.state.Latitude)
  console.log(	this.state.Longitude)
  console.log('run')
  console.log('run')
  console.log('run')

  let coords = {
    latitude: 	JSON.parse(this.state.Latitude),
    longitude: 	JSON.parse(this.state.Longitude),
    latitudeDelta: 0.0015,
    longitudeDelta: 0.0121,
}
this._map.animateToRegion(coords, 1000);

if(this.state.LocalData !=null){
const markers = this.state.LocalData.map((val)=>{
  if(val.Category == "COVID Status" & val.CurrentLatitude !="" & val.CurrentLongitude !=""){
    var color = 'blue';
    if(val.Status == "Positive"){
      var color = 'red';
    }
    else
    {
      var color = 'blue';
    }
    return(
      <Marker
      flat={false}
      pinColor={color}
      coordinate={{"latitude":  JSON.parse(val.CurrentLatitude), "longitude": JSON.parse(val.CurrentLongitude)}}
      tracksViewChanges={false}
     />
    )
    
  }
console.log(val);
});
if(markers !=null){
  this.setState({mapsMarker: markers, Loading:false,});
}
}
}

}

render(){

  return(
    <>
    <StatusBar translucent backgroundColor={(Platform.OS == "ios")?"default":"#79C698"} barStyle={(Platform.OS == "ios")?"default":"light-content"}/>
  
     <Modal
    coverScreen={true}
    isVisible={this.state.Loading}>
          <View style={{flex: 1,  borderBottomLeftRadius:0, borderBottomRightRadius:0, padding:0, margin:0, justifyContent:'center'}}>
         <View>
    <ActivityIndicator 
    hidesWhenStopped
    animating={this.state.Loading} size="large" color="#fff"/>
    <View style={(this.state.NeedReload == 0)?{display:'none'}:{}}>
    <Text style={{color:"#fff", textAlign:'center'}}>
    Some problem in getting data. Please reload.
    </Text>
    <Button title={"Reload"} onPress={()=>{this.getDataApi}} containerStyle={{ borderRadius:10, borderWidth:3, borderColor:'#fff', margin:20}} buttonStyle={{backgroundColor:'transparent',}} />
    </View>
          </View>
          </View>
        </Modal>
    <SafeAreaView style={{paddingTop:'5%'}}>
   
    <ImageBackground style={{width:'100%', height:'100%'}} source={require('../images/bg_dash.jpg')}>
    <View style={[{position:'absolute',top:0 , height:100, width:100, zIndex:3, right:10}]}>
    <TouchableOpacity
    onPress={()=>this.props.navigation.openDrawer()}
    style={{flex:1, justifyContent:'center', alignItems:'flex-end',padding:10}}>
    <Image source={require('../images/menuicon.png')} style={{width:35, height:35, shadowColor:'#000', shadowOffset:{height:1, width:1}, shadowRadius:3, shadowOpacity:1}} />
    </TouchableOpacity>
    </View>
    {(this.state.visibleState == 1 )?
    <View style={[{position:'absolute',bottom:'9%' , right:-10, height:100, width:150, zIndex:3}, (this.state.btnInActive == false)?{height:350}:null]}>
    <FloatingAction
    color={'#39867E'}
    showBackground={false}
    onStateChange={(val )=>{
      this.setState({btnInActive:val.isActive});
    }}
    actions={actions}
    onPressItem={name => {
      if(name == 'bt_stats'){
        this.props.navigation.navigate('Stats')
      }
      if(name == 'bt_who'){
        this.setState({MapState : 'WHO', Loading:true,});
        setTimeout(()=>{
          console.log(this.state.CountryLatitude)
          console.log(this.state.CountryLongitude)
          let coords = {
            latitude: 	 	JSON.parse(this.state.CountryLatitude),
            longitude: 		JSON.parse(this.state.CountryLongitude),
            latitudeDelta: 4.9956,
            longitudeDelta: 30.9924,
        }
        this._map.animateToRegion(coords, 1000)
        this.renderMarkers();
        },500)
      }
      if(name == 'bt_local'){
        this.setState({MapState : 'Local', Loading:true,});
        setTimeout(()=>{
          this.renderMarkers();
        },500)

      }
    }}

    />
    </View>
    :
    null}

    <View style={{flex:5}}>
    <View style={{flex:0.05}}/>
    <View style={{flex:3.95, justifyContent:'center'}}>
{(this.state.visibleState == 2)?
  <View 
  onLayout={()=>this.setState({Loading:false})}
  style={{ marginLeft:20, marginTop:50}}>
  <Text style={{fontSize:20, color:'white', fontWeight:'bold', letterSpacing:2, textShadowColor:'#000', textShadowOffset:{height:0.4, width:0.4}, textShadowRadius:2,}}>
    Notification
  </Text>
</View>
:
null}
{(this.state.visibleState == 3)?
  <View style={{ marginLeft:20, marginTop:50}}>
  <Text style={{fontSize:20, color:'white', fontWeight:'bold', letterSpacing:2, textShadowColor:'#000', textShadowOffset:{height:0.4, width:0.4}, textShadowRadius:2,}}>
    Awareness Videos
  </Text>
</View>
:
null}


      <View style={[(this.state.visibleState == 1)?styles.container1:null,
                    (this.state.visibleState == 2 )? styles.container2: null,
                    (this.state.visibleState == 3 )? styles.container3: null]}>
{(this.state.visibleState == 1)?
     <MapView
     provider={PROVIDER_GOOGLE}
     onMapReady={()=>this.renderMarkers()}
    ref={component => this._map = component}
    style={{ height:'100%',}}
    initialRegion={{
      latitude: 	 	30.375321,
      longitude: 		69.345116,
      latitudeDelta: 4.9956,
      longitudeDelta: 30.9924,
    }}
  >
    {this.state.mapsMarker}
  </MapView>
  :
  null
}
   {(this.state.visibleState == 2)?
    <ScrollView>
    {(this.state.NDList !=null)?
    this.renderNotifications()
    :
    null
    }
        </ScrollView>

  :
  null}
  {(this.state.visibleState == 3)?
  <ScrollView onContentSizeChange={()=>this.setState({Loading:false})}>
    {<CovidVideos/>}
  </ScrollView>
  // this.renderQuestions()
:
null
}

  </View>
    </View>

    <View style={{flex:0.5}}>
    <View style={{flex:3, flexDirection:'row'}}>

    <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
    onPress={()=>{
      if(this.state.visibleState != 1){
        this.setState({Loading:true, visibleState:1, })
      }
    }}>
    <MaterialCommunityIcons name={'map-marker-radius'} size={50} color={'#fff'} style={(this.state.visibleState == 1)?styles.iconActive:styles.iconInActive} />
    </TouchableOpacity>

    <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
    onPress={()=>{
      if(this.state.visibleState != 2){
        this.setState({ Loading:true,visibleState:2,});
      }
    }}>
    <MaterialIcons name={'notifications'} size={50} color={'#fff'} style={(this.state.visibleState == 2)?styles.iconActive:styles.iconInActive} />
    </TouchableOpacity>


    <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}}
    onPress={()=>{
      if(this.state.visibleState != 3){
        this.setState({ Loading:true,visibleState:3});
        // setTimeout(() => {
        // this.setState({ Loading:false})          
        // }, 2000);
      }
    }}
    >
    <Octicons name={'checklist'} size={45} color={'#fff'} style={(this.state.visibleState == 3)?styles.iconActive:styles.iconInActive} />
    </TouchableOpacity>


    </View>
    </View>

    </View>

    </ImageBackground>
    </SafeAreaView>
    </>
  );
}
}

const styles = StyleSheet.create({
  buttonStyleActive:{
    backgroundColor:'#fff', borderRadius:50,
  },
  buttonStyleInActive:{
    backgroundColor:'transparent', borderRadius:50, borderColor:'#fff', borderWidth:2
  },
  BtnTitleStyleActive:{
    color:"#39867E", letterSpacing:2, fontSize:14, fontWeight:'bold'
  },
  BtnTitleStyleInActive:{
    color:"#fff", letterSpacing:2, fontSize:14, fontWeight:'bold'
  },
  container1:{
    justifyContent:'flex-start',
    margin:5,
      // borderBottomLeftRadius:20,
      // borderBottomRightRadius:20,
      borderRadius:20,
       overflow:'hidden',
       height:'100%',
      //  borderColor:'rgba(255,255,255, 0.5)', borderWidth:10,

  },
  container2:{
    overflow:'hidden',height:'90%', margin:10,
  },
  container3:
  {
    borderRadius:20, overflow:'hidden',height:'70%', margin:20,
  },
  iconActive:{
    opacity:1
  },
  iconInActive:{
    opacity:0.6
  }
});



const questions = [
  {
    id:0,
    type:'select',
    question:'Are you from Pakistan ?',
    options:[
      {
        id:1,
        value:'Yes',
      },
      {
        id:2,
        value:'No'
      }
    ]
  },
  {
    id:1,
    type:'select',
    question:'Please select your gender ?',
    options:[
      {
        id:3,
        value:'Male',
      },
      {
        id:4,
        value:'Female'
      },
    ]
  },
  {
    id:3,
    type:'TextInput',
    keyboardType:'numeric',
    question:'Please enter your age ?',
  }
];

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon,

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
    borderWidth:3,
    borderColor:'grey',
    backgroundColor:'red'
  },
  viewContainer:{
    backgroundColor:'red'
  }
});

// const countries = {"AD":{"CountryCode":"AD","Latitude":"42.546245","Longtitude":"1.601554","Name":"Andorra"},
//                   "AE":{"CountryCode":"AE","Latitude":"23.424076","Longtitude":"53.847818","Name":"United Arab Emirates"},
//                   "AF":{"CountryCode":"AF","Latitude":"33.93911","Longtitude":"67.709953","Name":"Afghanistan"},"AG":{"CountryCode":"AG","Latitude":"17.060816","Longtitude":"-61.796428","Name":"Antigua and Barbuda"},"AI":{"CountryCode":"AI","Latitude":"18.220554","Longtitude":"-63.068615","Name":"Anguilla"},"AL":{"CountryCode":"AL","Latitude":"41.153332","Longtitude":"20.168331","Name":"Albania"},"AM":{"CountryCode":"AM","Latitude":"40.069099","Longtitude":"45.038189","Name":"Armenia"},"AN":{"CountryCode":"AN","Latitude":"12.226079","Longtitude":"-69.060087","Name":"Netherlands Antilles"},"AO":{"CountryCode":"AO","Latitude":"-11.202692","Longtitude":"17.873887","Name":"Angola"},"AQ":{"CountryCode":"AQ","Latitude":"-75.250973","Longtitude":"-0.071389","Name":"Antarctica"},"AR":{"CountryCode":"AR","Latitude":"-38.416097","Longtitude":"-63.616672","Name":"Argentina"},"AS":{"CountryCode":"AS","Latitude":"-14.270972","Longtitude":"-170.132217","Name":"American Samoa"},"AT":{"CountryCode":"AT","Latitude":"47.516231","Longtitude":"14.550072","Name":"Austria"},"AU":{"CountryCode":"AU","Latitude":"-25.274398","Longtitude":"133.775136","Name":"Australia"},"AW":{"CountryCode":"AW","Latitude":"12.52111","Longtitude":"-69.968338","Name":"Aruba"},"AZ":{"CountryCode":"AZ","Latitude":"40.143105","Longtitude":"47.576927","Name":"Azerbaijan"},"BA":{"CountryCode":"BA","Latitude":"43.915886","Longtitude":"17.679076","Name":"Bosnia and Herzegovina"},"BB":{"CountryCode":"BB","Latitude":"13.193887","Longtitude":"-59.543198","Name":"Barbados"},"BD":{"CountryCode":"BD","Latitude":"23.684994","Longtitude":"90.356331","Name":"Bangladesh"},"BE":{"CountryCode":"BE","Latitude":"50.503887","Longtitude":"4.469936","Name":"Belgium"},"BF":{"CountryCode":"BF","Latitude":"12.238333","Longtitude":"-1.561593","Name":"Burkina Faso"},"BG":{"CountryCode":"BG","Latitude":"42.733883","Longtitude":"25.48583","Name":"Bulgaria"},"BH":{"CountryCode":"BH","Latitude":"25.930414","Longtitude":"50.637772","Name":"Bahrain"},"BI":{"CountryCode":"BI","Latitude":"-3.373056","Longtitude":"29.918886","Name":"Burundi"},"BJ":{"CountryCode":"BJ","Latitude":"9.30769","Longtitude":"2.315834","Name":"Benin"},"BM":{"CountryCode":"BM","Latitude":"32.321384","Longtitude":"-64.75737","Name":"Bermuda"},"BN":{"CountryCode":"BN","Latitude":"4.535277","Longtitude":"114.727669","Name":"Brunei"},"BO":{"CountryCode":"BO","Latitude":"-16.290154","Longtitude":"-63.588653","Name":"Bolivia"},"BR":{"CountryCode":"BR","Latitude":"-14.235004","Longtitude":"-51.92528","Name":"Brazil"},"BS":{"CountryCode":"BS","Latitude":"25.03428","Longtitude":"-77.39628","Name":"Bahamas"},"BT":{"CountryCode":"BT","Latitude":"27.514162","Longtitude":"90.433601","Name":"Bhutan"},"BV":{"CountryCode":"BV","Latitude":"-54.423199","Longtitude":"3.413194","Name":"Bouvet Island"},"BW":{"CountryCode":"BW","Latitude":"-22.328474","Longtitude":"24.684866","Name":"Botswana"},"BY":{"CountryCode":"BY","Latitude":"53.709807","Longtitude":"27.953389","Name":"Belarus"},"BZ":{"CountryCode":"BZ","Latitude":"17.189877","Longtitude":"-88.49765","Name":"Belize"},"CA":{"CountryCode":"CA","Latitude":"56.130366","Longtitude":"-106.346771","Name":"Canada"},"CC":{"CountryCode":"CC","Latitude":"-12.164165","Longtitude":"96.870956","Name":"Cocos [Keeling] Islands"},"CD":{"CountryCode":"CD","Latitude":"-4.038333","Longtitude":"21.758664","Name":"Congo [DRC]"},"CF":{"CountryCode":"CF","Latitude":"6.611111","Longtitude":"20.939444","Name":"Central African Republic"},"CG":{"CountryCode":"CG","Latitude":"-0.228021","Longtitude":"15.827659","Name":"Congo [Republic]"},"CH":{"CountryCode":"CH","Latitude":"46.818188","Longtitude":"8.227512","Name":"Switzerland"},"CI":{"CountryCode":"CI","Latitude":"7.539989","Longtitude":"-5.54708","Name":"Côte d'Ivoire"},"CK":{"CountryCode":"CK","Latitude":"-21.236736","Longtitude":"-159.777671","Name":"Cook Islands"},"CL":{"CountryCode":"CL","Latitude":"-35.675147","Longtitude":"-71.542969","Name":"Chile"},"CM":{"CountryCode":"CM","Latitude":"7.369722","Longtitude":"12.354722","Name":"Cameroon"},"CN":{"CountryCode":"CN","Latitude":"35.86166","Longtitude":"104.195397","Name":"China"},"CO":{"CountryCode":"CO","Latitude":"4.570868","Longtitude":"-74.297333","Name":"Colombia"},"CR":{"CountryCode":"CR","Latitude":"9.748917","Longtitude":"-83.753428","Name":"Costa Rica"},"CU":{"CountryCode":"CU","Latitude":"21.521757","Longtitude":"-77.781167","Name":"Cuba"},"CV":{"CountryCode":"CV","Latitude":"16.002082","Longtitude":"-24.013197","Name":"Cape Verde"},"CX":{"CountryCode":"CX","Latitude":"-10.447525","Longtitude":"105.690449","Name":"Christmas Island"},"CY":{"CountryCode":"CY","Latitude":"35.126413","Longtitude":"33.429859","Name":"Cyprus"},"CZ":{"CountryCode":"CZ","Latitude":"49.817492","Longtitude":"15.472962","Name":"Czech Republic"},"DE":{"CountryCode":"DE","Latitude":"51.165691","Longtitude":"10.451526","Name":"Germany"},"DJ":{"CountryCode":"DJ","Latitude":"11.825138","Longtitude":"42.590275","Name":"Djibouti"},"DK":{"CountryCode":"DK","Latitude":"56.26392","Longtitude":"9.501785","Name":"Denmark"},"DM":{"CountryCode":"DM","Latitude":"15.414999","Longtitude":"-61.370976","Name":"Dominica"},"DO":{"CountryCode":"DO","Latitude":"18.735693","Longtitude":"-70.162651","Name":"Dominican Republic"},"DZ":{"CountryCode":"DZ","Latitude":"28.033886","Longtitude":"1.659626","Name":"Algeria"},"EC":{"CountryCode":"EC","Latitude":"-1.831239","Longtitude":"-78.183406","Name":"Ecuador"},"EE":{"CountryCode":"EE","Latitude":"58.595272","Longtitude":"25.013607","Name":"Estonia"},"EG":{"CountryCode":"EG","Latitude":"26.820553","Longtitude":"30.802498","Name":"Egypt"},"EH":{"CountryCode":"EH","Latitude":"24.215527","Longtitude":"-12.885834","Name":"Western Sahara"},"ER":{"CountryCode":"ER","Latitude":"15.179384","Longtitude":"39.782334","Name":"Eritrea"},"ES":{"CountryCode":"ES","Latitude":"40.463667","Longtitude":"-3.74922","Name":"Spain"},"ET":{"CountryCode":"ET","Latitude":"9.145","Longtitude":"40.489673","Name":"Ethiopia"},"FI":{"CountryCode":"FI","Latitude":"61.92411","Longtitude":"25.748151","Name":"Finland"},"FJ":{"CountryCode":"FJ","Latitude":"-16.578193","Longtitude":"179.414413","Name":"Fiji"},"FK":{"CountryCode":"FK","Latitude":"-51.796253","Longtitude":"-59.523613","Name":"Falkland Islands [Islas Malvinas]"},"FM":{"CountryCode":"FM","Latitude":"7.425554","Longtitude":"150.550812","Name":"Micronesia"},"FO":{"CountryCode":"FO","Latitude":"61.892635","Longtitude":"-6.911806","Name":"Faroe Islands"},"FR":{"CountryCode":"FR","Latitude":"46.227638","Longtitude":"2.213749","Name":"France"},"GA":{"CountryCode":"GA","Latitude":"-0.803689","Longtitude":"11.609444","Name":"Gabon"},"GB":{"CountryCode":"GB","Latitude":"55.378051","Longtitude":"-3.435973","Name":"United Kingdom"},"GD":{"CountryCode":"GD","Latitude":"12.262776","Longtitude":"-61.604171","Name":"Grenada"},"GE":{"CountryCode":"GE","Latitude":"42.315407","Longtitude":"43.356892","Name":"Georgia"},"GF":{"CountryCode":"GF","Latitude":"3.933889","Longtitude":"-53.125782","Name":"French Guiana"},"GG":{"CountryCode":"GG","Latitude":"49.465691","Longtitude":"-2.585278","Name":"Guernsey"},"GH":{"CountryCode":"GH","Latitude":"7.946527","Longtitude":"-1.023194","Name":"Ghana"},"GI":{"CountryCode":"GI","Latitude":"36.137741","Longtitude":"-5.345374","Name":"Gibraltar"},"GL":{"CountryCode":"GL","Latitude":"71.706936","Longtitude":"-42.604303","Name":"Greenland"},"GM":{"CountryCode":"GM","Latitude":"13.443182","Longtitude":"-15.310139","Name":"Gambia"},"GN":{"CountryCode":"GN","Latitude":"9.945587","Longtitude":"-9.696645","Name":"Guinea"},"GP":{"CountryCode":"GP","Latitude":"16.995971","Longtitude":"-62.067641","Name":"Guadeloupe"},"GQ":{"CountryCode":"GQ","Latitude":"1.650801","Longtitude":"10.267895","Name":"Equatorial Guinea"},"GR":{"CountryCode":"GR","Latitude":"39.074208","Longtitude":"21.824312","Name":"Greece"},"GS":{"CountryCode":"GS","Latitude":"-54.429579","Longtitude":"-36.587909","Name":"South Georgia and the South Sandwich Islands"},"GT":{"CountryCode":"GT","Latitude":"15.783471","Longtitude":"-90.230759","Name":"Guatemala"},"GU":{"CountryCode":"GU","Latitude":"13.444304","Longtitude":"144.793731","Name":"Guam"},"GW":{"CountryCode":"GW","Latitude":"11.803749","Longtitude":"-15.180413","Name":"Guinea-Bissau"},"GY":{"CountryCode":"GY","Latitude":"4.860416","Longtitude":"-58.93018","Name":"Guyana"},"GZ":{"CountryCode":"GZ","Latitude":"31.354676","Longtitude":"34.308825","Name":"Gaza Strip"},"HK":{"CountryCode":"HK","Latitude":"22.396428","Longtitude":"114.109497","Name":"Hong Kong"},"HM":{"CountryCode":"HM","Latitude":"-53.08181","Longtitude":"73.504158","Name":"Heard Island and McDonald Islands"},"HN":{"CountryCode":"HN","Latitude":"15.199999","Longtitude":"-86.241905","Name":"Honduras"},"HR":{"CountryCode":"HR","Latitude":"45.1","Longtitude":"15.2","Name":"Croatia"},"HT":{"CountryCode":"HT","Latitude":"18.971187","Longtitude":"-72.285215","Name":"Haiti"},"HU":{"CountryCode":"HU","Latitude":"47.162494","Longtitude":"19.503304","Name":"Hungary"},"ID":{"CountryCode":"ID","Latitude":"-0.789275","Longtitude":"113.921327","Name":"Indonesia"},"IE":{"CountryCode":"IE","Latitude":"53.41291","Longtitude":"-8.24389","Name":"Ireland"},"IL":{"CountryCode":"IL","Latitude":"31.046051","Longtitude":"34.851612","Name":"Israel"},"IM":{"CountryCode":"IM","Latitude":"54.236107","Longtitude":"-4.548056","Name":"Isle of Man"},"IN":{"CountryCode":"IN","Latitude":"20.593684","Longtitude":"78.96288","Name":"India"},
//                   "IO":{"CountryCode":"IO","Latitude":"-6.343194","Longtitude":"71.876519","Name":"British Indian Ocean Territory"},"IQ":{"CountryCode":"IQ","Latitude":"33.223191","Longtitude":"43.679291","Name":"Iraq"},"IR":{"CountryCode":"IR","Latitude":"32.427908","Longtitude":"53.688046","Name":"Iran"},"IS":{"CountryCode":"IS","Latitude":"64.963051","Longtitude":"-19.020835","Name":"Iceland"},"IT":{"CountryCode":"IT","Latitude":"41.87194","Longtitude":"12.56738","Name":"Italy"},"JE":{"CountryCode":"JE","Latitude":"49.214439","Longtitude":"-2.13125","Name":"Jersey"},"JM":{"CountryCode":"JM","Latitude":"18.109581","Longtitude":"-77.297508","Name":"Jamaica"},"JO":{"CountryCode":"JO","Latitude":"30.585164","Longtitude":"36.238414","Name":"Jordan"},"JP":{"CountryCode":"JP","Latitude":"36.204824","Longtitude":"138.252924","Name":"Japan"},"KE":{"CountryCode":"KE","Latitude":"-0.023559","Longtitude":"37.906193","Name":"Kenya"},"KG":{"CountryCode":"KG","Latitude":"41.20438","Longtitude":"74.766098","Name":"Kyrgyzstan"},"KH":{"CountryCode":"KH","Latitude":"12.565679","Longtitude":"104.990963","Name":"Cambodia"},"KI":{"CountryCode":"KI","Latitude":"-3.370417","Longtitude":"-168.734039","Name":"Kiribati"},"KM":{"CountryCode":"KM","Latitude":"-11.875001","Longtitude":"43.872219","Name":"Comoros"},"KN":{"CountryCode":"KN","Latitude":"17.357822","Longtitude":"-62.782998","Name":"Saint Kitts and Nevis"},"KP":{"CountryCode":"KP","Latitude":"40.339852","Longtitude":"127.510093","Name":"North Korea"},"KR":{"CountryCode":"KR","Latitude":"35.907757","Longtitude":"127.766922","Name":"South Korea"},"KW":{"CountryCode":"KW","Latitude":"29.31166","Longtitude":"47.481766","Name":"Kuwait"},"KY":{"CountryCode":"KY","Latitude":"19.513469","Longtitude":"-80.566956","Name":"Cayman Islands"},"KZ":{"CountryCode":"KZ","Latitude":"48.019573","Longtitude":"66.923684","Name":"Kazakhstan"},"LA":{"CountryCode":"LA","Latitude":"19.85627","Longtitude":"102.495496","Name":"Laos"},"LB":{"CountryCode":"LB","Latitude":"33.854721","Longtitude":"35.862285","Name":"Lebanon"},"LC":{"CountryCode":"LC","Latitude":"13.909444","Longtitude":"-60.978893","Name":"Saint Lucia"},"LI":{"CountryCode":"LI","Latitude":"47.166","Longtitude":"9.555373","Name":"Liechtenstein"},"LK":{"CountryCode":"LK","Latitude":"7.873054","Longtitude":"80.771797","Name":"Sri Lanka"},"LR":{"CountryCode":"LR","Latitude":"6.428055","Longtitude":"-9.429499","Name":"Liberia"},"LS":{"CountryCode":"LS","Latitude":"-29.609988","Longtitude":"28.233608","Name":"Lesotho"},"LT":{"CountryCode":"LT","Latitude":"55.169438","Longtitude":"23.881275","Name":"Lithuania"},"LU":{"CountryCode":"LU","Latitude":"49.815273","Longtitude":"6.129583","Name":"Luxembourg"},"LV":{"CountryCode":"LV","Latitude":"56.879635","Longtitude":"24.603189","Name":"Latvia"},"LY":{"CountryCode":"LY","Latitude":"26.3351","Longtitude":"17.228331","Name":"Libya"},"MA":{"CountryCode":"MA","Latitude":"31.791702","Longtitude":"-7.09262","Name":"Morocco"},"MC":{"CountryCode":"MC","Latitude":"43.750298","Longtitude":"7.412841","Name":"Monaco"},"MD":{"CountryCode":"MD","Latitude":"47.411631","Longtitude":"28.369885","Name":"Moldova"},"ME":{"CountryCode":"ME","Latitude":"42.708678","Longtitude":"19.37439","Name":"Montenegro"},"MG":{"CountryCode":"MG","Latitude":"-18.766947","Longtitude":"46.869107","Name":"Madagascar"},"MH":{"CountryCode":"MH","Latitude":"7.131474","Longtitude":"171.184478","Name":"Marshall Islands"},"MK":{"CountryCode":"MK","Latitude":"41.608635","Longtitude":"21.745275","Name":"Macedonia [FYROM]"},"ML":{"CountryCode":"ML","Latitude":"17.570692","Longtitude":"-3.996166","Name":"Mali"},"MM":{"CountryCode":"MM","Latitude":"21.913965","Longtitude":"95.956223","Name":"Myanmar [Burma]"},"MN":{"CountryCode":"MN","Latitude":"46.862496","Longtitude":"103.846656","Name":"Mongolia"},"MO":{"CountryCode":"MO","Latitude":"22.198745","Longtitude":"113.543873","Name":"Macau"},"MP":{"CountryCode":"MP","Latitude":"17.33083","Longtitude":"145.38469","Name":"Northern Mariana Islands"},"MQ":{"CountryCode":"MQ","Latitude":"14.641528","Longtitude":"-61.024174","Name":"Martinique"},"MR":{"CountryCode":"MR","Latitude":"21.00789","Longtitude":"-10.940835","Name":"Mauritania"},"MS":{"CountryCode":"MS","Latitude":"16.742498","Longtitude":"-62.187366","Name":"Montserrat"},"MT":{"CountryCode":"MT","Latitude":"35.937496","Longtitude":"14.375416","Name":"Malta"},"MU":{"CountryCode":"MU","Latitude":"-20.348404","Longtitude":"57.552152","Name":"Mauritius"},"MV":{"CountryCode":"MV","Latitude":"3.202778","Longtitude":"73.22068","Name":"Maldives"},"MW":{"CountryCode":"MW","Latitude":"-13.254308","Longtitude":"34.301525","Name":"Malawi"},"MX":{"CountryCode":"MX","Latitude":"23.634501","Longtitude":"-102.552784","Name":"Mexico"},"MY":{"CountryCode":"MY","Latitude":"4.210484","Longtitude":"101.975766","Name":"Malaysia"},"MZ":{"CountryCode":"MZ","Latitude":"-18.665695","Longtitude":"35.529562","Name":"Mozambique"},"NA":{"CountryCode":"NA","Latitude":"-22.95764","Longtitude":"18.49041","Name":"Namibia"},"NC":{"CountryCode":"NC","Latitude":"-20.904305","Longtitude":"165.618042","Name":"New Caledonia"},"NE":{"CountryCode":"NE","Latitude":"17.607789","Longtitude":"8.081666","Name":"Niger"},"NF":{"CountryCode":"NF","Latitude":"-29.040835","Longtitude":"167.954712","Name":"Norfolk Island"},"NG":{"CountryCode":"NG","Latitude":"9.081999","Longtitude":"8.675277","Name":"Nigeria"},"NI":{"CountryCode":"NI","Latitude":"12.865416","Longtitude":"-85.207229","Name":"Nicaragua"},"NL":{"CountryCode":"NL","Latitude":"52.132633","Longtitude":"5.291266","Name":"Netherlands"},"NO":{"CountryCode":"NO","Latitude":"60.472024","Longtitude":"8.468946","Name":"Norway"},"NP":{"CountryCode":"NP","Latitude":"28.394857","Longtitude":"84.124008","Name":"Nepal"},"NR":{"CountryCode":"NR","Latitude":"-0.522778","Longtitude":"166.931503","Name":"Nauru"},"NU":{"CountryCode":"NU","Latitude":"-19.054445","Longtitude":"-169.867233","Name":"Niue"},"NZ":{"CountryCode":"NZ","Latitude":"-40.900557","Longtitude":"174.885971","Name":"New Zealand"},"OM":{"CountryCode":"OM","Latitude":"21.512583","Longtitude":"55.923255","Name":"Oman"},"PA":{"CountryCode":"PA","Latitude":"8.537981","Longtitude":"-80.782127","Name":"Panama"},"PE":{"CountryCode":"PE","Latitude":"-9.189967","Longtitude":"-75.015152","Name":"Peru"},"PF":{"CountryCode":"PF","Latitude":"-17.679742","Longtitude":"-149.406843","Name":"French Polynesia"},"PG":{"CountryCode":"PG","Latitude":"-6.314993","Longtitude":"143.95555","Name":"Papua New Guinea"},"PH":{"CountryCode":"PH","Latitude":"12.879721","Longtitude":"121.774017","Name":"Philippines"},"PK":{"CountryCode":"PK","Latitude":"30.375321","Longtitude":"69.345116","Name":"Pakistan"},"PL":{"CountryCode":"PL","Latitude":"51.919438","Longtitude":"19.145136","Name":"Poland"},"PM":{"CountryCode":"PM","Latitude":"46.941936","Longtitude":"-56.27111","Name":"Saint Pierre and Miquelon"},"PN":{"CountryCode":"PN","Latitude":"-24.703615","Longtitude":"-127.439308","Name":"Pitcairn Islands"},"PR":{"CountryCode":"PR","Latitude":"18.220833","Longtitude":"-66.590149","Name":"Puerto Rico"},"PS":{"CountryCode":"PS","Latitude":"31.952162","Longtitude":"35.233154","Name":"Palestinian Territories"},"PT":{"CountryCode":"PT","Latitude":"39.399872","Longtitude":"-8.224454","Name":"Portugal"},"PW":{"CountryCode":"PW","Latitude":"7.51498","Longtitude":"134.58252","Name":"Palau"},"PY":{"CountryCode":"PY","Latitude":"-23.442503","Longtitude":"-58.443832","Name":"Paraguay"},"QA":{"CountryCode":"QA","Latitude":"25.354826","Longtitude":"51.183884","Name":"Qatar"},"RE":{"CountryCode":"RE","Latitude":"-21.115141","Longtitude":"55.536384","Name":"Réunion"},"RO":{"CountryCode":"RO","Latitude":"45.943161","Longtitude":"24.96676","Name":"Romania"},"RS":{"CountryCode":"RS","Latitude":"44.016521","Longtitude":"21.005859","Name":"Serbia"},"RU":{"CountryCode":"RU","Latitude":"61.52401","Longtitude":"105.318756","Name":"Russia"},"RW":{"CountryCode":"RW","Latitude":"-1.940278","Longtitude":"29.873888","Name":"Rwanda"},"SA":{"CountryCode":"SA","Latitude":"23.885942","Longtitude":"45.079162","Name":"Saudi Arabia"},"SB":{"CountryCode":"SB","Latitude":"-9.64571","Longtitude":"160.156194","Name":"Solomon Islands"},"SC":{"CountryCode":"SC","Latitude":"-4.679574","Longtitude":"55.491977","Name":"Seychelles"},"SD":{"CountryCode":"SD","Latitude":"12.862807","Longtitude":"30.217636","Name":"Sudan"},"SE":{"CountryCode":"SE","Latitude":"60.128161","Longtitude":"18.643501","Name":"Sweden"},"SG":{"CountryCode":"SG","Latitude":"1.352083","Longtitude":"103.819836","Name":"Singapore"},"SH":{"CountryCode":"SH","Latitude":"-24.143474","Longtitude":"-10.030696","Name":"Saint Helena"},"SI":{"CountryCode":"SI","Latitude":"46.151241","Longtitude":"14.995463","Name":"Slovenia"},"SJ":{"CountryCode":"SJ","Latitude":"77.553604","Longtitude":"23.670272","Name":"Svalbard and Jan Mayen"},"SK":{"CountryCode":"SK","Latitude":"48.669026","Longtitude":"19.699024","Name":"Slovakia"},"SL":{"CountryCode":"SL","Latitude":"8.460555","Longtitude":"-11.779889","Name":"Sierra Leone"},"SM":{"CountryCode":"SM","Latitude":"43.94236","Longtitude":"12.457777","Name":"San Marino"},"SN":{"CountryCode":"SN","Latitude":"14.497401","Longtitude":"-14.452362","Name":"Senegal"},"SO":{"CountryCode":"SO","Latitude":"5.152149","Longtitude":"46.199616","Name":"Somalia"},"SR":{"CountryCode":"SR","Latitude":"3.919305","Longtitude":"-56.027783","Name":"Suriname"},"ST":{"CountryCode":"ST","Latitude":"0.18636","Longtitude":"6.613081","Name":"São Tomé and Príncipe"},"SV":{"CountryCode":"SV","Latitude":"13.794185","Longtitude":"-88.89653","Name":"El Salvador"},"SY":{"CountryCode":"SY","Latitude":"34.802075","Longtitude":"38.996815","Name":"Syria"},
//                   "SZ":{"CountryCode":"SZ","Latitude":"-26.522503","Longtitude":"31.465866","Name":"Swaziland"},"TC":{"CountryCode":"TC","Latitude":"21.694025","Longtitude":"-71.797928","Name":"Turks and Caicos Islands"},"TD":{"CountryCode":"TD","Latitude":"15.454166","Longtitude":"18.732207","Name":"Chad"},"TF":{"CountryCode":"TF","Latitude":"-49.280366","Longtitude":"69.348557","Name":"French Southern Territories"},"TG":{"CountryCode":"TG","Latitude":"8.619543","Longtitude":"0.824782","Name":"Togo"},"TH":{"CountryCode":"TH","Latitude":"15.870032","Longtitude":"100.992541","Name":"Thailand"},"TJ":{"CountryCode":"TJ","Latitude":"38.861034","Longtitude":"71.276093","Name":"Tajikistan"},"TK":{"CountryCode":"TK","Latitude":"-8.967363","Longtitude":"-171.855881","Name":"Tokelau"},"TL":{"CountryCode":"TL","Latitude":"-8.874217","Longtitude":"125.727539","Name":"Timor-Leste"},"TM":{"CountryCode":"TM","Latitude":"38.969719","Longtitude":"59.556278","Name":"Turkmenistan"},"TN":{"CountryCode":"TN","Latitude":"33.886917","Longtitude":"9.537499","Name":"Tunisia"},"TO":{"CountryCode":"TO","Latitude":"-21.178986","Longtitude":"-175.198242","Name":"Tonga"},"TR":{"CountryCode":"TR","Latitude":"38.963745","Longtitude":"35.243322","Name":"Turkey"},"TT":{"CountryCode":"TT","Latitude":"10.691803","Longtitude":"-61.222503","Name":"Trinidad and Tobago"},"TV":{"CountryCode":"TV","Latitude":"-7.109535","Longtitude":"177.64933","Name":"Tuvalu"},"TW":{"CountryCode":"TW","Latitude":"23.69781","Longtitude":"120.960515","Name":"Taiwan"},"TZ":{"CountryCode":"TZ","Latitude":"-6.369028","Longtitude":"34.888822","Name":"Tanzania"},"UA":{"CountryCode":"UA","Latitude":"48.379433","Longtitude":"31.16558","Name":"Ukraine"},"UG":{"CountryCode":"UG","Latitude":"1.373333","Longtitude":"32.290275","Name":"Uganda"},"UM":{"CountryCode":"UM","Latitude":"","Longtitude":"","Name":"U.S. Minor Outlying Islands"},"US":{"CountryCode":"US","Latitude":"37.09024","Longtitude":"-95.712891","Name":"United States"},"UY":{"CountryCode":"UY","Latitude":"-32.522779","Longtitude":"-55.765835","Name":"Uruguay"},"UZ":{"CountryCode":"UZ","Latitude":"41.377491","Longtitude":"64.585262","Name":"Uzbekistan"},"VA":{"CountryCode":"VA","Latitude":"41.902916","Longtitude":"12.453389","Name":"Vatican City"},"VC":{"CountryCode":"VC","Latitude":"12.984305","Longtitude":"-61.287228","Name":"Saint Vincent and the Grenadines"},"VE":{"CountryCode":"VE","Latitude":"6.42375","Longtitude":"-66.58973","Name":"Venezuela"},"VG":{"CountryCode":"VG","Latitude":"18.420695","Longtitude":"-64.639968","Name":"British Virgin Islands"},"VI":{"CountryCode":"VI","Latitude":"18.335765","Longtitude":"-64.896335","Name":"U.S. Virgin Islands"},"VN":{"CountryCode":"VN","Latitude":"14.058324","Longtitude":"108.277199","Name":"Vietnam"},"VU":{"CountryCode":"VU","Latitude":"-15.376706","Longtitude":"166.959158","Name":"Vanuatu"},"WF":{"CountryCode":"WF","Latitude":"-13.768752","Longtitude":"-177.156097","Name":"Wallis and Futuna"},"WS":{"CountryCode":"WS","Latitude":"-13.759029","Longtitude":"-172.104629","Name":"Samoa"},"XK":{"CountryCode":"XK","Latitude":"42.602636","Longtitude":"20.902977","Name":"Kosovo"},"YE":{"CountryCode":"YE","Latitude":"15.552727","Longtitude":"48.516388","Name":"Yemen"},"YT":{"CountryCode":"YT","Latitude":"-12.8275","Longtitude":"45.166244","Name":"Mayotte"},"ZA":{"CountryCode":"ZA","Latitude":"-30.559482","Longtitude":"22.937506","Name":"South Africa"},"ZM":{"CountryCode":"ZM","Latitude":"-13.133897","Longtitude":"27.849332","Name":"Zambia"},"ZW":{"CountryCode":"ZW","Latitude":"-19.015438","Longtitude":"29.154857","Name":"Zimbabwe"}};
