import React from 'react'
import {LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  
  ]


  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 group ${
      isHomePage 
        ? 'glass-effect shadow-lg border-b border-gray-200/50 hover:bg-white/0 hover:backdrop-blur-none hover:shadow-none hover:border-transparent' 
        : 'glass-effect shadow-lg border-b border-gray-200/50 bg-white/95 backdrop-blur-lg'
    }`}>
      <div className='w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
        <nav className='flex items-center justify-between py-4'>
          {/* Home Link */}
          <div className='flex items-center'>
            <Link to='/' className='text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity'>
              Blog
              </Link>
          </div>

          {/* Navigation Items */}
          <div className='hidden md:flex items-center space-x-2'>
            {navItems.map((item) => 
            item.active ? (
                <button
                  key={item.name}
                onClick={() => navigate(item.slug)}
                  className={`relative px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isHomePage 
                      ? 'text-gray-700 group-hover:text-gray-800 hover:bg-purple-500/10 hover:text-purple-600' 
                      : 'text-gray-700 hover:bg-purple-500/10 hover:text-purple-600'
                  } ${location.pathname === item.slug ? 'text-purple-600 bg-purple-50' : ''}`}
                >
                  {item.name}
                  {location.pathname === item.slug && (
                    <span className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full' />
                  )}
                </button>
            ) : null
            )}
          </div>

          {/* Auth Section */}
          <div className='flex items-center gap-3'>
            {authStatus && (
                <LogoutBtn />
            )}
            {/* Mobile Menu Button */}
            <button className='md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header