import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Explore from "../Pages/Explore/Explore";
import ManageCategory from "../Pages/ManageCategory/ManageCategory";
import ManageUsers from "../Pages/ManageUsers/ManageUsers";
import ManageItems from "../Pages/ManageItems/ManageItems";
import Login from "../Pages/Login/Login";
import OrderHistory from "../Pages/OrderHistory/OrderHistory";
import NotFound from "../Pages/NotFound/NotFound";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

export const UserRouter = () => {
  const location = useLocation();
  const { auth } = useContext(AppContext);

  const LoginRoute = ({ element }) => {
    if (auth.token) {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!auth.token) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return element;
  };

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/explore" element={<Explore />} />

      <Route path="/manage-categories" element={<ProtectedRoute element={<ManageCategory />} allowedRoles={['ROLE_ADMIN']} />} />
      <Route path="/manage-users" element={<ProtectedRoute element={<ManageUsers />} allowedRoles={['ROLE_ADMIN']} />} />
      <Route path="/manage-items" element={<ProtectedRoute element={<ManageItems />} allowedRoles={['ROLE_ADMIN']} />} />

      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/login" element={<LoginRoute element={<Login />} />}/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
