import React from 'react'
import {useNavigate} from 'react-router-dom';

function NoMatch() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Something went wrong</h1>
            This view is rendered when the Route engine cannot find a matching URL path pattern.
             <button onClick={()=>{navigate('/landing')}} >Home</button> 
        </div>
       
    )
}

export default NoMatch