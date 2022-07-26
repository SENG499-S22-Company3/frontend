import {
  Box,
  ChakraProvider,
  extendTheme,
  ThemeConfig,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import shallow from "zustand/shallow";
import { Footer } from "./components/Footer";
import { NavHeader } from "./components/Nav";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { Generate } from "./pages/Generate";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Professors } from "./pages/Professors";
import { Schedule } from "./pages/Schedule";
import { Survey } from "./pages/Survey";
import { useLoginStore } from "./stores/login";
import { colors } from "./theme/colors";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors,
  config,
});

const Redirect = (props: { to: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(props.to);
  }, []);
  return <></>;
};

export const App = () => {
  const [user, loggedIn, fetchUser] = useLoginStore(
    (state) => [state.user, state.loggedIn, state.fetchUser],
    shallow
  );

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box position="relative" minHeight={"100vh"}>
        <NavHeader />
        <Routes>
          {!loggedIn && <Route path="/" element={<Home />} />}
          <Route path="/login" element={<Login />} />
          {user && user["roles"] && user["roles"].includes("admin") && (
            <>
              <Route path="/" element={<Redirect to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/professors" element={<Professors />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
          {user && user["roles"] && user["roles"].includes("user") && (
            <>
              <Route path="/" element={<Redirect to="/survey" />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Box>
    </ChakraProvider>
  );
};
