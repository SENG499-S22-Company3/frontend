import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import shallow from "zustand/shallow";
import { Footer } from "./components/Footer";
import { NavHeader } from "./components/Nav";
import { Dashboard } from "./pages/Dashboard";
import { Generate } from "./pages/Generate";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ProfileManagement } from "./pages/ProfileManagement";
import { Schedule } from "./pages/Schedule";
import { Survey } from "./pages/Survey";
import { SurveyResults } from "./pages/SurveyResults";
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

export const App = () => {
  const [user, fetchUser] = useLoginStore(
    (state) => [state.user, state.fetchUser],
    shallow
  );

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <NavHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {user && user["roles"] && user["roles"].includes("admin") && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/profileManagement" element={<ProfileManagement />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/surveyresults" element={<SurveyResults />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
        {user && user["roles"] && user["roles"].includes("user") && (
          <>
            <Route path="/survey" element={<Survey />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
      <Footer />
    </ChakraProvider>
  );
};
