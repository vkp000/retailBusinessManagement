import { Toaster } from "react-hot-toast";
import MenuBar from "./Components/MenuBar/MenuBar";
import { UserRouter } from "./Routes/Route";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const hideNav = location.pathname === "/login";

  return (
    <div>
      {!hideNav && <MenuBar />}
      <div className={hideNav ? "" : "page-body"}>
        <UserRouter />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1c1c2e",
            color: "#e8e8f0",
            border: "1px solid #2a2a3d",
            fontFamily: "Outfit, sans-serif",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default App;