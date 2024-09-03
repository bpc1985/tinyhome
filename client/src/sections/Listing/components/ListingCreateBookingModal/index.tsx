import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import relativeTime from "dayjs/plugin/relativeTime"; // For diff calculation
import advancedFormat from "dayjs/plugin/advancedFormat"; // For formatting like "MMMM Do YYYY"
import { useMutation } from "@apollo/client";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CREATE_BOOKING } from "../../../../lib/graphql/mutations";
import {
  CreateBookingMutation as CreateBookingData,
  CreateBookingMutationVariables as CreateBookingVariables,
} from "src/__generated__/graphql";
import { Button, Divider, Modal, Typography } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from "../../../../lib/utils";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

interface Props {
  id: string;
  price: number;
  modalVisible: boolean;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  setModalVisible: (modalVisible: boolean) => void;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
  id,
  price,
  modalVisible,
  checkInDate,
  checkOutDate,
  setModalVisible,
  clearBookingData,
  handleListingRefetch,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [createBooking, { loading }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification(
        "You've successfully booked the listing!",
        "Booking history can always be found in your User page."
      );
      handleListingRefetch();
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to successfully book the listing. Please try again later!"
      );
    },
  });

  const daysBooked = checkOutDate.diff(checkInDate, "day") + 1;
  const listingPrice = price * daysBooked;

  const handleCreateBooking = async () => {
    if (!stripe || !elements) {
      return displayErrorMessage(
        "Sorry! We weren't able to connect with Stripe."
      );
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return displayErrorMessage(
        "Sorry! We weren't able to find the card element."
      );
    }

    const { token, error } = await stripe.createToken(cardElement);

    if (token) {
      createBooking({
        variables: {
          input: {
            id,
            source: token.id,
            checkIn: dayjs(checkInDate).format("YYYY-MM-DD"),
            checkOut: dayjs(checkOutDate).format("YYYY-MM-DD"),
          },
        },
      });
    } else {
      displayErrorMessage(
        error && error.message
          ? error.message
          : "Sorry! We weren't able to book the listing. Please try again later."
      );
    }
  };

  return (
    <Modal
      open={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-boooking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title level={3} className="listing-boooking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{" "}
            <Text mark strong>
              {dayjs(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
            and{" "}
            <Text mark strong>
              {dayjs(checkOutDate).format("MMMM Do YYYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            options={{ hidePostalCode: true }}
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            loading={loading}
            onClick={handleCreateBooking}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
