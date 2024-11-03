import * as React from "react"
import { Link } from "gatsby"
import Search from "./search"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          {/* Logo/Title */}
          <div className="mb-6">
            <Link to="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition">
              {title}
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-between">
            <div className="flex space-x-6">
              <Link className="nav-link" to="/">首页</Link>
              <Link className="nav-link" to="/week/">周刊</Link>
              <Link className="nav-link" to="/tool/">开发利器</Link>
              <Link className="nav-link" to="/package/">有趣的库</Link>
              <Link className="nav-link" to="/release/">版本历史</Link>
            </div>
            
            {/* Search */}
            <div className="mt-4 w-full md:w-auto md:mt-0">
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

export default Layout
