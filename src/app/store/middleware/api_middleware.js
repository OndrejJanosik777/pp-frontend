import axios from "axios";
import * as apiActions from "../../features/api/apiSlice";
import * as dashboardActions from "../../features/dashboardSlice";

// async middleware function
// call backend api and dispatch data to store
const apiMiddleware = storeAPI => next => async action => {
    // console.log('API MIDDLEWARE');
    // console.log('action: ', action);

    let baseUrl = storeAPI.getState().api.baseUrl;

    // checking the type of action
    switch (action.type) {
      case "api/fetch_userProfile":
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
          storeAPI.dispatch(apiActions.update_userProfile({...response.data}));
        }
        catch(error) {
          console.log('error while fetching data...', error);
        }

        break;
      case "api/fetch_taskTypes":
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
          storeAPI.dispatch(apiActions.update_TaskTypes([...tasksTypes]));
        }
        catch(error) {
          console.log('error while fetching task types...', error);
        }
        break;
      case "api/fetch_milestoneTypes":
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
          storeAPI.dispatch(apiActions.update_milestoneTypes([...milestoneTypes]));
        }
        catch(error) {
          console.log('error while fetching task types...', error);
        }
        break;
      case "api/fetch_projects":
        try {
          const response = await axios.request({
            method: 'get',
              url: baseUrl + '/company/get-projects-for-dashboard/',
              headers: {
                  "Authorization": "Bearer " + localStorage.getItem('PP-token')
              }
          })
  
          let projects = [];

          // console.log('api_middleware: fetch_project: ', response.data);

          response.data.map((item) => {
              projects.push({...item, displayed: item.displayed_on_dashboard})
          })

          projects.sort((a, b) => {
              return parseInt(a.number.slice(-4)) - parseInt(b.number.slice(-4));
          })
  
          // dispatching action with payload to the store
          storeAPI.dispatch(apiActions.update_projects([...projects]));
          storeAPI.dispatch(dashboardActions.set_spinnerFetchingProjects(false));
        }
        catch(error) {
          console.log('error while fetching task types...', error);
        }
        break;
      case "api/fetch_Employees":
        try { 
          const response = await axios.request({
            method: 'get',
            url: baseUrl + '/company/employees/',
            headers: {
              "Authorization": "Bearer " + localStorage.getItem('PP-token')
            }
          })

          // console.log('api_middleware: fetch_employees: ', response.data);

          storeAPI.dispatch(apiActions.update_Employees([...response.data]))
        }
        catch(error) {
          console.log('error while fetching employees...', error);
        }
        break;
      default:
        next(action);
    }
}

export default apiMiddleware;