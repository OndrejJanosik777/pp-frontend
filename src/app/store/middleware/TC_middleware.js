// 

import axios from "axios";
import * as apiActions from "../../features/api/apiSlice";
import * as dashboardActions from "../../features/dashboardSlice";
import * as TCActions from '../../features/testCenterSlice';

// async middleware function
// call backend api and dispatch data to store
const TCMiddleware = storeAPI => next => async action => {
    // console.log('API MIDDLEWARE');
    // console.log('action: ', action);

    let baseUrl = storeAPI.getState().api.baseUrl;

    // checking the type of action
    switch (action.type) {
      case "testCenter/fetch_TCItems":
        try {
          const response = await axios.request({
            method: 'get',
              url: baseUrl + '/company/item-tc/',
              headers: {
                  "Authorization": "Bearer " + localStorage.getItem('PP-token')
              }
          })
  
          // console.log('fetch succesfull ... ', response.data);
          // dispatching action:type fetchUserProfile_onSuccess with action:payload
          // response data ...
          storeAPI.dispatch(TCActions.set_TCItems([...response.data]));
        }
        catch(error) {
          console.log('error while fetching data...', error);
        }

        break;
      default:
        next(action);
    }
}

export default TCMiddleware;