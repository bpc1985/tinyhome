import { useEffect, useRef } from "react";
import { Navigate, redirect } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations";
import {
  ConnectStripeMutation as ConnectStripeData,
  ConnectStripeMutationVariables as ConnectStripeVariables,
  Viewer,
} from "src/__generated__/graphql";
import { displaySuccessNotification } from "../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

export const Stripe = ({ viewer, setViewer }: Props) => {
  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: data => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
        displaySuccessNotification(
          "You've successfully connected your Stripe Account!",
          "You can now begin to create listings in the Host page."
        );
      }
    },
  });

  const connectStripeRef = useRef(connectStripe);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code },
        },
      });
    } else {
      redirect("/login");
    }
  }, []);

  console.log({ data, error });

  if (data && data.connectStripe) {
    return <Navigate to={`/user/${viewer.id}`} />;
  }

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connecting your Stripe account..." />
      </Content>
    );
  }

  if (error) {
    return <Navigate to={`/user/${viewer.id}?stripe_error=true`} />;
  }

  return null;
};
