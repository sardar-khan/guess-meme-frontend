import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Renamed BrowserRouter to Router
import './App.css';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import LaunchTokens from './Pages/LaunchTokens';
import Profile from './Pages/Profile';
import ComingSoon from './Pages/ComingSoon';
import HowItWorks from './Pages/HowItWorks';
import RevealsBestPerformers from './Pages/RevealsBestPerformers';
import Threads from './Pages/Threads';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route index path='/' element={<Home />} />
          <Route path='/launchToken' element={<LaunchTokens />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/comingSoon' element={<ComingSoon />} />
          <Route path='/howitworks' element={<HowItWorks />} />
          <Route path='/howitworks' element={<HowItWorks />} />
          <Route path='/revealsBestPerformers' element={<RevealsBestPerformers />} />
          <Route path='/Threads' element={<Threads />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
