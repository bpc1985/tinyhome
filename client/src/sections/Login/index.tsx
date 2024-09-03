import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/client";
import { Card, Layout, Spin, Typography } from "antd";
import { AUTH_URL } from "src/lib/graphql/queries";
import { LOG_IN } from "src/lib/graphql/mutations";
import {
  Viewer,
  AuthUrlQuery as AuthUrlData,
  LogInMutation as LogInData,
  MutationLogInArgs as LogInVariables,
} from "src/__generated__/graphql";
import { ErrorBanner } from "src/lib/components";
import { displaySuccessNotification, displayErrorMessage } from "src/lib/utils";

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const googleLogo = new URL("./assets/google_logo.jpg", import.meta.url).href;

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();

  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data: LogInData) => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn);
          sessionStorage.setItem("token", data.logIn.token);
          displaySuccessNotification("You've successfully logged in!");
        }
      },
    });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        } as LogInVariables,
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!"
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." fullscreen />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Navigate to={`/user/${viewerId}`} replace />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
