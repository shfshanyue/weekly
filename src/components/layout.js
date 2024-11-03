import * as React from "react"
import { Link } from "gatsby"
import Search from "./search"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          {/* Logo/Title */}
          <div className="py-4">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-300 transition-all"
            >
              {title}
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-1">
            <div className="flex items-center space-x-1">
              <NavLink to="/">首页</NavLink>
              <NavLink to="/week/">周刊</NavLink>
              <NavLink to="/tool/">开发利器</NavLink>
              <NavLink to="/package/">有趣的库</NavLink>
              <NavLink to="/release/">版本历史</NavLink>
            </div>
            
            {/* Search */}
            <div className="w-full md:w-64">
              <Search />
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          Created by{" "}
          <a 
            href="https://shanyue.tech" 
            target="_blank"
            className="text-blue-600 hover:text-blue-800 transition"
          >
            @shanyue
          </a>
        </div>
      </footer>
    </div>
  )
}

// Add NavLink component for consistent navigation styling
const NavLink = ({ to, children }) => {
  const isActive = typeof window !== 'undefined' && window.location.pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  )
}

export default Layout
