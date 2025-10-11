import { Toaster } from "react-hot-toast";
import MenuBar from "./Components/MenuBar/MenuBar";
import { UserRouter } from "./Routes/Route";
import { useLocation } from "react-router-dom";
const App = () => {
  const location = useLocation();
  // const { auth } = useContext(AppContext);

  // const LoginRoute = ({ element }) => {
  //   if (auth.token) {
  //     return <Navigate to="/dashboard" replace />;
  //   }
  //   return element;
  // };

  // const ProtectedRoute = ({ element, allowedRoles }) => {
  //   if (!auth.token) {
  //     return <Navigate to="/login" replace />;
  //   }

  //   if (allowedRoles && !allowedRoles.includes(auth.role)) {
  //     return <Navigate to="/dashboard" replace />;
  //   }

  //   return element;
  // };

  return (
    <div>
      {location.pathname !== "/login" && <MenuBar />}
      <Toaster />
      <UserRouter />
    </div>
  );
};

export default App;
