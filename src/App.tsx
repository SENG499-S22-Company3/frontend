import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Generate } from "./pages/Generate";
import { Schedule } from "./pages/Schedule";
import { SurveyResults } from "./pages/SurveyResults";
import { ProfileManagement } from "./pages/ProfileManagement";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { ProfessorSurvey } from "./pages/ProfessorSurvey";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
});

export const App = () => (
  <ChakraProvider theme={theme}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/generate" element={<Generate />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/surveyresults" element={<SurveyResults />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profileManagement" element={<ProfileManagement />} />
      <Route path="/professorSurvey" element={<ProfessorSurvey />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ChakraProvider>
);
