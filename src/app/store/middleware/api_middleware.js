import axios from "axios";
import { 
  fetchUserProfile_onSuccess,
  fetchTaskTypes_onSuccess,
  fetchMilestoneTypes_onSuccess
} from "../../features/api/apiSlice";

// async middleware function
const apiMiddleware = storeAPI => next => async action => {
    console.log('API MIDDLEWARE');
    console.log('action: ', action);

    // checking the type of action
    if (action.type == "api/fetchUserProfile") {
      // console.log('fetching user data ... ');
      // console.log('storeAPI: ', storeAPI.getState());

      let baseUrl = storeAPI.getState().api.baseUrl;

      // console.log('baseUrl: ', baseUrl);

      try {
        const response = await axios.request({
          method: 'get',
            url: baseUrl + '/company/my-profile/',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('PP-token')
            }
        })

        // console.log('fetch succesfull ... ', response.data);
        // dispatching action:type fetchUserProfile_onSuccess with action:payload
        // response data ...
        storeAPI.dispatch(fetchUserProfile_onSuccess({...response.data}));
      }
      catch(error) {
        console.log('error while fetching data...', error);
      }
    }
    else if (action.type == "api/fetch_taskTypes") {
      // console.log('fetching TaskTypes');

      let baseUrl = storeAPI.getState().api.baseUrl;

      try {
        const response = await axios.request({
          method: 'get',
            url: baseUrl + '/company/task-types/',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('PP-token')
            }
        })

        let tasksTypes = response.data;

        tasksTypes.sort((a, b) => a.id - b.id);

        // dispatching action with payload to the store
        storeAPI.dispatch(fetchTaskTypes_onSuccess([...tasksTypes]));
      }
      catch(error) {
        console.log('error while fetching task types...', error);
      }

      // next(action);
    }
    else if (action.type == "api/fetch_milestoneTypes") {
      console.log('fetching MilestoneTypes');

      let baseUrl = storeAPI.getState().api.baseUrl;

      try {
        const response = await axios.request({
          method: 'get',
            url: baseUrl + '/company/milestone-item-types/',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('PP-token')
            }
        })

        let milestoneTypes = response.data;

        milestoneTypes.sort((a, b) => a.id - b.id);

        // dispatching action with payload to the store
        storeAPI.dispatch(fetchMilestoneTypes_onSuccess([...milestoneTypes]));
      }
      catch(error) {
        console.log('error while fetching task types...', error);
      }

      // next(action);
    }
    else {
      // this middleware is consuming "fetchUserProfile" action
      next(action);
    }
}

export default apiMiddleware;