import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

type Booking = {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    showId: string;
    seats: number[];
    numberOfTickets: number;
    totalAmount: number;
    bookingStatus: string;
};

type Show = {
    id: string;
    movieId: string;
    theatreId: string;
    screen: string;
    date: string;
    showTime: string;
};

type Movie = {
    id: string;
    name: string;
};

type Theatre = {
    id: string;
    name: string;
};

function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [show, setShow] = useState<Show | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [theatre, setTheatre] = useState<Theatre | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const bookingResponse = await api.get<Booking>(
                    `/bookings/${id}`
                );

                const bookingData = bookingResponse.data;
                setBooking(bookingData);

                const showResponse = await api.get<Show>(
                    `/shows/${bookingData.showId}`
                );

                const showData = showResponse.data;
                setShow(showData);

                const movieResponse = await api.get<Movie>(
                    `/movies/${showData.movieId}`
                );

                setMovie(movieResponse.data);

                const theatreResponse = await api.get<Theatre>(
                    `/theatres/${showData.theatreId}`
                );

                setTheatre(theatreResponse.data);
            } catch (error) {
                console.error("Failed to fetch booking details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [id]);

    if (loading) {
        return (
            <p className="mt-40 text-center text-blue-500">
                Loading...
            </p>
        );
    }

    if (!booking) {
        return (
            <div className="mt-40 text-center">
                <p className="mb-4 text-red-500">
                    Booking not found.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/bookings")}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                    Back to Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24">
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        Booking Details
                    </h1>

                    <button
                        type="button"
                        onClick={() => navigate("/bookings")}
                        className="rounded-lg bg-gray-500 px-4 py-2 text-white"
                    >
                        Back
                    </button>
                </div>

                <div className="space-y-3 rounded-lg bg-gray-100 p-5">

                    <p>
                        <strong>Booking ID:</strong> {booking.id}
                    </p>

                    <p>
                        <strong>Customer Name:</strong>{" "}
                        {booking.customerName}
                    </p>

                    <p>
                        <strong>Email:</strong> {booking.email}
                    </p>

                    <p>
                        <strong>Phone:</strong> {booking.phone}
                    </p>

                    <hr className="my-4" />

                    <p>
                        <strong>Movie:</strong>{" "}
                        {movie?.name || "N/A"}
                    </p>

                    <p>
                        <strong>Theatre:</strong>{" "}
                        {theatre?.name || "N/A"}
                    </p>

                    <p>
                        <strong>Screen:</strong>{" "}
                        {show?.screen || "N/A"}
                    </p>

                    <p>
                        <strong>Date:</strong>{" "}
                        {show?.date || "N/A"}
                    </p>

                    <p>
                        <strong>Show Time:</strong>{" "}
                        {show?.showTime || "N/A"}
                    </p>

                    <p>
                        <strong>Seats:</strong>{" "}
                        {booking.seats.join(", ")}
                    </p>

                    <p>
                        <strong>Number of Tickets:</strong>{" "}
                        {booking.numberOfTickets}
                    </p>

                    <p className="pt-2 text-xl font-bold">
                        Total Amount: ₹{booking.totalAmount}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                            {booking.bookingStatus}
                        </span>
                    </p>

                </div>
                {/* 
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/bookings/${booking.id}/edit`)
                        }
                        className="rounded-lg bg-yellow-500 px-5 py-2 text-white"
                    >
                        Edit Booking
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default BookingDetails;