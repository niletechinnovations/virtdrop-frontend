import Dashboard from '../views/AdminDashboard/Dashboard/Dashboard';
import CuisineList from '../views/AdminDashboard/Category/Category';
import organizationList from '../views/AdminDashboard/Organization/Organization';
import UsersList from '../views/AdminDashboard/Users/Users'
import UserDetails from '../views/AdminDashboard/Users/User';
import foodTruckList from '../views/AdminDashboard/Organization/FoodTruck/FoodTruckListing';
import EditFoodTruck from '../views/AdminDashboard/Organization/FoodTruck/EditFoodTruckList';
import OrgFoodTruckList from '../views/AdminDashboard/Organization/FoodTruck/FoodTruckListing';
import EnquiryListing from '../views/AdminDashboard/Organization/Enquiry/EnquiryListing';
import AdvertiserPlans from '../views/AdminDashboard/Subscription/AdvertiserSubscription';
import FoodTruckSubscription from '../views/AdminDashboard/Subscription/FoodTruckSubscription';
import ChangePassword from '../views/AdminDashboard/ChangePassword/ChangePassword';
import FoodTruckReviewList from '../views/AdminDashboard/Organization/FoodTruckReviews/FoodTruckReviewList';
import AdvertiserList from '../views/AdminDashboard/Advertisers/AdvertiserList';
import AdvertisementList from '../views/AdminDashboard/Advertisers/Advertisement/AdvertisementList';
import UserTransactionList from '../views/AdminDashboard/UserTransactions/UserTransactionList';
import SubscribedAdvertiserList from '../views/AdminDashboard/SubscribedUsers/SubscribedAdvertiserList';
import SubscribedOwnerList from '../views/AdminDashboard/SubscribedUsers/SubscribedOwnerList';

const adminRoutes = [
  { path: '/admin/', exact: true, name: 'Admin' },
  { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Dashboard },  
  { path: '/admin/cuisine', exact: true, name: 'Manage Cuisine', component: CuisineList },
  { path: '/admin/organization', exact: true, name: 'Manage Truck Owner', component: organizationList },
  { path: '/admin/users', exact: true, name: 'Manage Users', component: UsersList },
  { path: '/admin/user/:profileId', exact: true,  name: 'User Details', component: UserDetails },
  { path: '/admin/organization/truck-listing', exact: true, name: 'Manage Food Truck', component: foodTruckList },
  { path: '/admin/organization/truck-listing/:organizationId', exact: true, name: 'Organization Food Truck Listings', component: OrgFoodTruckList },
  { path: '/admin/organization/edit-truck/:foodTruckId', exact: true,  name: 'Edit Food Truck', component: EditFoodTruck },
  { path: '/admin/enquiries', exact: true, name: 'Manage Enquiries', component: EnquiryListing },
  { path: '/admin/reviews', exact: true, name: 'Manage Reviews', component: FoodTruckReviewList },
  { path: '/admin/reviews/:foodtruckId', exact: true, name: 'Food Truck Reviews', component: FoodTruckReviewList },
  { path: '/admin/subscription', exact: true, name: 'Manage Advertiser Subscription', component: AdvertiserPlans },
  { path: '/admin/subscription/food-truck', exact: true, name: 'Manage Food Truck Subscription', component: FoodTruckSubscription },
  { path: '/admin/change-password', exact: true,  name: 'Change Password', component: ChangePassword },
  { path: '/admin/advertisers', exact: true, name: 'Manage Advertisers', component: AdvertiserList },
  { path: '/admin/advertisement', exact: true, name: 'Manage Advertisement', component: AdvertisementList },
  { path: '/admin/transactions', exact: true, name: 'Manage Transactions', component: UserTransactionList },
  { path: '/admin/subscribed', exact: true, name: 'Subscribed Owner', component: SubscribedOwnerList },
  { path: '/admin/subscribed/advertisers', exact: true, name: 'Subscribed Advertiser', component: SubscribedAdvertiserList },
];

export default adminRoutes;
