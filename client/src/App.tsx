import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StripeProvider, Elements } from "react-stripe-elements";
import { Affix, Layout, Spin } from "antd";
import {
  AppHeader,
  Home,
  Host,
  Listing,
  Listings,
  Login,
  NotFound,
  User,
  Stripe,
} from "./sections";
import { AppHeaderSkeleton, ErrorBanner } from "src/lib/components";
import { LOG_IN } from "src/lib/graphql/mutations";
import {
  Viewer,
  LogInMutation as LogInData,
  MutationLogInArgs as LogInVariables,
} from "./__generated__/graphql";
import "./styles/index.css";

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

function App() {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);

  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data: LogInData) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Tinyhouse" fullscreen />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  return (
    <StripeProvider apiKey={import.meta.env.VITE_S_PUBLISHABLE_KEY as string}>
      <BrowserRouter>
        <Layout id="app">
          {logInErrorBannerElement}
          <Affix offsetTop={0} className="app__affix-header">
            <AppHeader viewer={viewer} setViewer={setViewer} />
          </Affix>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/host" element={<Host viewer={viewer} />} />
            <Route
              path="/listing/:listingId"
              element={
                <Elements>
                  <Listing viewer={viewer} />
                </Elements>
              }
            />
            <Route path="/listings" element={<Listings />}>
              <Route path="/listings/:location" element={<Listings />} />
            </Route>
            <Route path="/login" element={<Login setViewer={setViewer} />} />
            <Route
              path="/stripe"
              element={<Stripe viewer={viewer} setViewer={setViewer} />}
            />
            <Route
              path="/user/:userId"
              element={<User viewer={viewer} setViewer={setViewer} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StripeProvider>
  );
}

export default App;
