import React from 'react';
import {View, Text, SafeAreaView, ImageBackground, ScrollView, TouchableOpacity, AsyncStorage} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {default as Entypo} from 'react-native-vector-icons/Entypo';
import {StatsAPI} from '../AllApi';

export default class Stats extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {confirmCasses:0,
                    TotalRecovered:0,
                    TotalDeaths:0};
    }
    async componentDidMount(){
       var CountryCode = await AsyncStorage.getItem('CountryCode',0);

        console.log(CountryCode)
        if(CountryCode == 'PK'){
            var countryId = 2;
        }
        else if(CountryCode == 'CA'){
            var countryId = 1;
        }
        else{
            var countryId = 1;
        }
        console.log(countryId)

        
        this.getStats(countryId);
    }
    getStats(countryId)
    {
        console.log(countryId)
        fetch(`${StatsAPI}?CountryID=${countryId}`,{
              method:'GET',
             })
             .then((res)=> res.json())
             .then((json)=>{
                var result = json.Result;
                if(result.Code == "00")
                {
                    this.setState({StatesDetails: result.SDList});
                    result.SDList.map((val)=>{
                        if(val.PRUID == "99"){
                            var TotalCasses = val.NumTotal;
                            this.setState({confirmCasses: TotalCasses, 
                                           TotalRecovered: val.NumRecovered,
                                           TotalDeaths: val.NumDeaths});

                         }
                    })
                }
                else
                {
                    alert('Issue in getting data.');
                }
             })
             .catch((err)=>{
                // console.log(err);
             });
    }
    renderStates(){
      return  this.state.StatesDetails.map((val)=>{
          if(val.PRUID !=99)
          {
            var PRName = val.PRName;
            var ImageAddress = `http://103.24.99.91:8085/${val.ImageURL}`;
            // console.log(ImageAddress);
            return(
                <TouchableOpacity style={{padding:10}}>
                    <ImageBackground source={{uri:ImageAddress}} style={{width:150, height:120, borderRadius:100, }}   imageStyle={{ borderRadius: 10,}}>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                  
                    borderRadius: 10,
                }} >
                <View style={{flex:2, padding:10}}>
                    
                    <View style={{flex:0.6}}>
                    <Text style={{fontSize:12, color:'#fff', textShadowColor:'#000', textShadowOffset:{height:1, width:1}, textShadowRadius:1, letterSpacing:2, fontWeight:'bold'}}>
                    {val.PRName}
                    </Text>
                    </View>
                
                    <View style={{flex:1,}}>
                    <Text style={{fontSize:22, color:'#fff', textShadowColor:'#000', textShadowOffset:{height:1, width:1}, textShadowRadius:1, letterSpacing:2, fontWeight:'bold',}}>
                    {val.NumTotal}
                    </Text>
                    </View>
                </View>
                
                </View>
                    </ImageBackground>
                </TouchableOpacity>
                
            )
          }
        
        
        });
       this.setState({confirmCasses: TotalCasses})
    }
    render(){
        return(
            <LinearGradient 
            style={{flex:3}}
            start={{x: 0.0, y: 1.0}} end={{x: 0, y: 0}}
            colors={['#77C498', '#39867E']}  >
            <SafeAreaView style={{flex:3, paddingTop:'5.5%'}}>
         
            
            <View style={{flex:0.2}} >
            <TouchableOpacity
            onPress={()=>this.props.navigation.goBack(null)}
            style={{padding:10}}>
            <Entypo name={"chevron-left"} size={40} color={"#fff"}/>
            </TouchableOpacity>
            </View>
            <View style={{flex:2}}>
                <View style={{flex:0.25}}>

                <View style={{paddingLeft:30, paddingTop:20}}>
                <Text style={{fontSize:14, fontWeight:'bold', color:'#fff', opacity:0.6}}>
                    Confirmed Casses
                </Text>
                <Text style={{fontSize:36, fontWeight:'bold', color:'#fff', paddingTop:10}}>  
                    {this.state.confirmCasses}
                </Text>
                </View>

                </View>
                <View style={{flex:0.35}}>

                <ScrollView style={{padding:10, }} horizontal={true}>
                {(this.state.StatesDetails)?
                this.renderStates()
                :
                null
                }
                </ScrollView>
                    
            </View>
            
            <View style={{flex:0.7}}>
            <ScrollView>
            <TouchableOpacity style={{margin:20, backgroundColor:'#fff', padding:15, borderRadius:10, borderWidth:2, borderColor:'#b2b2b2'}}>
            <Text style={{color:'#9b9b9b', fontWeight:'bold', letterSpacing:1}}>
                Recovered
            </Text>
            <Text style={{fontSize:24, fontWeight:'bold', color:'#39867e',marginTop:10, letterSpacing:2}}>
                {this.state.TotalRecovered}
            </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={{margin:20, backgroundColor:'#fff', padding:15, borderRadius:10, borderWidth:2, borderColor:'#b2b2b2'}}>
            <Text style={{color:'#9b9b9b', fontWeight:'bold', letterSpacing:1}}>
                Critical
            </Text>
            <Text style={{fontSize:24, fontWeight:'bold', color:'#ff8300',marginTop:10, letterSpacing:2}}>
                700
            </Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={{margin:20, backgroundColor:'#fff', padding:15, borderRadius:10, borderWidth:2, borderColor:'#b2b2b2'}}>
            <Text style={{color:'#9b9b9b', fontWeight:'bold', letterSpacing:1}}>
                Deaths
            </Text>
            <Text style={{fontSize:24, fontWeight:'bold', color:'#ff0000',marginTop:10, letterSpacing:2}}>
                {this.state.TotalDeaths}
            </Text>
            </TouchableOpacity>
            
            </ScrollView>
            </View>
            </View>
            </SafeAreaView>
            </LinearGradient>


        );
    }
}
const StatesImages = 
{
    "British Columbia":{
        ImageName:require("../images/StatesImages/britishColumbia.jpg")
    },
    "Alberta":{
        ImageName:require("../images/StatesImages/alberta.jpg")
    },
    "Saskatchewan":{
        ImageName:require("../images/StatesImages/saskatchewan.jpg")
    },
    "Manitoba":{
        ImageName:require("../images/StatesImages/Manitoba.jpg")
    },
    "Ontario":{
        ImageName:require("../images/StatesImages/Ontario.jpg")
    },
    "Quebec":{
        ImageName:require("../images/StatesImages/Quebec.jpg")
    },
    "Newfoundland and Labrador":{
        ImageName:require("../images/StatesImages/Newfoundland-and-Labrador.jpg")
    },
    "New Brunswick":{
        ImageName:require("../images/StatesImages/New-Brunswick.jpg")
    },
    "Nova Scotia":{
        ImageName:require("../images/StatesImages/Nova-Scotia.jpg")
    },
    "Prince Edward Island":{
         ImageName:require("../images/StatesImages/Prince-Edward-Island.jpeg")
    },
    "Yukon":{
        ImageName:require("../images/StatesImages/Yukon.jpeg")
    },
    "Northwest Territories":{
         ImageName:require("../images/StatesImages/Nunavut.jpg")
    },
    "Nunavut":{
        ImageName:require("../images/StatesImages/Nunavut.jpg")
    },
    "Repatriated travellers":{
         ImageName:require("../images/StatesImages/Repatriated-travellers.jpg")
    },
    "Balochistan":{
        ImageName:require("../images/StatesImages/balochistan.jpg")
    },
    "Islamabad":{
        ImageName:require("../images/StatesImages/faisalMosque.jpeg")
    },
    "KPK":{
        ImageName:require("../images/StatesImages/khyberBypass.jpg")
    },
    "Punjab":{
        ImageName:require("../images/StatesImages/minarPakistan.jpeg")
    },
    "Sindh":{
        ImageName:require("../images/StatesImages/mazarQaid.jpg")
    },
    "AJK":{
        ImageName:require("../images/StatesImages/ajk.jpg")
    },
    "GB":{
        ImageName:require("../images/StatesImages/ajk.jpg")
    }
};
