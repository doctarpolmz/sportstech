import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to ARIP',
      dashboard: 'Dashboard',
      creditScore: 'Credit Score',
      loanApplication: 'Loan Application',
      insurance: 'Insurance',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      farmerPortal: 'Farmer Portal',
      fspPortal: 'FSP Portal',
      adminPortal: 'Admin Portal'
    }
  },
  lg: {
    translation: {
      welcome: 'Tukusanyukidde ku ARIP',
      dashboard: 'Dashboard',
      creditScore: 'Credit Score',
      loanApplication: 'Saba Loan',
      insurance: 'Insurance',
      profile: 'Profile',
      logout: 'Fuluma',
      login: 'Yingira',
      email: 'Email',
      password: 'Password',
      farmerPortal: 'Omulimi Portal',
      fspPortal: 'FSP Portal',
      adminPortal: 'Admin Portal'
    }
  },
  rn: {
    translation: {
      welcome: 'Tukusiimye ARIP',
      dashboard: 'Dashboard',
      creditScore: 'Credit Score',
      loanApplication: 'Saba Loan',
      insurance: 'Insurance',
      profile: 'Profile',
      logout: 'Sohoka',
      login: 'Injira',
      email: 'Email',
      password: 'Password',
      farmerPortal: 'Omurimyi Portal',
      fspPortal: 'FSP Portal',
      adminPortal: 'Admin Portal'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
