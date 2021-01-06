import Dashboard from '../views/User/UserDashboard/Dashboard';
import MyProfile from '../views/User/MyProfile/MyProfile';
import ChangePassword from '../views/User/MyProfile/ChangePassword';
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
import clientBillingList from '../views/User/Billing/clientBillingList';
import billingPaymentStatus from '../views/User/Billing/billingPaymentStatus';
import MyCard from '../views/User/MyProfile/MyCard';
import TransactionDetails from '../views/User/Transactions/TransactionDetails';
import timeSheet from '../views/User/UserTimeSheet/timeSheet'


const userRoutes = [
  { path: '/user/', exact: true, name: 'Home' },
  { path: '/user/dashboard', exact: true, name: 'Dashboard', component: Dashboard },  
  { path: '/user/my-profile', exact: true,  name: 'Profile', component: MyProfile }, 
  { path: '/user/change-password', exact: true,  name: 'Change Password', component: ChangePassword },
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
  { path: '/user/billing', exact: true, name: "Billing", component: clientBillingList},
  { path: '/user/payment/:status', exact: true,  name: 'Payment Status', component: billingPaymentStatus },
  { path: '/user/transactions', exact:true, name:'Transaction Lists', component: TransactionList},
  { path: '/user/my-card', exact:true, name:'My Card', component: MyCard},
  { path: '/user/transaction/:transactionId', exact:true, name:'Transaction Details', component: TransactionDetails},
  { path:'/user/timesheet', exact: true, name: "timeSheet", component: timeSheet}
  
];

export default userRoutes;
