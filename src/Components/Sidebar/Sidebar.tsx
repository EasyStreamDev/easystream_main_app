import React, { useState } from 'react';

import { IconContext } from 'react-icons';
import './Sidebar.css';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu/SubMenu';
import { useLocation } from 'react-router-dom'

const PathView = (props: any) => {

  const parseLocation = (path: string) => {
    const res = SidebarData.find(item => item.subNav && item.subNav.find(item => item.path === path)?.fullTitle); // Get the item which has the full title of the current page
    console.log(res);
    if (res?.subNav) {
      return res.subNav.find(item => item.path === path)?.fullTitle; // Get the full title of the current page
    } else {
      return res?.title; // Default to the title of the current page
    }
  }

  const location = useLocation();

  return <span className="path">{parseLocation(location.pathname)}</span>
}

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar' id="nav-expand">
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={toggleSidebar} />
          </Link>
          <span className='easystream-title'>EASYSTREAM</span>
          <PathView />
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu hidden'}>
          <ul className='nav-menu-items'>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose onClick={toggleSidebar} />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;