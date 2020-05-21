import Dashboard from '../views/User/UserDashboard/Dashboard';
import MyProfile from '../views/User/MyProfile/MyProfile';
import ChangePassword from '../views/User/MyProfile/ChangePassword';
import MyListings from '../views/User/MyListings/FoodTruckLists';
import ListingDetails from '../views/User/MyListings/FoodTruckDetails';
import EditFoodTruck from '../views/User/MyListings/EditFoodTruck';
import EnquiryLists from '../views/User/Enquiries/EnquiryLists';
import FoodTruckSubscription from '../views/User/FoodTruckSubscription/FoodTruckSubscription';
import ReviewLists from '../views/User/Reviews/ReviewLists';
import TransactionList from '../views/User/Transactions/TransactionLists';
import SubscriptionPaymentStatus from '../views/User/FoodTruckSubscription/SubscriptionPaymentStatus';
import intakeForm from '../views/User/ManageRequest/intakeForm';
import requestLists from '../views/User/ManageRequest/requestLists';


const userRoutes = [
  { path: '/user/', exact: true, name: 'Home' },
  { path: '/user/dashboard', exact: true, name: 'Dashboard', component: Dashboard },  
  { path: '/user/my-profile', exact: true,  name: 'Profile', component: MyProfile }, 
  { path: '/user/change-password', exact: true,  name: 'Change Password', component: ChangePassword },
  { path: '/user/my-listings', exact: true, name: 'My Listings', component: MyListings },
  { path: '/user/my-listings/:foodTruckId', exact: true, name: 'Edit Food Truck', component: EditFoodTruck },
  { path: '/user/listing-details', exact: true, name: 'My Listings', component: ListingDetails },
  { path: '/user/inquiries', exact:true, name:'Inquiry Lists', component: EnquiryLists},
  { path: '/user/reviews', exact:true, name:'Review Lists', component: ReviewLists},
  { path: '/user/reviews/:foodtruckId', exact:true, name:'Food Truck Review', component: ReviewLists},
  { path: '/user/subscription', exact: true,  name: 'Subscription', component: FoodTruckSubscription },
  { path: '/user/payment/:status', exact: true,  name: 'Payment Status', component: SubscriptionPaymentStatus },
  { path: '/user/transactions', exact:true, name:'Transaction Lists', component: TransactionList},
  { path: '/user/manage-request', exact:true, name:"Request List", component: requestLists},
  { path: '/user/intake-form', exact:true, name:'Intake Form', component:intakeForm }
];

export default userRoutes;
