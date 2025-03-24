import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar';
import Test from './components/test';
import Home from './Pages/Home';
import LaunchTokens from './Pages/LaunchTokens';
import Profile from './Pages/Profile';
import ComingSoon from './Pages/ComingSoon';
import HowItWorks from './Pages/HowItWorks';
import RevealsBestPerformers from './Pages/RevealsBestPerformers';
import UserProfile from './Pages/UserProfile';
import Threads from './Pages/Threads';
import TaskBar from './components/TaskBar/TaskBar';
import Footer from './components/Footer';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsOfService from './Pages/TermsOfService';
import LaunchTokenSolana from './Pages/LaunchTokenSolana';
import CookieConsent from './components/Modals/CookieConsent';
import ViewUserProfile from './Pages/ViewUserProfile';

const customToastStyle = {
  backgroundColor: '#161A25',
  color: '#fff', // Black text color
  backdropFilter: 'blur(4px)', // Blur for frosted glass effect
  border: '1px solid rgba(255, 255, 255, 0.2)', // Optional: subtle white border
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional: shadow for depth
};

function App() {
  const block = localStorage.getItem('blockchain')

  return (
    <>
      <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Slide}
      theme="dark"
      toastStyle={customToastStyle}
    />
        <Navbar />
        <CookieConsent/>
        <Routes>
          <Route index path='/' element={<Home />} />
          <Route index path='/Test' element={<Test />} />
          <Route path='/launchToken' element={block ==='SOL'?<LaunchTokenSolana />:<LaunchTokens />} />
          <Route path='/editprofile/:link?' element={<Profile />} />
          <Route path='/profile/:id' element={<UserProfile />} />
          <Route path='/userprofile/:id' element={<ViewUserProfile />} />
          <Route path='/comingSoon' element={<ComingSoon />} />
          <Route path='/howitworks' element={<HowItWorks />} />
          <Route path='/revealsBestPerformers' element={<RevealsBestPerformers />} />
          <Route path='/trade/:id/:tokenid' element={<Threads />} />
          <Route path='/docs/privacy-policy' element={<PrivacyPolicy/>} />
          <Route path='/docs/terms-and-conditions' element={<TermsOfService/>} />
        </Routes>
        <Footer />
        <TaskBar />
    </>
  );
}

export default App;