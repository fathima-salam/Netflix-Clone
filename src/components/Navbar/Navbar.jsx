import React, { useEffect, useRef } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_image from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'
import { useNavigate } from 'react-router-dom'  

const Navbar = () => {
  const navRef = useRef()
  const navigate = useNavigate()  

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {  
        if (window.scrollY >= 80) {
          navRef.current.classList.add('nav-dark')
        } else {
          navRef.current.classList.remove('nav-dark')
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-Left">
        <img src={logo} alt="" onClick={() => handleNavigation('/')} style={{cursor: 'pointer'}} />
        <ul>
          <li onClick={() => handleNavigation('/')}>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li onClick={() => handleNavigation('/mylist')} style={{cursor: 'pointer'}}>My List</li>
          <li>Browse by Language</li>
        </ul>
      </div>
      <div className="navbar-Right">
        <img src={search_icon} alt="" className='icons'/>
        <p>Children</p>
        <img src={bell_icon} alt="" className='icons'/>
        <div className='navbar_profile'>
          <img src={profile_image} alt="" className='profile'/>
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={() => {logout()}}>Sign Out of Netflix</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar