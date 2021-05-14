//import TemplatePreview from './views/Pages/Frontend/TemplatePreview';
//import StartInspection from './views/Pages/Frontend/StartInspection';

import HireVaPage from "../views/Pages/Frontend/HireVaLink/HireVaPage";
import ThanksToYouPage from '../views/Pages/Frontend/HireVaLink/ThanksToYouPage';

const commonRoutes = [
  // { path: '/common/template/:templateId', exact: true, name: 'Template Preview', component: TemplatePreview },
  // { path: '/common/inspection/:inspectionId', exact: true, name: 'Inspection', component: StartInspection },
  { path: '/common/va-hire-link', exact: true, name: 'Hire VA', component: HireVaPage },
  { path: '/common/thanks-to-you', exact: true, name: 'Thank You!', component: ThanksToYouPage},
];

export default commonRoutes;
