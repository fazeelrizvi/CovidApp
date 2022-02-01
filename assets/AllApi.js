let StatsAPI = 'http://103.24.99.91:8085/api/CovidApp/GetStatesDetails';
let SignUpOrEdit = 'http://103.24.99.91:8085/api/CovidApp/SignupOrEditUser';
let GetCountries = 'http://103.24.99.91:8085/api/CovidApp/GetCountries';
let GetNews = 'http://103.24.99.91:8085/api/CovidApp/GetNews';
let Login = 'http://103.24.99.91:8085/api/CovidApp/Login';
let AddUserToFamily = 'http://103.24.99.91:8085/api/CovidApp/AddUserToFamily';
let TrackNearestUsers = 'http://103.24.99.91:8085/api/CovidApp/TrackNearestUsers';
let UpdateCovidStatus = 'http://103.24.99.91:8085/api/CovidApp/UpdateCovidStatus';
let GetCovidRelatedVideos = 'http://103.24.99.91:8085/api/CovidApp/GetCovidRelatedVideos';
let GetUserProfile = 'http://103.24.99.91:8085/api/CovidApp/GetUserProfile';
let UserCountryVise = 'http://103.24.99.91:8085/api/CovidApp/GetUsersWithLocationAndCategory';

const encodeFormData = (data) => {
  return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
}


export {
          StatsAPI, 
          SignUpOrEdit,
          GetCountries,
          GetNews,
          Login,
          AddUserToFamily,
          TrackNearestUsers,
          UpdateCovidStatus,
          GetCovidRelatedVideos,
          encodeFormData,
          GetUserProfile,
          UserCountryVise
        };