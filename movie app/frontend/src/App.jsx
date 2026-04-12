import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Details from './pages/Details';
import Admin from './pages/Admin';
import EditMovie from './pages/EditMovie';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/edit/:id" element={<EditMovie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;