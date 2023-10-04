import React from 'react';
import '../styles/MenuBar.css';
import ServicesDropdown from './ServicesDropdown';

const MenuBar = () => {
  return (
    <div className="menu-bar">
      <button>Playground</button>
      <button>Tutorials</button>
      <ServicesDropdown />
    </div>
  );
}

export default MenuBar;