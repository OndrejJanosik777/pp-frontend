import axios from "axios";
import { fetchUserProfile, fetchUserProfile_onSuccess } from "../../features/auth/authSlice";

// async middleware function
const apiMiddleware = storeAPI => next => async action => {
    console.log('API MIDDLEWARE');
    console.log('action: ', action);

    // checking the type of action
    if (action.type == "auth/fetchUserProfile") {
      console.log('fetching user data ... ');
      try {
        const response = await axios.request({
          method: 'get',
            url: 'http://127.0.0.1:8000/company/my-profile/',
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