import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import AddMovie from "./pages/AddMovie";
import ViewMovie from "./pages/ViewMovie";
import EditMovies from "./pages/EditMovies";
import AddShows from "./pages/AddShows";
import EditShow from "./pages/EditShow";
import SeatSelection from "./pages/SeatSelection";
import Booking from "./pages/Booking";
import Bookings from "./components/Bookings";
import BookingDetails from "./pages/BookingDetails";
import EditBooking from "./pages/EditBooking";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/addmovie" element={<AddMovie />} />
        <Route path="/movies/add" element={<AddMovie />} />
        <Route path="/movies/:id" element={<ViewMovie />} />
        <Route path="/movies/:id/edit" element={<EditMovies />} />
        <Route path="/shows/add" element={<AddShows />} />
        <Route path="/shows/:id/edit" element={<EditShow />} />
        <Route path="/shows/:id/seats" element={<SeatSelection />} />
        <Route path="/shows/:id/bookings" element={<Booking />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/bookings/:id/edit" element={<EditBooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;