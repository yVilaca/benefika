import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import Login from "./pages/login";

export default function App() {
  return <MantineProvider theme={theme}>
    <Login/>
  </MantineProvider>;
}
