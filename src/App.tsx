import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import MainMenu from './components/mainmenu/MainMenu';
import Footer from './components/footer/Footer';
import { AuthProvider } from './store/auth/AuthContext';

// Páginas sin layout
import LoginPage from './pages/auth/LoginPage';
import AccessDeniedPage from './pages/auth/Accessdeniedpage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';

// Páginas con layout
import HomePage from './pages/home/HomePage';
import LinksOfInterestPage  from './pages/links-of-interest/LinksOfInterestPage';
import AboutSinergoxPage    from './pages/about-sinergox/AboutSinergoxPage';
import DictionaryPage       from './pages/dictionary/DictionaryPage';
import FaqPage              from './pages/faq/FaqPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Sin layout — pantalla completa */}
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/access-denied"  element={<AccessDeniedPage />} />
          <Route path="/auth/callback"  element={<AuthCallbackPage />} />

          {/* Con layout — header + mainmenu + footer */}
          <Route path="/*" element={
            <>
              <Header />
              <MainMenu />
              <Routes>
                <Route path="/"                    element={<HomePage />} />
                <Route path="/links-of-interest"   element={<LinksOfInterestPage />} />
                <Route path="/about-sinergox"      element={<AboutSinergoxPage />} />
                <Route path="/dictionary"          element={<DictionaryPage />} />
                <Route path="/faq"                 element={<FaqPage />} />
              </Routes>
              <Footer />
            </>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;