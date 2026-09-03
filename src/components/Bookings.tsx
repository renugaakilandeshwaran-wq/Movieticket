import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useLocation } from "react-router-dom";

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

function Bookings() {
    const [shows, setShows] = useState<any[]>([]);
    const [movies, setMovies] = useState<any[]>([]);
    const [theatres, setTheatres] = useState<any[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (location.state?.bookingSuccess) {
            setSuccessMessage("Booking Successful!");

            window.history.replaceState({}, document.title);

            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingResponse = await api.get<Booking[]>("/bookings");
                const showResponse = await api.get("/shows");
                const movieResponse = await api.get("/movies");
                const theatreResponse = await api.get("/theatres");
                setBookings(bookingResponse.data);
                setShows(showResponse.data);
                setMovies(movieResponse.data);
                setTheatres(theatreResponse.data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    // delete function
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this booking?"
        )
        if (!confirmDelete) return;
        try {
            await api.delete(`/bookings/${id}`);

            setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking.id !== id)
            )
        } catch (error) {
            console.error("Failed to delete booking:", error);


        }
    };

    const handleCancel = async (id: string) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) return;

        try {
            const response = await api.patch(`/bookings/${id}`, {
                bookingStatus: "Cancelled",
            });

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.id === id ? response.data : booking
                )
            );
        } catch (error) {
            console.error("Failed to cancel booking:", error);
        }
    };


    const getShow = (showId: string) => {
        return shows.find((show) => show.id === showId);
    };

    const getMovieName = (movieId: string) => {
        return movies.find((movie) => movie.id === movieId)?.name || "Unknown Movie";
    };

    const getTheatreName = (theatreId: string) => {
        return theatres.find((theatre) => theatre.id === theatreId)?.name || "Unknown Theatre";
    };
    if (loading) {
        return (
            <p className="mt-40 text-center text-blue-500">
                Loading...
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-3xl font-bold">
                    Bookings
                </h1>
                {successMessage && (
                    <div className="mb-6 rounded-lg bg-green-100 p-4 text-center font-medium text-green-700">
                        ✅ {successMessage}
                    </div>
                )}
                {bookings.length === 0 ? (
                    <div className="rounded-lg bg-white p-10 text-center shadow">
                        No Bookings Available.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-xl bg-white p-5 shadow"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="mb-3 text-xl font-bold">
                                        {booking.customerName}
                                    </h2>
                                    <Link
                                        to={`/bookings/${booking.id}`}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                                    >
                                        View Details
                                    </Link>
                                </div>
                                <p className="mb-1">
                                    <strong>Email:</strong> {booking.email}
                                </p>

                                <p className="mb-1">
                                    <strong>Phone:</strong> {booking.phone}
                                </p>

                                {(() => {
                                    const show = getShow(booking.showId);

                                    return (
                                        <>
                                            <p className="mb-1">
                                                <strong>Movie:</strong>{" "}
                                                {show ? getMovieName(show.movieId) : "Unknown Movie"}
                                            </p>

                                            <p className="mb-1">
                                                <strong>Theatre:</strong>{" "}
                                                {show ? getTheatreName(show.theatreId) : "Unknown Theatre"}
                                            </p>

                                            <p className="mb-1">
                                                <strong>Screen:</strong>{" "}
                                                {show?.screen || "N/A"}
                                            </p>

                                            <p className="mb-1">
                                                <strong>Date:</strong>{" "}
                                                {show?.date || "N/A"}
                                            </p>

                                            <p className="mb-1">
                                                <strong>Show Time:</strong>{" "}
                                                {show?.showTime || "N/A"}
                                            </p>
                                        </>
                                    );
                                })()}

                                <p className="mb-1">
                                    <strong>Seats:</strong>{" "}
                                    {booking.seats.join(", ")}
                                </p>

                                <p className="mb-1">
                                    <strong>No. of Tickets:</strong>{" "}
                                    {booking.numberOfTickets}
                                </p>

                                <p className="mt-3 text-lg font-bold">
                                    Total: ₹{booking.totalAmount}
                                </p>

                                <span
                                    className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${booking.bookingStatus === "Cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {booking.bookingStatus}
                                </span>

                                <div className="mt-4 flex  flex-wrap justify-between items-center gap-2">


                                    <Link
                                        to={`/bookings/${booking.id}/edit`}
                                        className="rounded-lg  bg-yellow-200 px-4 py-2 text-yellow-800"
                                    >
                                        Edit
                                    </Link>

                                    {booking.bookingStatus !== "Cancelled" && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(booking.id)}
                                            className="rounded-lg bg-gray-500 px-4 py-2 text-white"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(booking.id)}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bookings;