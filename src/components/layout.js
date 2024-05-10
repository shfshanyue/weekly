import * as React from "react"
import { Link } from "gatsby"
import Search from "./search"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <div className="mb-6 text-4xl font-bold text-gray-800">
          <Link to="/" className="text-current">{title}</Link>
        </div>
        <div>
          <Link className="header-link-home" to="/">
            首页
          </Link>
          <Link className="header-link-home" to="/week/">
            周刊
          </Link>
          <Link className="header-link-home" to="/tool/">
            开发利器
          </Link>
          <Link className="header-link-home" to="/package/">
            有趣的库
          </Link>
          <Link className="header-link-home" to="/release/">
            版本历史
          </Link>
        </div>
        <div className="mt-2">
          <Search />
        </div>
      </header>
      <main>{children}</main>
      <footer>
        Created by <a href="https://shanyue.tech" target="_blank">@shanyue</a> ¬
      </footer>
    </div>
  )
}

export default Layout
