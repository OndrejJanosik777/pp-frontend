import axios from "axios";
import { fetchUserProfile, fetchUserProfile_onSuccess } from "../../features/api/apiSlice";

// async middleware function
const apiMiddleware = storeAPI => next => async action => {
    console.log('API MIDDLEWARE');
    console.log('action: ', action);

    // checking the type of action
    if (action.type == "api/fetchUserProfile") {
      console.log('fetching user data ... ');
      console.log('storeAPI: ', storeAPI.getState());

      let baseUrl = storeAPI.getState().api.baseUrl;

      console.log('baseUrl: ', baseUrl);

      try {
        const response = await axios.request({
          method: 'get',
            url: baseUrl + '/company/my-profile/',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('PP-token')
            }
        })

        console.log('fetch succesfull ... ', response.data);

        storeAPI.dispatch(fetchUserProfile_onSuccess({...response.data}));
      }
      catch(error) {
        console.log('error while fetching data...', error);
      }
    }
    else {
      // this middleware is consuming "fetchUserProfile" action
      next(action);
    }
}

export default apiMiddleware;