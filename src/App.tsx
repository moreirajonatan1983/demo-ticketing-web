
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
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
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/mytickets" element={<MyTickets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
