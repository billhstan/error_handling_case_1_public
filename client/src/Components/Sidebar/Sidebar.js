import ListGroup from 'react-bootstrap/ListGroup';
//Reference: https://react-bootstrap.github.io/components/list-group/
//I directly copied code from this online resource
//I did not know that there is such thing called ListGroup
//Reference: https://codesandbox.io/s/mtvg1?file=/src/components/nav-bar/nav.jsx
//To manage the state of the link interface, I have checked out the following:
//https://codesandbox.io/s/detect-route-path-changes-with-react-hooks-dt16i?from-embed=&file=/src/components/App.js:200-238
//Spent 1 hour playing with margin just to position the link elements
//Reference: https://modus-react-bootstrap.trimble.com/utilities/padding-and-margin/
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
export default function Sidebar() {
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState(location.pathname);
    useEffect(() => {
        const { pathname } = location;
        console.log('New path:', pathname);
        setCurrentPath(pathname);
      }, [location.pathname]);

  return (
    <ListGroup defaultActiveKey={currentPath} className="d-grid gap-4">
      <ListGroup.Item action href="/brands" className="mt-4 btn btn-primary border">
        Brands
      </ListGroup.Item>
      <ListGroup.Item action href="/products" className="mt-2 btn btn-primary border">
        Products
      </ListGroup.Item>
      <ListGroup.Item action href="/tasks"className="mt-2 btn btn-primary border" >
        Tasks
      </ListGroup.Item>
    </ListGroup>
  );
  }

