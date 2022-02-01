
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  View,
  
  Platform

} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import {GetCovidRelatedVideos} from '../AllApi';
// import YouTube from 'react-native-youtube';
// import { YouTubeStandaloneIOS } from 'react-native-youtube';
import {default as Entypo} from 'react-native-vector-icons/Entypo';


export default class CovidVideos extends React.Component{
    constructor(props){
        super(props);
        this.state={
            VideosList : <View/>,
        }
    }
    componentDidMount(){
    this.getVideos();
}
getVideos(){
    fetch(GetCovidRelatedVideos)
    .then((res)=>res.json())
    .then((json)=>{
        if(json.Result.Code == "00")
        {
            this.renderVideos(json.Result.VList);
            this.setState({VList: json.Result.VList});
        }
    })
    .catch((err)=>{
        console.log(err);
    });
}
renderVideos(VideoList)
{
   const VideosList =  VideoList.map((val)=>{
        return(
            <>
            <View style={{marginTop:10, height:200, backgroundColor:'black',}}>
              <WebView
                        style={{}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        source={{uri: `https://www.youtube.com/embed/${val.URL}` }}
                />
  
            </View>
            <View style={{marginTop:10,marginLeft:30,marginRight:30, marginBottom:30 ,}}>
              <Text style={{color:'white', padding:10, fontSize:16}}>
               {val.Title}
              </Text>
              <Text style={{color:'white', padding:10, fontSize:18}}>
               {val.Description}
              </Text>
            </View>
            </>
        )
    });
    if(VideosList !=null){
        this.setState({VideosList})
    }
}
    render(){

  return (
    <>


    
      
     
        <View>
         {this.state.VideosList} 
        </View>
    </>
    );
  }
};


  const styles = StyleSheet.create({
   
  WebViewContainer: {
   
      marginTop: (Platform.OS == 'ios') ? 20 : 0,
   
    }
    
  });