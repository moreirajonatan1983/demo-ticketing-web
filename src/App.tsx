import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import EventDetails from './pages/EventDetails';
import StadiumMap from './pages/StadiumMap';
import SeatSelection from './pages/SeatSelection';
import DeliverySelection from './pages/DeliverySelection';
import WaitingRoom from './pages/WaitingRoom';
import Checkout from './pages/Checkout';
import MyTickets from './pages/MyTickets';
import AuthGuard from './components/AuthGuard';
import Footer from './components/Footer';
import AuthCallback from './pages/AuthCallback';
import StaticInfoPage from './pages/StaticInfoPage';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Footer Categories */}
          <Route path="/categoria/proximos-eventos" element={<CategoryPage title="Próximos Eventos" />} />
          <Route path="/categoria/festivales" element={<CategoryPage title="Festivales" category="festival" />} />
          <Route path="/categoria/conciertos" element={<CategoryPage title="Conciertos" category="concierto" />} />
          <Route path="/categoria/teatro" element={<CategoryPage title="Obras de Teatro" category="teatro" />} />
          <Route path="/categoria/deportes" element={<CategoryPage title="Deportes" category="deporte" />} />

          {/* Footer Support Info */}
          <Route path="/soporte/ayuda" element={<StaticInfoPage title="Centro de Ayuda" />} />
          <Route path="/soporte/devoluciones" element={<StaticInfoPage title="Política de Devoluciones" />} />
          <Route path="/soporte/terminos" element={<StaticInfoPage title="Términos y Condiciones" />} />
          <Route path="/soporte/privacidad" element={<StaticInfoPage title="Políticas de Privacidad" />} />
          <Route path="/soporte/cookies" element={<StaticInfoPage title="Política de Cookies" />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/event/:id/date/:dateId/sectors" element={<StadiumMap />} />
          <Route path="/event/:id/date/:dateId/sector/:sectorId/block/:blockId/seats" element={<AuthGuard><SeatSelection /></AuthGuard>} />
          <Route path="/event/:id/delivery" element={<AuthGuard><DeliverySelection /></AuthGuard>} />
          <Route path="/event/:id/waiting-room" element={<AuthGuard><WaitingRoom /></AuthGuard>} />
          <Route path="/event/:id/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
          <Route path="/mytickets" element={<AuthGuard><MyTickets /></AuthGuard>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
