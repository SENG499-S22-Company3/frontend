import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import { colors } from "./theme/colors";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Generate } from "./pages/Generate";
import { Schedule } from "./pages/Schedule";
import { SurveyResults } from "./pages/SurveyResults";
import { ProfileManagement } from "./pages/ProfileManagement";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { Survey } from "./pages/Survey";
import { NavHeader } from "./components/Nav";
import { Footer } from "./components/Footer";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors,
  config,
});

export const App = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || '{ "user": "" }')
  );
  const navigate = useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || '{ "user": "" }'));
  }, [navigate]);

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
