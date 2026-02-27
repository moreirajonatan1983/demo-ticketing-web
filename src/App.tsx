
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SectorSelection from './pages/SectorSelection';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import MyTickets from './pages/MyTickets';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event/:id" element={<SectorSelection />} />
          <Route path="/event/:id/sector/:sectorId/seats" element={<SeatSelection />} />
          <Route path="/event/:id/checkout" element={<Checkout />} />
          <Route path="/mytickets" element={<MyTickets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
