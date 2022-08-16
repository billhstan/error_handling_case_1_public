import React from 'react'
import { Outlet,Link } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar'
function Layout() {
return (
<div className="container-fluid text-center m-100">    
  <div className="row content">
    <div className="col-sm-1 sidenav">
      <Sidebar></Sidebar>
    </div>
    <div className="col-sm-10 text-left p-5" > 
<Outlet></Outlet>
    </div>
    <div className="col-sm-1 sidenav">
  
    </div>
  </div>
</div>
);
}

export default Layout