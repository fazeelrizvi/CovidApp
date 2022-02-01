import React from 'react';
import {View, Text,SafeAreaView,TextInput, StyleSheet, TouchableOpacity, AsyncStorage, StatusBar,Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import {default as Entypo} from 'react-native-vector-icons/Entypo';
import Geolocation from '@react-native-community/geolocation';
import {encodeFormData, SignUpOrEdit, GetCountries, GetUserProfile} from '../AllApi';

export default class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            UserName:'',
            Gender:'',
            Email:'',
            PhoneNo:'',
            CountryID:'',
            State:'',
            City:'',
            Address:'',
            PostalCode:'',
            CurrentLocation:'',
            CurrentLatitude:'',
            CurrentLongitude:'',
            Password:'',
            UserID:'',
            ConfirmPassword:'',
            CountriesList:[]
        }
    }

    async componentDidMount(){
       this.getGPSLocation();
       this.intervals();
       this.getCountries();
      
       var UserID = JSON.parse(await AsyncStorage.getItem('UserID', ''));
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
       console.log(UserID);
       console.log(UserID);
       console.log(UserID);
       console.log(UserID);
       console.log(UserID);
       console.log(UserID);
       console.log(UserID);
       this.setState({UserID});
       this.getProfile(UserID);
    }
    getProfile(UserID){
        fetch(`${GetUserProfile}?UserID=${UserID}`,{
        method:'GET',
        })
        .then((res)=>res.json())
        .then((json)=>{
            if(json.Result.Code == "00"){
                var Result = json.Result;
                this.setState({
                    UserName: Result.UserName,
                    Gender: Result.Gender,
                    Email: Result.Email,
                    PhoneNo: Result.PhoneNo,
                    CountryID: Result.CountryID,
                    State: Result.State,
                    City: Result.City,
                    Address: Result.Address,
                    PostalCode: Result.PostalCode,
                })
            }
        })
        .catch((err)=>{

        });
    }
    getCountries(){
        fetch(GetCountries,{
            method:'GET'
        })
        .then((res)=>res.json())
        .then((json)=>{
            var Result = json.Result;
            if(Result.Code == "00"){
                const countries = [];
                Result.CList.map((val)=>{
                var value = {label: val.CountryName, value: val.ID};
                countries.push(value);
                });
                // console.log(countries);
                this.setState({CountriesList: countries})
            }
            else
            {
                alert('Some error occured during getting countries.')
            }
            // console.log(json);
        })
        .catch((err)=>{

        });
    }

    getGPSLocation(){
        Geolocation.getCurrentPosition((val)=>{
            var CurrentLocation = val.coords.latitude+','+val.coords.longitude;
            var CurrentLatitude = val.coords.latitude;
            var CurrentLongitude = val.coords.longitude;
            // console.log(val)
            this.setState({ 
                CurrentLocation,
                CurrentLatitude,
                CurrentLongitude
            });

          }, (err)=>{
            this.getGPSLocation();
            // console.log(err);
        },
        {
            enableHighAccuracy: false,
            timeout: 20000, 
            maximumAge: 1000
        });
    }
    intervals(){
        const checkLatLng = setInterval(()=>{
            if(this.state.CurrentLocation == ''){
                this.getGPSLocation();
            }
            else{
                clearInterval(checkLatLng);
            }
        },2000)

    }
    SingUpOrUpdate(){
        let x = 0;
     
      
        var check = 0;
        var empty = 0;
        var count = 0;

        var UserName = this.state.UserName;
        var Gender = this.state.Gender;
        var Email = this.state.Email;
        var PhoneNo = this.state.PhoneNo;
        var CountryID = this.state.CountryID;
        var City = this.state.City;
        var State = this.state.State;
        var Address = this.state.Address;
        var PostalCode = this.state.PostalCode;
        var CurrentLocation = this.state.CurrentLocation;
        var CurrentLatitude = this.state.CurrentLatitude;
        var CurrentLongitude = this.state.CurrentLongitude;
        var Password = this.state.Password;
        var ConfirmPassword = this.state.ConfirmPassword;
        var UserID = this.state.UserID;
        
        const FormDataForCheck = [
            UserName,
            Gender,
            Email,
            PhoneNo,
            CountryID,
            State,
            City,
            Address,
            PostalCode,
            CurrentLocation,
            CurrentLatitude,
            CurrentLongitude,
            Password,
            ConfirmPassword,
        ];
        const FormData = {
            UserName:UserName,
            Gender:Gender,
            Email:Email,
            PhoneNo:PhoneNo,
            CountryID:CountryID,
            State:State,
            City:City,
            Address:Address,
            PostalCode:PostalCode,
            CurrentLocation:CurrentLocation,
            CurrentLatitude:CurrentLatitude,
            CurrentLongitude:CurrentLongitude,
            Password:Password,
            ConfirmPassword:ConfirmPassword,
            UserID:UserID,
        };

        FormDataForCheck.map((val)=>{
            if(val !='')
            {
                check = 1;
            }
            else
            {
                // console.log(val);
                empty = 1;
            }
        });
        var Body = encodeFormData(FormData);
      
        if(empty != 1 || count == 13 || UserID !=''){
            if(ConfirmPassword == Password || UserID !=''){
                fetch(SignUpOrEdit, {
                    method:'POST',
                    headers:{
                        Accept:'application/json',
                        'Content-Type':'application/x-www-form-urlencoded',
                    },
                    body:Body
                })
                .then((res)=>res.json())
                .then((json)=>{
                    if(json.Result.Code == "00"){
                        alert(json.Result.Message);
                        var UserID = json.Result.UserID;
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
                        console.log(UserID);
                        console.log(UserID);
                        console.log(UserID);
                        console.log(UserID);
                        console.log(UserID);
                        console.log(UserID);
                        console.log(UserID);
                        if(UserID !=''){
                        AsyncStorage.setItem('UserID', JSON.stringify(UserID));

                        this.setState({UserID})
                        }
                    }
                    else
                    {
                        alert(json.Result.Messages);
                    }
                })
                .catch((err)=>{
                    // console.log(err)
                });
            }
            else
            {
                alert('Password not Matched');
            }
           
        }
        else{
            alert('Some Fields are empty');
        }
    }
    render(){
        return(<>
    <StatusBar translucent backgroundColor={(Platform.OS == "ios")?"default":"#79C698"} barStyle={(Platform.OS == "ios")?"default":"light-content"}/>

            <SafeAreaView style={{flex:1, paddingTop:'5%'}}>
            <LinearGradient 
            style={{flex:1, }}
            start={{x: 0.0, y: 1.0}} end={{x: 0, y: 0}}
            colors={['#77C498', '#39867E']}>

            <View style={{backgroundColor:'rgba(0,0,0,0.5)', flex:1}}>
            <View style={{flex:0.09 , padding:10}}>
            <View style={{flex:3, flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1, justifyContent:'center'}}>
            <TouchableOpacity
            onPress={()=>this.props.navigation.goBack(null)}
            style={{padding:10}}>
            <Entypo name={"chevron-left"} size={40} color={"#fff"}/>
            </TouchableOpacity>
            </View>
            <View style={{flex:1, justifyContent:'center'}}>
                <Text style={{color:"#fff", fontSize:22, fontWeight:'bold', letterSpacing:2, textAlign:'center'}}>
                    {(this.state.UserID !='' & this.state.UserID !=null  & this.state.UserID !=0)?
                    'Edit'
                    :
                    'Sign Up'                    
                    }
                </Text>
            </View>
            <View style={{flex:1}}>
            </View>
            </View>
             </View> 

            <KeyboardAwareScrollView style={{flex:0.95, }}>
            <View style={{margin:20, marginTop:0}}>
   

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
                Name
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput
            ref={"UserName"}
            autoCompleteType={"username"}
            placeholder={"Enter your Name"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput}
            onChangeText={(UserName)=>this.setState({UserName})}>
                {this.state.UserName}
            </TextInput>
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            Email
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput placeholder={"Enter your Email"} 
            autoCompleteType={"email"}
            keyboardType={"email-address"}
            placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput}
             onChangeText={(Email)=>this.setState({Email})} >
            {this.state.Email}
             </TextInput>
            </View>
            </View>


            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
                Phone
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput 
            autoCompleteType={"tel"}      
            keyboardType={"phone-pad"}      
            placeholder={"Enter your Phone Number"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput} 
            onChangeText={(PhoneNo)=>this.setState({PhoneNo})}>
                {this.state.PhoneNo}
            </TextInput>
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            State
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput 
            placeholder={"Enter your State"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput} 
            onChangeText={(State)=>this.setState({State})}>
                {this.state.State}
            </TextInput>
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            City
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput placeholder={"Enter your City"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput} 
            onChangeText={(City)=>this.setState({City})}>
                {this.state.City}
            </TextInput>
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            Address
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput
            autoCompleteType={"street-address"}
            placeholder={"Enter your Address"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput} 
            onChangeText={(Address)=>this.setState({Address})}>
                {this.state.Address}
            </TextInput>
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            Postal Code
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput
            autoCompleteType={"postal-code"}
            placeholder={"Enter your Postal Code"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput} 
            onChangeText={(PostalCode)=>this.setState({PostalCode})}>
                {this.state.PostalCode}
            </TextInput>
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            Country
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <RNPickerSelect
            value={this.state.CountryID}
            style={pickerSelectStyles}
            placeholder={{
                label: 'Select Country',
                value: null,
                color: '#fff',
            }}
            style={{color:'#fff', }}
            onValueChange={(CountryID) => this.setState({CountryID})}
            items={this.state.CountriesList}
            />
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            Gender
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <RNPickerSelect
            value={this.state.Gender}
            style={pickerSelectStyles}
            placeholder={{
                label: 'Select Gender',
                value: null,
                color: 'red',
            }}
            style={{color:'red', }}
            onValueChange={(Gender) => this.setState({Gender})}
            items={[
                { label: 'Male', value: 'Male', },
                { label: 'Female', value: 'Female'},
            ]}
            />
            </View>
            </View>


            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            Password
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput 
            autoCompleteType={"password"}         
            secureTextEntry={true}
            placeholder={"Create a Password"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput} 
            onChangeText={(Password)=>this.setState({Password})}/>
            </View>
            </View>

            <View style={styles.FieldContainer}>
            <Text style={styles.FieldTitleStyle}>
            Confirm Password
            </Text>
            <View style={styles.FieldTextInputLayout}>
            <TextInput
            autoCompleteType={"password"}         
            secureTextEntry={true}
            placeholder={"Confirm Password"} placeholderTextColor={'rgba(255,255,255, 0.5)'} style={styles.FieldTextInput} 
            onChangeText={(ConfirmPassword)=>this.setState({ConfirmPassword})}/>
            </View>
            </View>

            </View>
            <View style={{paddingTop:20, paddingBottom:50}}>
            <TouchableOpacity
            onPress={()=>this.SingUpOrUpdate()}>
            <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            colors={['#79C697', '#39867E']} style={{borderWidth:2, borderColor:'white', borderRadius: 50, marginLeft:40, marginRight:40, paddingTop:5, paddingBottom:5}}>
                <Text style={{color:'white', fontSize: 25, textAlign:'center'}}>
                    {(this.state.UserID !='' & this.state.UserID !=null & this.state.UserID !=0)?
                    'Update'
                    :
                    'Sign Up'                    
                    }
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            </View>

            </KeyboardAwareScrollView>
            </View>
            </LinearGradient>
            </SafeAreaView>
            </>
        )
    }
} 
const styles = StyleSheet.create({
FieldContainer:{
    marginTop:20
},
FieldTitleStyle:{
    paddingLeft:20, color:'#fff', letterSpacing:1,
},
FieldTextInputLayout:{
    borderWidth:1, borderRadius:50, borderColor:'#fff',justifyContent:'center', padding:5
},
FieldTextInput:{
    color:'#fff', fontSize:18, letterSpacing:0.5, paddingLeft:20
}
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 3,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'white',
      paddingRight: 30, // to ensure the text is never behind the icon,
  
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'white',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputIOSContainer:{
      backgroundColor:'red',
      color:'#fff'
    },
    viewContainer:{
      backgroundColor:'red',
      color:'#fff'
    }
  });