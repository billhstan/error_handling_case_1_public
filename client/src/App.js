import './App.css';
//Reference: https://www.freecodecamp.org/news/how-to-use-react-router-version-6/
//Some changes were done to make React Router available anywhere in the application.
import {BrowserRouter as Router,Routes,Route, Link, Outlet} from 'react-router-dom';
import Landing from './Pages/Landing/Landing';
import AddProduct from './Pages/AddProduct/AddProduct';
import ManageProducts from './Pages/ManageProducts/ManageProducts';
import AddBrand from './Pages/AddBrand/AddBrand';
import UpdateBrand from './Pages/UpdateBrand/UpdateBrand';
import ManageBrands from './Pages/ManageBrands/ManageBrands';
import NoMatch from './Pages/NoMatch/NoMatch';
import Header from './Components/Header/Header';
import Layout from './Components/Layout/Layout';
import Brands from './Pages/Brands/Brands';
import Products from './Pages/Products/Products';
import UpdateProduct from './Pages/UpdateProduct/UpdateProduct';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
			<Router>
				<Header></Header>

				<Routes>
					<Route element={<Layout />}>
						<Route index element={<Landing />} />
						<Route path="/landing" element={<Landing />} />
						<Route path="brands" element={<Brands />}>
							<Route index element={<ManageBrands />} />
							<Route path=":brandId" element={<UpdateBrand />} />
							<Route path="add" element={<AddBrand />} />
              <Route path="*" element={<NoMatch />} />
						</Route>
            <Route path="products" element={<Products />}>
							<Route index element={<ManageProducts />} />
							<Route path=":productId" element={<UpdateProduct />} />
							<Route path="add" element={<AddProduct />} />
              <Route path="*" element={<NoMatch />} />
						</Route>
						<Route path="*" element={<NoMatch />} />
					</Route>
				</Routes>
			</Router>
		);
}

export default App;
