import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.jsx";
import SignIn from "./components/auth/SignIn.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import ProtectedRoute from "./components/protected/ProtectedRoute.jsx";
import Main from "./components/main/Main.jsx";
import Space from "./components/space/Space.jsx";
import TestComponent from "./components/testComponent/TestComponent.jsx";
import ChooseGrp from "./components/choose-Group/ChooseGrp.jsx";
import JoinGrp from "./components/join-Group/JoinGrp.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/space"
            element={
              <ProtectedRoute>
                <Space />
              </ProtectedRoute>
            }
          />

          <Route
            path="/choose-group"
            element={
              <ProtectedRoute>
                <ChooseGrp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/join-group"
            element={
              <ProtectedRoute>
                <JoinGrp />
              </ProtectedRoute>
            }
          />

          <Route path="/test" element={<TestComponent />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </>
);
