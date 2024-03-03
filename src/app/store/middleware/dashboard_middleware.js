import axios from "axios";
import * as dashboardActions from "../../features/dashboardSlice";

// async middleware function
// call backend api and dispatch data to store
const dashboardMiddleware = storeAPI => next => async action => {

    let baseUrl = storeAPI.getState().api.baseUrl;
    // let activeProjectId = storeAPI.getState().dashboard.activeProject.id;
    
    switch(action.type) {
        case "dashboard/fetch_documents":
            // console.log('inside dashboard/fetch_documents');

            try {
                const response = await axios.request({
                  method: 'get',
                    // url: baseUrl + `/company/get-documents-for-project-dashboard/?project_id=${activeProjectId}`,
                    url: baseUrl + `/company/get-documents-for-project-dashboard/?project_id=24`,
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem('PP-token')
                    }
                })
        
                // console.log('fetch succesfull ... ', response.data);
                // dispatching action:type fetchUserProfile_onSuccess with action:payload
                // response data ...
                storeAPI.dispatch(dashboardActions.update_documents([...response.data]));
            }
            catch(error) {
                console.log('error: Middleware => dashboard/fetch_documents', error);
                console.log('error while fetching data...', error);
            }
    
            break;
        default:
            next(action);
    }

}

export default dashboardMiddleware;