import Dashboard from '../views/User/UserDashboard/Dashboard';
import MyProfile from '../views/User/MyProfile/MyProfile';
import ChangePassword from '../views/User/MyProfile/ChangePassword';
import ListingDetails from '../views/User/MyListings/FoodTruckDetails';
import EnquiryLists from '../views/User/Enquiries/EnquiryLists';
import TransactionList from '../views/User/Transactions/TransactionLists';
import intakeForm from '../views/User/ManageRequest/intakeForm';
import requestLists from '../views/User/ManageRequest/requestLists';
import VaLists from '../views/User/ManageRequest/vaLists';
import taskList from '../views/User/TaskList/taskList';
import VaDashboard from '../views/VA/VaDashboard/VaDashboard';
import VaTaskData from '../views/VA/VaTask/VaTaskData';
import VaProfile from '../views/VA/VaProfile/VaProfile';
import timesheetList from '../views/VA/TimeSheet/timesheetList';

const userRoutes = [
  { path: '/user/', exact: true, name: 'Home' },
  { path: '/user/dashboard', exact: true, name: 'Dashboard', component: Dashboard },  
  { path: '/user/my-profile', exact: true,  name: 'Profile', component: MyProfile }, 
  { path: '/user/change-password', exact: true,  name: 'Change Password', component: ChangePassword },
  { path: '/user/listing-details', exact: true, name: 'My Listings', component: ListingDetails },
  { path: '/user/inquiries', exact:true, name:'Inquiry Lists', component: EnquiryLists},
  { path: '/user/transactions', exact:true, name:'Transaction Lists', component: TransactionList},
  { path: '/user/manage-request', exact:true, name:"Request List", component: requestLists},
  { path: '/user/intake-form', exact:true, name:'Intake Form', component:intakeForm },
  { path: '/user/virdrop-va', exact:true, name:'VirDrop VA', component:VaLists },
  { path: '/user/task', exact:true, name: 'VA Task', component: taskList},
  { path: '/user/task/:vaAuthId', exact: true,  name: 'VA Task Details', component: taskList },
  { path: '/user/va-dashboard', exact: true, name: 'VA Dashboard', component: VaDashboard },  
  { path: '/user/va-task', exact: true, name: 'VA Task List', component: VaTaskData },  
  { path: '/user/va-profile', exact: true,  name: 'Profile', component: VaProfile }, 
  { path: '/user/va-timesheet', exact: true, name: 'VA Timesheet List', component: timesheetList },  
  
];

export default userRoutes;
