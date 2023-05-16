import { Outlet, Link } from "react-router-dom";
import "../styles/Layout.css";

const Layout = () => {
  return (
    <>
      <div className="navbar">
        <nav>
          <ul>
            <li>
              <Link to="/stations">Stationslist</Link>
            </li>
            <li>
              <Link to="/journeys">Journeylist</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
