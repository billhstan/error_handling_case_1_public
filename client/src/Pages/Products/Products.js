import React from 'react';
import { Outlet } from 'react-router-dom';
import injectContext from '../../Context/appContext';
function Products() {
    return (
      <div>
         <Outlet></Outlet>
      </div>
    );
  }
  
  export default injectContext(Products);