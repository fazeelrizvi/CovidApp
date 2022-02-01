geolocation = require('@react-native-community/geolocation');
const BGIos = (callback) =>{
    geolocation.getCurrentPosition(
    (info)=> { 
    var latitude = info.coords.latitude;
    var longitude = info.coords.longitude;

    var coords = { coords: {latitude, longitude}};
    return callback(coords);
    },
    (error) => {
    console.log(error)
    },
    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    ); 
}

export default BGIos;
