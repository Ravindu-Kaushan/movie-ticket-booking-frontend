# CineBook - Movie Ticket Booking System (Frontend)

A responsive React + TypeScript frontend for the Movie Ticket Booking System. Customers can browse movies, theatres and shows, select seats, book tickets and pay. Admins can manage movies, theatres, shows, bookings, users and view payments.



Backend repository: https://github.com/rkaushan/movie-ticket-booking-backend

## Tech Stack

- React 19 with TypeScript
- Vite
- React Router (react-router-dom 7)
- Axios
- Tailwind CSS 4
- Context API for authentication state

## Features

### Public
- View movies with search by title and filter by status and language
- View theatres
- View shows with filters by movie, theatre and date
- Sign Up and Sign In with form validation

### Customer
- Select seats on a seat grid (booked seats are shown in red)
- See selected seats, number of tickets and total amount
- Book tickets
- View booking history and cancel bookings
- Pay for a booking (payment success and failure simulation)

### Admin
- Manage movies, theatres and shows (create, edit, delete)
- View all bookings, filter them and update booking status
- Manage users (edit and delete)
- View all payments with a status filter

### General
- JWT authentication, token stored in localStorage and added to every request by an Axios interceptor
- Role-based navigation and protected routes
- Loading and error handling on every page
- Responsive design with a mobile menu

## Project Structure

```
src/
  api/          axiosInstance.ts (base URL and token interceptor)
  components/   Navbar.tsx, ProtectedRoute.tsx
  context/      AuthContext.tsx (user, login, logout)
  pages/        SignIn, SignUp, Movies, Theatres, Shows, BookShow, MyBookings, Payment
  pages/admin/  ManageMovies, ManageTheatres, ManageShows, AllBookings, Users, Payments
  types/        index.ts (TypeScript types)
  App.tsx       routes
  main.tsx      entry point
```

## Pages and Routes

| Route | Page | Access |
|-------|------|--------|
| /signin | Sign In | Public |
| /signup | Sign Up | Public |
| /movies | Movies | Public |
| /theatres | Theatres | Public |
| /shows | Shows | Public |
| /shows/:id/book | Book Show (seat selection) | Customer |
| /my-bookings | My Bookings | Customer |
| /payment/:bookingId | Payment | Customer |
| /admin/movies | Manage Movies | Admin |
| /admin/theatres | Manage Theatres | Admin |
| /admin/shows | Manage Shows | Admin |
| /admin/bookings | All Bookings | Admin |
| /admin/users | Users | Admin |
| /admin/payments | Payments | Admin |

## How to Run

### Prerequisites
- Node.js and npm
- The backend running at http://localhost:8080 (see the backend repository)

### Steps

1. Clone the repository
```
   git clone https://github.com/rkaushan/movie-ticket-booking-frontend.git
   cd movie-ticket-booking-frontend
```
2. Install dependencies
```
   npm install
```
3. Start the development server
```
   npm run dev
```
4. Open http://localhost:5173 in the browser

The backend URL is set in `src/api/axiosInstance.ts` (`http://localhost:8080`).

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | 123456 |
| Customer | nimal@gmail.com | 123456 |

## Future Enhancements

### 1. Interactive theatre screen and seat layout
The seat grid can be replaced with a real theatre layout that shows the screen, aisles and different seat types (standard, premium). This gives customers a clearer picture of where they will sit and makes seat selection easier and more realistic. It can also support multiple screens in one theatre.

### 2. Movie reviews and ratings
Customers who have watched a movie could rate it and write a short review, and the movie cards would show an average rating. This helps other customers choose what to watch and increases engagement with the system. It needs a new Review entity in the backend linked to User and Movie.