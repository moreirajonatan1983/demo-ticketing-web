
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import StadiumMap from './pages/StadiumMap';
import DeliverySelection from './pages/DeliverySelection';
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
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/event/:id/date/:dateId/sectors" element={<StadiumMap />} />
          <Route path="/event/:id/date/:dateId/sector/:sectorId/block/:blockId/seats" element={<DeliverySelection />} />
          <Route path="/event/:id/checkout" element={<Checkout />} />
          <Route path="/mytickets" element={<MyTickets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
