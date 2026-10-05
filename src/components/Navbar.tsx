import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/signin')
  }

  const linkClass = 'block px-3 py-2 hover:text-yellow-300'

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/movies" className="text-xl font-bold text-yellow-400">
          CineBook
        </Link>

        <button
          className="md:hidden border px-3 py-1 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu
        </button>

        <div
          className={`${menuOpen ? 'block' : 'hidden'} absolute top-14 left-0 right-0 bg-gray-900 px-4 pb-3 md:static md:flex md:items-center md:p-0`}
        >
          <Link to="/movies" className={linkClass} onClick={() => setMenuOpen(false)}>
            Movies
          </Link>
          <Link to="/theatres" className={linkClass} onClick={() => setMenuOpen(false)}>
            Theatres
          </Link>
          <Link to="/shows" className={linkClass} onClick={() => setMenuOpen(false)}>
            Shows
          </Link>

          {user && user.role === 'CUSTOMER' && (
            <Link to="/my-bookings" className={linkClass} onClick={() => setMenuOpen(false)}>
              My Bookings
            </Link>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <Link to="/admin/movies" className={linkClass} onClick={() => setMenuOpen(false)}>
                Manage Movies
              </Link>
              <Link to="/admin/theatres" className={linkClass} onClick={() => setMenuOpen(false)}>
                Manage Theatres
              </Link>
              <Link to="/admin/shows" className={linkClass} onClick={() => setMenuOpen(false)}>
                Manage Shows
              </Link>
              <Link to="/admin/bookings" className={linkClass} onClick={() => setMenuOpen(false)}>
                All Bookings
              </Link>
              <Link to="/admin/users" className={linkClass} onClick={() => setMenuOpen(false)}>
                Users
              </Link>
              <Link to="/admin/payments" className={linkClass} onClick={() => setMenuOpen(false)}>
                Payments
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/signin" className={linkClass} onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/signup" className={linkClass} onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <div className="md:flex md:items-center md:ml-4">
              <span className="block px-3 py-2 text-sm text-gray-300">
                {user.fullName} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar