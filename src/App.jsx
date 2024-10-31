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
import TaskBar from './components/TaskBar/TaskBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
        <Router>
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route index path='/' element={<Home />} />
            <Route path='/launchToken' element={<LaunchTokens />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/comingSoon' element={<ComingSoon />} />
            <Route path='/howitworks' element={<HowItWorks />} />
            <Route path='/revealsBestPerformers' element={<RevealsBestPerformers />} />
            <Route path='/threads' element={<Threads />} />
          </Routes>
          <TaskBar />
        </Router>
    </>
  );
}

export default App;
