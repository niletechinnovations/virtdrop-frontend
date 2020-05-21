import HomePage from '../views/Pages/Frontend/HomePage';
import AboutPage from '../views/Pages/Frontend/AboutPage';
import ContactPage from '../views/Pages/Frontend/ContactPage';
//import BlogPage from '../views/Pages/Frontend/BlogPage';
//import SingleBlogPage from '../views/Pages/Frontend/SingleBlogPage';
import LoginPage from '../views/Pages/Login/LoginPage';
import ResetPassword from '../views/Pages/Login/ResetPassword';
import RegisterPage from '../views/Pages/Register/RegisterPage';
import VerifyEmailPage from '../views/Pages/Login/VerifyEmailPage';
import PrivacyPolicyPage from '../views/Pages/Frontend/PrivacyPolicyPage';
import TermsConditionsPage from '../views/Pages/Frontend/TermsConditionsPage';
import FaqPage from '../views/Pages/Frontend/FAQ/FaqPage';
import SubscriptionPlan from '../views/Pages/Subscription/SubscriptionPlan';
import ProceedToPaymentPage from '../views/Pages/Subscription/ProceedToPaymentPage';
import HowItWorksPage from '../views/Pages/Frontend/HowItWorks/HowItWorksPage';
import WhyUsPage from '../views/Pages/Frontend/WhyUs/WhyUsPage';

const frontendRoutes = [
  { path: '/', exact: true, name: 'Home', component: HomePage },
  { path: '/home', name: 'Home', component: HomePage },  
  { path: '/about-us', exact: true,  name: 'About us', component: AboutPage },
  { path: '/contact-us', exact: true,  name: 'Contact us', component: ContactPage },
  { path: '/subscription-plan', exact: true,  name: 'Subscription Plan', component: SubscriptionPlan },
  { path: '/login', exact: true, name: 'Login', component: LoginPage },
  { path: '/register', exact: true,  name: 'Register', component: RegisterPage },
  { path: '/verify-email/:token', exact: true,  name: 'Verify Email', component: VerifyEmailPage },
  { path: '/reset-password/:token', exact: true,  name: 'Reset Password', component: ResetPassword },
  { path: '/privacy-policy', exact: true,  name: 'Privacy Policy', component: PrivacyPolicyPage },
  { path: '/terms-of-service', exact: true,  name: 'Terms of Service', component: TermsConditionsPage },
  { path: '/faq', exact: true,  name: 'Faq', component: FaqPage },
  { path: '/proceed-to-payment', exact: true,  name: 'ProceedToPayment', component: ProceedToPaymentPage },
  { path: '/how-it-works', exact: true,  name: 'WhyUs', component: HowItWorksPage },
  { path: '/why-us', exact: true,  name: 'WhyUs', component: WhyUsPage },
  
];

export default frontendRoutes;
