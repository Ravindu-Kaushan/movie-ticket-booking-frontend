import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Movies from "./pages/Movies";
import Theatres from "./pages/Theatres";
import Shows from "./pages/Shows";
import BookShow from "./pages/BookShow";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import ManageMovies from "./pages/admin/ManageMovies";
import ManageTheatres from "./pages/admin/ManageTheatres";
import ManageShows from "./pages/admin/ManageShows";
import AllBookings from "./pages/admin/AllBookings";
import Users from "./pages/admin/Users";
import Payments from "./pages/admin/Payments";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/shows/:id/book" element={<BookShow />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="CUSTOMER">
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute role="CUSTOMER">
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute role="ADMIN">
              <ManageMovies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/theatres"
          element={
            <ProtectedRoute role="ADMIN">
              <ManageTheatres />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shows"
          element={
            <ProtectedRoute role="ADMIN">
              <ManageShows />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute role="ADMIN">
              <AllBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute role="ADMIN">
              <Payments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;