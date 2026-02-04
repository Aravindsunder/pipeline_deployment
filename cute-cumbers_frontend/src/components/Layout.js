import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
// import "./nav.css";

const Layout = () => {
  const location = useLocation();

  const admin = location.pathname.includes("/admin");
  console.log(admin);

  return (
    <>
      <Navbar admin={admin} />
      <div className="w-100" style={{ height: "85px" }}></div>
      <Outlet />
    </>
  );
};

export default Layout;
