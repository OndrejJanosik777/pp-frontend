// 

import axios from "axios";
import * as apiActions from "../../features/api/apiSlice";
import * as dashboardActions from "../../features/dashboardSlice";
import * as TCActions from '../../features/testCenterSlice';
import * as DocumentsActions from '../../features/documentsSlice';

// async middleware function
// call backend api and dispatch data to store
const DocumentsMiddleware = storeAPI => next => async action => {
    // console.log('DocumentsMiddleware.js');
    // console.log('action: ', action);

    let baseUrl = storeAPI.getState().api.baseUrl;

    // checking the type of action
    switch (action.type) {
      case "documents/fetch_Documents":
        try {
          const response = await axios.request({
            method: 'get',
              url: baseUrl + '/company/get-documents-for-project-dashboard/',
              headers: {
                  "Authorization": "Bearer " + localStorage.getItem('PP-token')
              }
          })
  
          console.log('fetch succesfull ... ', response.data);
          // dispatching action:type fetchUserProfile_onSuccess with action:payload
          // response data ...
          storeAPI.dispatch(DocumentsActions.set_Documents([...response.data]));
        }
        catch(error) {
          console.log('error while fetching data...', error);
        }

        break;
      default:
        next(action);
    }
}

export default DocumentsMiddleware;