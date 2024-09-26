import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ImageDetails from './components/ImageDetails';
import './App.css';
import ImageBlurCheck from './components/ImageUploader';

function App() {
  return (
    
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ImageUploader/>} />
        <Route path="/image-details" element={<ImageDetails />} />

      </Routes>
    </Router>
    
  );
}

export default App;



