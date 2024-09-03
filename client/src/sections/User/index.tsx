import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";
import { USER } from "src/lib/graphql/queries";
import {
  Viewer,
  UserQuery as UserData,
  UserQueryVariables as UserVariables,
} from "src/__generated__/graphql";
import { UserBookings, UserListings, UserProfile } from "./components";
import { PageSkeleton, ErrorBanner } from "../../lib/components";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const PAGE_LIMIT = 4;
const { Content } = Layout;

export const User = ({ viewer, setViewer }: Props) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const { userId } = useParams();

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
    USER,
    {
      variables: {
        id: userId ?? "",
        bookingsPage,
        listingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  const handleUserRefetch = async () => {
    await refetch();
  };

  const stripeError = new URL(window.location.href).searchParams.get(
    "stripe_error"
  );

  const stripeErrorBanner = stripeError ? (
    <ErrorBanner description="We had an issue connecting with Stripe. Please try again soon." />
  ) : null;

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exists we've encountered an error. Please try again later" />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === userId;

  const userListings = user?.listings ?? null;
  const userBookings = user?.bookings ?? null;

  const userProfileElement = user ? (
    <UserProfile
      user={user}
      viewer={viewer}
      viewerIsUser={viewerIsUser}
      setViewer={setViewer}
      handleUserRefetch={handleUserRefetch}
    />
  ) : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      page={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  ) : null;

  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      page={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  return (
    <Content className="user">
      {stripeErrorBanner}
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>{userBookingsElement}</Col>
        <Col xs={24}>{userListingsElement}</Col>
      </Row>
    </Content>
  );
};
