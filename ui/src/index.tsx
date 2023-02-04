import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Default from "./layout/Default";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./Provider/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { CookiesProvider } from "react-cookie";
import App from "./App";
import Signin from "./components/Signin/Signin";
import Home from "./components/Home/Home";
import Messages from "./pages/Messages/Messages";
import Teams from "./pages/Teams/Teams";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { Provider } from "react-redux";
import { store } from "./store/store";
import TeamsMembers from "./pages/Teams/TeamsMembers";
import { UpdateStateProvider } from "./Provider/UpdateStateContext";
import TeamPosts from "./pages/Teams/TeamPosts";
import EditTeam from "./pages/Teams/EditTeam";
import ChatScreen from "./pages/Messages/ChatScreen";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);


document.title="UpTrend Application"

root.render(
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <UpdateStateProvider>
            <ToastContainer />
            <Default>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/auth/signin" element={<Signin />} />
                <Route
                  path="/home"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <PrivateRoute>
                      <Messages />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/teams"
                  element={
                    <PrivateRoute>
                      <Teams />
                    </PrivateRoute>
                  }
                />
                <Route path="/teams/posts/:teamId" element={
                  <PrivateRoute>
                    <TeamPosts />
                  </PrivateRoute>
                } />
                <Route path="/teams/edit/:teamId" element={
                  <PrivateRoute>
                    <EditTeam />
                  </PrivateRoute>
                } />
                <Route
                  path="/teams/members/:id"
                  element={
                    <PrivateRoute>
                      <TeamsMembers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/messages/:teamId"
                  element={
                    <PrivateRoute>
                      <Messages />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Default>
          </UpdateStateProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
