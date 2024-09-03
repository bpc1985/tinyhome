import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "antd";
// import { useMutation } from "@apollo/client";
// import { CREATE_BOOKING } from "../../../../lib/graphql/mutations";
// import {
//   BookingMutation as CreateBookingData,
//   CreateBookingMutation as CreateBookingVariables,
// } from "src/__generated__/graphql";
// import {
//   displaySuccessNotification,
//   displayErrorMessage,
// } from "../../../../lib/utils";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [emailInput, setEmailInput] = useState("");

  // const [createBooking, { loading }] = useMutation<
  //   CreateBookingData,
  //   CreateBookingVariables
  // >(CREATE_BOOKING, {
  //   onCompleted: () => {
  //     clearBookingData();
  //     displaySuccessNotification(
  //       "You've successfully booked the listing!",
  //       "Booking history can always be found in your User page."
  //     );
  //     handleListingRefetch();
  //   },
  //   onError: () => {
  //     displayErrorMessage(
  //       "Sorry! We weren't able to successfully book the listing. Please try again later!"
  //     );
  //   },
  // });

  const backendUrl = import.meta.env.VITE_STRIPE_PK_AIRCODE_URL;

  const handleSubmit = async event => {
    event.preventDefault();

    if (elements == null || stripe == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError?.message) {
      setErrorMessage(submitError.message);
      return;
    }

    const price = 12;

    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency: "usd",
        email: emailInput,
        amount: price * 100,
        paymentMethodType: "card",
      }),
    });

    const { client_secret: clientSecret } = await res.json();

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="listing-booking-modal__stripe-card-section">
      <PaymentElement />
      <Button
        size="large"
        type="primary"
        className="listing-booking-modal__cta"
        disabled={!stripe || !elements}
        onClick={handleSubmit}
      >
        Book
      </Button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};
