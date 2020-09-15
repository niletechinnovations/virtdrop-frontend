import Dashboard from '../views/AdminDashboard/Dashboard/Dashboard';
import organizationList from '../views/AdminDashboard/Organization/Organization';
import UsersList from '../views/AdminDashboard/Users/Users'
import UserDetails from '../views/AdminDashboard/Users/User';
import EnquiryListing from '../views/AdminDashboard/Organization/Enquiry/EnquiryListing';
import AdvertiserPlans from '../views/AdminDashboard/Subscription/AdvertiserSubscription';
import ChangePassword from '../views/AdminDashboard/ChangePassword/ChangePassword';
import UserTransactionList from '../views/AdminDashboard/UserTransactions/UserTransactionList';
import SubscribedAdvertiserList from '../views/AdminDashboard/SubscribedUsers/SubscribedAdvertiserList';
import SubscribedOwnerList from '../views/AdminDashboard/SubscribedUsers/SubscribedOwnerList';
import ApplicationList from '../views/AdminDashboard/VaApplications/ApplicationLists.';
import EditVaApplication from '../views/AdminDashboard/VaApplications/EditVaApplication';
import VaRequestListing from '../views/AdminDashboard/Organization/VaRequest/VaRequestListing';
import ScheduledBooking from '../views/AdminDashboard/ScheduledBooking/ScheduledBooking';
import AssignRequest from '../views/AdminDashboard/Organization/VaRequest/AssignRequest';
import VaTaskListing from '../views/AdminDashboard/Organization/VaTask/VaTaskListing';
import SubscribersList from '../views/AdminDashboard/NewsletterSubscriber/NewsletterSubscribersList';
import VaTimesheetList from '../views/AdminDashboard/Organization/VaTimesheet/VaTimesheetList';
import BillingList from '../views/AdminDashboard/Organization/Billing/BillingList';
import AddVaApplication from '../views/AdminDashboard/VaApplications/AddVaApplication';

const adminRoutes = [
  { path: '/admin/', exact: true, name: 'Admin' },
  { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: Dashboard },  
  { path: '/admin/organization', exact: true, name: 'Manage Clients', component: organizationList },
  { path: '/admin/users', exact: true, name: 'Manage Admin Users', component: UsersList },
  { path: '/admin/user/:profileId', exact: true,  name: 'User Details', component: UserDetails },
  { path: '/admin/va-application', exact: true, name: 'Manage VA Application', component: ApplicationList },
  { path: '/admin/va-application/add-new-va', exact: true, name: 'Add New VA Application', component: AddVaApplication },
  { path: '/admin/va-application/:vaApplicationId', exact: true, name: 'VA Application Details', component: EditVaApplication },
  { path: '/admin/va-request', exact: true, name: 'Manage Request', component: VaRequestListing },
  { path: '/admin/va-request/assign-va/:vaRequestId', exact: true, name: 'Assign VA Request', component: AssignRequest },
  { path: '/admin/enquiries', exact: true, name: 'Manage Enquiries', component: EnquiryListing },
  { path: '/admin/scheduled-booking', exact: true, name: 'Manage Discovery Call', component: ScheduledBooking },
  { path: '/admin/subscription', exact: true, name: 'Manage Advertiser Subscription', component: AdvertiserPlans },
  { path: '/admin/change-password', exact: true,  name: 'Change Password', component: ChangePassword },
  { path: '/admin/transactions', exact: true, name: 'Manage Transactions', component: UserTransactionList },
  { path: '/admin/subscribed', exact: true, name: 'Subscribed Owner', component: SubscribedOwnerList },
  { path: '/admin/subscribed/advertisers', exact: true, name: 'Subscribed Advertiser', component: SubscribedAdvertiserList },
  { path: '/admin/va-task', exact: true, name: 'Manage Task', component: VaTaskListing },
  { path: '/admin/timesheet', exact: true, name: 'Manage Timesheet', component: VaTimesheetList },
  { path: '/admin/newsletter', exact: true, name: 'eBook Downloads', component: SubscribersList },
  { path: '/admin/billing', exact: true, name: 'Clients Billing', component: BillingList },


];

export default adminRoutes;
