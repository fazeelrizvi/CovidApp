import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import Reinput from 'reinput'
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-elements';
import Geolocation from '@react-native-community/geolocation';
import {Login, encodeFormData} from '../AllApi';
import Modal from 'react-native-modal';

export default class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      PhoneNo:'',
      Password:'',
      isLoading:true
    }
  }
  async componentDidMount(){
    var UserID = await AsyncStorage.getItem('UserID', null);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    console.log(UserID);
    if(UserID != null){
      this.props.navigation.navigate('Dashboard');
    }
    this.setState({isLoading:false})    

    Geolocation.getCurrentPosition((val)=>{
      // console.log(val);
    }, (err)=>{
      // console.log(err)
    },
    {
      enableHighAccuracy: false,
      timeout: 20000, 
      maximumAge: 1000
    });
  }
  login(){
  var PhoneNo = this.state.PhoneNo;
  var Password = this.state.Password;
  var params = {
    PhoneNo:PhoneNo,
    Password:Password
  }
  var Body = encodeFormData(params);
fetch(Login,{
  method:'POST',
  headers:{
    Accept:'application/json',
    'Content-Type':'application/x-www-form-urlencoded'
  },
  body:Body
})
.then((res)=>res.json())
.then((json)=>{
  if(json.Result.Code == "00"){
    console.log(json.Result);
    var UserID = json.Result.UserID;
    console.log(UserID);
    AsyncStorage.setItem('UserID', JSON.stringify(UserID));
    this.props.navigation.navigate('Dashboard');
  }
  else
  {
    alert(json.Result.Message)
  }
})
.catch((err)=>{

});

  }
  render(){
  return (
    <>
    <StatusBar translucent backgroundColor={(Platform.OS == "ios")?"default":"#79C698"} barStyle={(Platform.OS == "ios")?"default":"light-content"}/>
    <Modal
    coverScreen={true}
    isVisible={this.state.isLoading}>
          <View style={{flex: 1,  borderBottomLeftRadius:0, borderBottomRightRadius:0, padding:0, margin:0, justifyContent:'center'}}>
         <View>
    <ActivityIndicator size="large" color="#fff"/>
          </View>
          </View>
        </Modal>
      <SafeAreaView style={{paddingTop:'5%'}}>
        <ImageBackground
        source={require('../images/bg_login.jpg')}
        style={{height:'100%', width:'100%'}}
        >

          <ScrollView>

          <View style={{paddingLeft: 40, paddingTop: 40}}>
            <Image 
            source={require('../images/shield.png')} style={{shadowColor:"#fff", shadowOpacity:1, shadowOffset:{height:1, width:0.5}, shadowRadius:3, height: 130, width:130}}/>
          </View>


          <View style={{width: 150, paddingTop:20, marginLeft: 40}}>
            <Text style={{color:'white', fontWeight:'bold', fontSize:30,}}>
              Login Your Account
            </Text>
          </View>
 


          <View style={{marginLeft: 40, marginRight:40}}>
            <View style={{flexDirection:'row', width: '100%'}}>

              <View style={{paddingTop: 20, paddingRight:10}}>
                <Icon name='envelope' size={25} color='white' />
              </View>
              
              <View style={{flex:1}}>
                <Reinput
                onChangeText={(PhoneNo)=>{this.setState({PhoneNo})}}
                fontSize={18} color='white' underlineColor='white' labelColor='white' label='Your Phone Number' labelActiveColor='white' activeColor='white' />
              </View>
            </View>



            <View style={{flexDirection:'row', width: '100%'}}>

              <View style={{paddingTop: 20, paddingRight:10}}>
                <Icon name='lock' size={25} color='white' />
              </View>
              
              <View style={{flex:1}}>
                <Reinput
                onChangeText={(Password)=>{this.setState({Password})}}                
                secureTextEntry={true} fontSize={18} color='white' underlineColor='white' labelColor='white' label='Your Password' labelActiveColor='white' activeColor='white' />
              </View>
            </View>
          </View>





          <TouchableOpacity
          onPress={()=>this.login()}>
          <LinearGradient
          start={{x: 0, y: 0}} end={{x: 1, y: 0}}
           colors={['#79C697', '#39867E']} style={{borderWidth:2, borderColor:'white', borderRadius: 50, marginLeft:40, marginRight:40, paddingTop:5, paddingBottom:5}}>
              <Text style={{color:'white', fontSize: 25, textAlign:'center'}}>
                Sign In
              </Text>
              </LinearGradient>
            </TouchableOpacity>
            <View>
              <Text style={{textAlign:'center', padding:10, fontWeight:'bold', fontSize:16, color:'#fff'}}>
                Or
              </Text>
            </View>
            <TouchableOpacity
          onPress={()=>this.props.navigation.navigate('Dashboard')}>
          <LinearGradient
          start={{x: 0, y: 0}} end={{x: 1, y: 0}}
           colors={['#79C697', '#39867E']} style={{borderWidth:2, borderColor:'white', borderRadius: 50, marginLeft:40, marginRight:40, paddingTop:5, paddingBottom:5}}>
              <Text style={{color:'white', fontSize: 25, textAlign:'center'}}>
                Continue
              </Text>
              </LinearGradient>
            </TouchableOpacity>
          



          
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </>
    );
  }
};

const styles = StyleSheet.create({

});