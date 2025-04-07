import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import Login from "./auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./componentes/PrivateRoute";
import Home from "./pages/Home";
import "./styles/Global.css"
export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/p"
          element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </MantineProvider>
  );
}
