import type React from "react"
import { Link } from "react-router-dom"

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbarContent">
        <div className="logo">
          <Link to="/" className="logoLink">
            Pool Lens
          </Link>
        </div>
        <div className="navLinks">
          <Link to="/" className="navLink">
            Get Liquidity
          </Link>
          <Link to="/pool-address" className="navLink">
            Get Pool Address
          </Link>
          <Link to="/history" className="navLink">
            Search History
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

