import logo from "./logo.svg";
import "./App.css";
import { Login } from "./components/Login_page/Login";
import { SignUp } from "./components/Sign_up/SignUp";
import Layout from "./components/Layout";
import { Menu } from "./components/Menu/Menu";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Cart } from "./components/cart/Cart";
import Admin from "./components/Admin_page/Admin";
import { Payment } from "./components/payment/Payment";
import { Orders } from "./components/orders/Orders";
import { Profile } from "./components/navbar/Profile";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/our-menu",
          element: <Menu />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/payment",
          element: <Payment />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/edit-profile",
          element: <Profile />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
