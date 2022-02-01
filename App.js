import React,{useCallback} from 'react';
import {Dimensions} from "react-native";

import MapScreen from './assets/screens/MapScreen';
import LoginScreen from './assets/screens/Login';
import NDetails from './assets/screens/NotificationDetails';
import Profile from './assets/screens/Profile';
import Drawer from './assets/screens/drawer';
import {YellowBox, View, Text, Linking, ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import Stats from './assets/screens/Stats';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer';
import {PermissionsAndroid} from 'react-native';
import CovidVideos from './assets/screens/CovidVideos';
navigator.geolocation = require('@react-native-community/geolocation');
import NetInfo from "@react-native-community/netinfo";


const screenWidth = Dimensions.get('window').width;
const drawerWidth = screenWidth-10;
class Hidden extends React.Component{
  
  render(){
    return null;
  }
}

const OpenSettingsButton = ({ children }) => {
  const handlePress = useCallback(async () => {
    // Open the custom settings if the app has one
    await Linking.openSettings();
  }, []);

  return <Button containerStyle={{margin:50}} title={children} onPress={handlePress} />;
};

var PushNotification = require("react-native-push-notification");


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      latlng:'',
      Latitude:'',
      Longitude:'',
      LocationPermission:0,
      Net:0,
    }
  }

async  componentDidMount(){
  console.disableYellowBox = true;

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
      });

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'This permission required for maintaing social distance',
          message: 'MBE Covid19 tracker needs access to your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the camera');
      } else {
        // console.log('Camera permission denied');
      }
    } catch (err) {
      // console.warn(err);
    }
    this.Location();
    setInterval(() => {
   this.netinfo();
    }, 1000);
  }
netinfo(){
  NetInfo.fetch().then(state => {
    if(state.isConnected == false){
      if(this.state.Net !=2){
        this.setState({Net:2})
        console.log(state.isConnected)
      }
    }
    else{
      if(this.state.Net != 0){
      this.setState({Net:0})
      }
    }
  });
}
  async Location(){
    this.setState({LocationPermission:0})

    navigator.geolocation.getCurrentPosition((val)=>{
      var latLng = val.coords.latitude+','+val.coords.longitude;
      if(this.state.LocationPermission != 2){
        this.setState({LocationPermission:2})
      }

    }, (err)=>{
      console.log(err)
      console.log(err)
      if(err.code == 1 || err.code == 2){
        if(this.state.LocationPermission != 1){
        this.setState({LocationPermission:1})
        }
      }
      else{
        this.setState({LocationPermission:2})
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 2000, 
      maximumAge: 1000
    });
  }
 
  render(){
    if(this.state.LocationPermission ==1)
    {
     return(
      <View style={{justifyContent:'center', height:'100%',}}>
      <Text style={{textAlign:'center', fontSize:24}}>
        We can't access your location
      </Text>
      <View style={{paddingTop:50}}>
     
      <Text style={{textAlign:'center', fontSize:12}}>
      if you dont have allow location for this app{"\n"}Open app settings -> Permissions ->  allow location.
      </Text>
      <Text style={{textAlign:'center', fontSize:12}}>
      Or
      </Text>
      <Text style={{textAlign:'center', fontSize:12}}>
      Check your location service
      </Text>
      </View>

      <OpenSettingsButton>Open Settings</OpenSettingsButton>
      <Button title={"Reload"}  containerStyle={{margin:50, marginTop:10}} 
       onPress={() => this.Location()}
      // onPress={()=>this.Location()}
      />
      </View>
     )
    }
    if(this.state.Net == 2)
      {
        return(
          <View style={{justifyContent:'center', height:'100%',}}>
          <Text style={{textAlign:'center', fontSize:24}}>
            Check your internet connection!
          </Text>
          </View>
        )
      }
    if(this.state.LocationPermission == 0){
      return(
        <View style={{justifyContent:'center', height:'100%', alignItems:'center'}}>
          <ActivityIndicator size={"large"} color={"#000"}/>
        </View>
      )
    }
    if(this.state.LocationPermission == 2 & this.state.Net == 0){
      return( 
        <AppContainer/>
      )
    }
  }
}

const DashboardStack = createStackNavigator({
  Dashboard: {
    screen: MapScreen,
    navigationOptions: ({ navigation }) => {
      return {
           headerTitle: null,
            headerBackTitle: null,
            headerTransparent: true,
            headerStyle: {
            backgroundColor: "transparent",
            },
      };
      
    }
  }
});


const StatsStack = createStackNavigator({
  Stats: {
    screen: Stats,
    navigationOptions: ({ navigation }) => {
      return {
           headerTitle: null,
            headerBackTitle: null,
            headerTransparent: true,
            headerStyle: {
            backgroundColor: "transparent",
            },
      };
      
    }
  }
});


const LoginStack = createStackNavigator({ 
  login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => {
      return {
           headerTitle: null,
            headerBackTitle: null,
            headerTransparent: true,
            headerStyle: {
            backgroundColor: "transparent",
            },
      };
      
    }
  }
});


const CovidVideosStack = createStackNavigator({ 
  CovidVideos: {
    screen: CovidVideos,
    navigationOptions: ({ navigation }) => {
      return {
           headerTitle: null,
            headerBackTitle: null,
            headerTransparent: true,
            headerStyle: {
            backgroundColor: "transparent",
            },
      };
      
    }
  }
});



const NDetailsStack = createStackNavigator({ 
  NDetails: {
    screen: NDetails,
    navigationOptions: ({ navigation }) => {
      return {
           headerTitle: null,
            headerBackTitle: null,
            headerTransparent: true,
            headerStyle: {
            backgroundColor: "transparent",
            },
      };
      
    }
  }
});

const ProfileStack = createStackNavigator({ 
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      return {
           headerTitle: null,
            headerBackTitle: null,
            headerTransparent: true,
            headerStyle: {
            backgroundColor: "transparent",
            },
      };
      
    }
  }
});

const RootStack = createStackNavigator({
  Dashboard: {screen: DashboardStack},
  Stats: {screen: StatsStack},
  NDetails: {screen: NDetailsStack},
  Profile:{ screen: ProfileStack},
  CovidVideos: {screen: CovidVideosStack}

}
,
{
  defaultNavigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return {
      header: null,
      headerTitle: routeName
    };
  },
}
  );


const DrawerConfig = {

  drawerType: 'slide',
  drawerPosition:'left',
  drawerWidth: drawerWidth,
  contentComponent: ({ navigation }) =>{
    return(<Drawer/>)
  },
  drawerOpenRoute:'LeftSideMenu',
  drawerCloseRoute: 'LeftSideMenuClose',
  draweToggleRoute:'LeftSideMenuToggle' ,
  overlayColor: 'rgba(52, 52, 52, 0.8)', 
  }


const AppDrawerNavigator = createDrawerNavigator({  
  Dashboard: {
    screen: RootStack,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: <Hidden />,
    },
  },
},
DrawerConfig
);


const AppSwitchNavigator = createSwitchNavigator({
 Login: LoginStack,
 AppDrawerNavigator
});
const AppContainer = createAppContainer(AppSwitchNavigator);
export default App;
