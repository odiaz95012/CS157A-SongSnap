import Cookies from 'js-cookie';
import { Outlet } from 'react-router-dom';

function AdminRoute() {
    const isAdmin = Cookies.get('isAdmin');
  return (
    isAdmin === 'true' ? < Outlet/> : (
        <div className='container text-center'>
            <div className="w3-display-middle my-5">
                <h1 className="w3-jumbo w3-animate-top w3-center"><code>Access Denied</code></h1>
                <hr className="w3-border-white w3-animate-left" style={{ margin: "auto", width: "50%" }} />
                <h3 className="w3-center w3-animate-right">You don't have permission to view this page.</h3>
                <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
                <h6 className="w3-center w3-animate-zoom">Error Code: 403 Forbidden</h6>
            </div>
        </div>
    )
  )
}

export default AdminRoute