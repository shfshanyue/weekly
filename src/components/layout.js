import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <>
        <Link className="header-link-home" to="/">
          首页
        </Link>
        <Link className="header-link-home" to="/week">
          周刊
        </Link>
        <Link className="header-link-home" to="/">
          一句话
        </Link>
        <Link className="header-link-home" to="/">
          开发利器
        </Link>
        <Link className="header-link-home" to="/">
          有趣的库
        </Link>
        <Link className="header-link-home" to="/">
          版本历史
        </Link>
      </>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        {header}
      </header>
      <main>{children}</main>
      <footer>
        Created by <a href="https://shanyue.tech" target="_blank">@shanyue</a> ¬
      </footer>
    </div>
  )
}

export default Layout
