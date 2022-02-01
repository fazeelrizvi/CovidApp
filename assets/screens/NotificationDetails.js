import React from 'react';
import {View, Text, SafeAreaView, ImageBackground, TouchableOpacity, ActivityIndicator, StatusBar} from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {default as Entypo} from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';


export default class NDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {Url:'', Loading:true,
                    Progess:0};
    }
    componentDidMount(){
        var Url = this.props.navigation.getParam('Url', null);
        // console.log(Url)
        this.setState({Url})
    }
    Progess(val){
        var value = parseInt(val.nativeEvent.progress*100);
        this.setState({Progess: value});
        if(value == 100){
        this.setState({Loading: false});            
        }
    }
    render(){
        return(
            <>
    <StatusBar backgroundColor={"#79C698"} barStyle={"light-content"}/>

            <Modal
            coverScreen={true}
            isVisible={this.state.Loading}>
                  <View style={{flex: 1,  borderBottomLeftRadius:0, borderBottomRightRadius:0, padding:0, margin:0, justifyContent:'center'}}>
                 <View>
            <ActivityIndicator size="large" color="#fff"/>
            <Text style={{color:'#fff',fontSize:16, textAlign:'center', marginTop:10}}>
            {this.state.Progess}%
            </Text>
                  </View>
                  </View>
                </Modal>
            <SafeAreaView style={{flex:3, paddingTop:'5%'}}>
            <LinearGradient 
            style={{flex:3}}
            start={{x: 0.0, y: 1.0}} end={{x: 0, y: 0}}
            colors={['#77C498', '#39867E']}  >

           <View style={{flex:0.2}}>
           <View style={{flex:3, flexDirection:'row'}}>
               <View style={{flex:1}}>
               <TouchableOpacity
            onPress={()=>this.props.navigation.goBack(null)}
            style={{padding:10}}>
            <Entypo name={"chevron-left"} size={40} color={"#fff"}/>
            </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                </View>
                <View style={{flex:1}}>
                </View>

            </View> 
            </View>  
           <View style={{flex:2.5,  margin:20, justifyContent:'center'}}>
            {(this.state.Url !=null)?
            <WebView source={{ uri: this.state.Url }}
            onLoadProgress={(val)=>this.Progess(val)}
            onLoadEnd={()=>this.setState({Loading:false})}/>                    
            :
            <Text style={{color:'#fff', fontSize:32, fontWeight:'bold', textAlign:'center'}}>
                URL not found
            </Text>
            }
            </View>
            <View>
                
            </View>
            </LinearGradient>
            </SafeAreaView>
            </>
        )
    }
} 