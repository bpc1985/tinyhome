import { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { Dayjs } from "dayjs";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries";
import {
  ListingQuery as ListingData,
  ListingQueryVariables as ListingVariables,
  Viewer,
} from "src/__generated__/graphql";
import {
  ListingBookings,
  ListingCreateBooking,
  ListingCreateBookingModal,
  ListingDetails,
} from "./components";

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const PAGE_LIMIT = 3;

export const Listing = ({ viewer }: Props) => {
  const { listingId } = useParams();
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null); // Use Dayjs type instead of Moment
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null); // Use Dayjs type instead of Moment
  const [modalVisible, setModalVisible] = useState(false);

  const { loading, data, error, refetch } = useQuery<
    ListingData,
    ListingVariables
  >(LISTING, {
    variables: {
      id: listingId ?? "",
      bookingsPage,
      limit: PAGE_LIMIT,
    },
  });

  const clearBookingData = () => {
    setModalVisible(false);
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const handleListingRefetch = async () => {
    await refetch();
  };

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon!" />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const listingCreateBookingElement = listing ? (
    <ListingCreateBooking
      viewer={viewer}
      host={listing.host}
      price={listing.price}
      bookingsIndex={listing.bookingsIndex}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModalElement =
    listing && checkInDate && checkOutDate ? (
      <ListingCreateBookingModal
        id={listing.id}
        price={listing.price}
        modalVisible={modalVisible}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        setModalVisible={setModalVisible}
        clearBookingData={clearBookingData}
        handleListingRefetch={handleListingRefetch}
      />
    ) : null;

  return (
    <Content className="listings">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
      {listingCreateBookingModalElement}
    </Content>
  );
};
