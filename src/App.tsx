import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import MainMenu from './components/mainmenu/MainMenu';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import Footer from './components/footer/Footer';
import { AuthProvider } from './store/auth/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Sin layout — pantalla completa */}
          <Route path="/login" element={<LoginPage />} />

          {/* Con layout — header + mainmenu + footer */}
          <Route path="/*" element={
            <>
              <Header />
              <MainMenu />
              <Routes>
                <Route path="/" element={<HomePage />} />
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