import { Request } from "express";
import { ObjectId } from "mongodb";
import { Database, Listing, Booking, BookingsIndex } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { Stripe } from "../../../lib/api";
import { CreateBookingArgs } from "./types";

const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  let checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear();
    const m = dateCursor.getUTCMonth();
    const d = dateCursor.getUTCDate();

    if (!newBookingsIndex[y]) {
      newBookingsIndex[y] = {};
    }

    if (!newBookingsIndex[y][m]) {
      newBookingsIndex[y][m] = {};
    }

    if (!newBookingsIndex[y][m][d]) {
      newBookingsIndex[y][m][d] = true;
    } else {
      throw new Error(
        "selected dates can't overlap dates that have already been booked"
      );
    }

    dateCursor = new Date(dateCursor.getTime() + 86400000);
  }

  return newBookingsIndex;
};

export const bookingResolvers = {
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking | null> => {
      try {
        const { id, source, checkIn, checkOut } = input;

        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("viewer cannot be found");
        }

        const listing = await db.listings.findOne({
          _id: new ObjectId(id),
        });

        if (!listing) {
          throw new Error("listing can't be found");
        }

        if (listing.host === viewer._id) {
          throw new Error("viewer can't book own listing");
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
          throw new Error("check out date can't be before check in date");
        }

        const bookingsIndex = resolveBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );

        const totalPrice =
          listing.price *
          ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);

        const host = await db.users.findOne({
          _id: listing.host,
        });

        if (!host || !host.walletId) {
          throw new Error(
            "the host either can't be found or is not connected with Stripe"
          );
        }

        console.log(host.walletId);
        await Stripe.charge(totalPrice, source, host.walletId);

        const insertRes = await db.bookings.insertOne({
          _id: new ObjectId(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut,
        });

        await db.users.updateOne(
          {
            _id: host._id,
          },
          {
            $inc: { income: totalPrice },
          }
        );

        await db.users.updateOne(
          {
            _id: viewer._id,
          },
          {
            $push: { bookings: insertRes.insertedId },
          }
        );

        await db.listings.updateOne(
          {
            _id: listing._id,
          },
          {
            $set: { bookingsIndex },
            $push: { bookings: insertRes.insertedId },
          }
        );

        const insertedBooking = await db.bookings.findOne({
          _id: insertRes.insertedId,
        });

        return insertedBooking;
      } catch (error) {
        throw new Error(`Failed to create a booking: ${error}`);
      }
    },
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: (
      booking: Booking,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },
    tenant: (booking: Booking, _args: {}, { db }: { db: Database }) => {
      return db.users.findOne({ _id: booking.tenant });
    },
  },
};
