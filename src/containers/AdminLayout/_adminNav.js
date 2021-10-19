export default {
  items: [
    {
      name: 'Dashboard',
      url: '/admin/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Clients',
      url: '/admin/organization',
      icon: 'icon-people',   
    },
    /*{
      name: 'VA Requests',
      url: '/admin/va-request', 
      icon: 'fa fa-list',
    },*/
    {
      name: 'Hire VA Request',
      url: '/admin/hire-va',
      icon:"fa fa-globe"
    },
    {
      name: 'Discovery Call',      
      icon: 'fa fa-calendar-o',
      url: '/admin/scheduled-booking',
    },
    {
      name: 'eBook Downloads',      
      icon: 'fa fa-book',
      url: '/admin/newsletter',
    },
    {
      name: 'Contact Inquiries',      
      icon: 'icon-envelope',
      url: '/admin/enquiries',
    },
    {
      name: 'VA Applications',      
      icon: 'fa fa-file-o',
      url: '/admin/va-application',
    },
    {
      name: 'VA Tasks',      
      icon: 'fa fa-tasks',
      url: '/admin/va-task',
    },
    {
      name: 'VA Timesheet',
      url: '/admin/timesheet',
      icon: 'fa fa-clock-o',
    },
    {
      name: 'Billing',
      url: '/admin/billing',
      icon: 'fa fa-credit-card',
    },
    {
      name: 'Payouts',
      icon: 'fa fa-paypal',
      children:[
        {
          name: 'VA Payouts',
          url: '/admin/va-payouts',
          icon: 'fa fa-list',  
        },
        {
          name: 'VA Transactions',
          url: '/admin/va-transactions',
          icon: 'fa fa-dollar',  
        }
       ]
    },
    {
      name: 'Transactions',
      url: '/admin/transactions',
      icon: 'fa fa-dollar',
    },
    {
      name: 'Admins',
      url: '/admin/users',
      icon: 'icon-user',   
    },
    {
      name: 'Manage Data',
      // url: '/admin/skills',
      icon: 'fas fa-database',  
       children:[
        {
          name: 'Manage Area',
          url: '/admin/manage-area',
          icon: 'fa fa-tasks',  
           
        },
        {
          name: 'Manage Skills',
          url: '/admin/manage-skill',
          icon: 'fa fa-cogs',  
           
        },
        {
      name: 'Area & Skills',
      url: '/admin/skills',
      icon: 'fa fa-list',  
        }

       ]
    },
    {
      name: 'Schedule Meeting',
      url: '/admin/schedule-meeting',
      icon: 'fa fa-meetup',   
    },
    
  ],
};
