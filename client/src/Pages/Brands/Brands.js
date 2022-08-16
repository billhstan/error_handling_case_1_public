import React from 'react';
import { Outlet } from 'react-router-dom';
import injectContext from '../../Context/appContext';
//https://github.com/jhcxavier/Contact_List_Medium/blob/master/src/js/store/appContext.js
export const Brands=()=> {
    return (
      <div>
         <Outlet></Outlet>
      </div>
    );
  }
  
  export default injectContext(Brands);