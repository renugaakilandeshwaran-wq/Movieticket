import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

type Show = {
    id: string;
    movieId: string;
    theatreId: string;
    screen: string;
    date: string;
    showTime: string;
    ticketPrice: number;
    availableSeats: number;
};
type Booking = {
    id: string;
    showId: string;
    seats: number[];
};

function SeatSelection() {
    const { id } = useParams();
    const navigate = useNavigate();
    console.log("Seat Selection ID:", id);

    const [bookedSeats, setBookedSeats] = useState<number[]>([]);
    const [show, setShow] = useState<Show | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const response = await api.get<Show>(`/shows/${id}`);
                setShow(response.data);

                const bookingResponse = await api.get<Booking[]>(
                    `/booking?showId=${id}`
                );
                const booked = bookingResponse.data.flatMap(
                    (booking) => booking.seats
                );

                setBookedSeats(booked);
                console.log("Booked Seats:", bookedSeats);
            } catch (error) {
                console.error("Failed to fetch show:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShow();
    }, [id]);

    const seats = Array.from({ length: 40 }, (_, index) => index + 1);

    const handleSeatClick = (seatNumber: number) => {
        setSelectedSeats((prev) =>
            prev.includes(seatNumber)
                ? prev.filter((seat) => seat !== seatNumber)
                : [...prev, seatNumber]
        );
    };

    const totalPrice = show
        ? selectedSeats.length * show.ticketPrice
        : 0;

    if (loading) {
        return (
            <p className="mt-40 text-center text-blue-500">
                Loading...
            </p>
        );
    }

    if (!show) {
        return (
            <p className="mt-40 text-center text-red-500">
                Show not found.
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24">
            <div className="px-4 py-4">
                <button
                    type="button"
                    onClick={() => navigate("/shows")}
                    className="rounded-lg  bg-gray-500 px-5 py-2 text-white"
                >
                    Back
                </button>
            </div>
            <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Select Your Seats
                </h1>

                {/* Show Details */}
                <div className="mb-8 rounded-lg bg-gray-100 p-4">
                    <p>
                        <strong>Screen:</strong> {show.screen}
                    </p>

                    <p>
                        <strong>Date:</strong> {show.date}
                    </p>

                    <p>
                        <strong>Show Time:</strong> {show.showTime}
                    </p>

                    <p>
                        <strong>Ticket Price:</strong> ₹{show.ticketPrice}
                    </p>
                </div>

                {/* Screen */}
                <div className="mb-8">
                    <div className="mb-6 rounded bg-gray-800 py-2 text-center text-white">
                        SCREEN
                    </div>

                    {/* Seats */}
                    <div className="grid grid-cols-5 gap-3 sm:grid-cols-8">


                        {seats.map((seat) => {
                            const isSelected = selectedSeats.includes(seat);
                            const isBooked = bookedSeats.includes(seat);

                            return (
                                <button
                                    key={seat}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => handleSeatClick(seat)}
                                    className={`rounded-lg p-3 text-sm font-medium ${isBooked
                                        ? "cursor-not-allowed bg-red-500 text-white"
                                        : isSelected
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 hover:bg-blue-200"
                                        }`}
                                >
                                    {seat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Seats */}
                <div className="border-t pt-5">

                    <p className="mb-2 font-medium">
                        Selected Seats:
                    </p>

                    <p className="mb-4 text-gray-600">
                        {selectedSeats.length > 0
                            ? selectedSeats.join(", ")
                            : "No seats selected"}
                    </p>

                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold">
                            Total: ₹{totalPrice}
                        </p>

                        {/* <button
                            type="button"
                            onClick={() => {
                                navigate(`/shows/${id}/booking`, {
                                    state: {
                                        selectedSeats,
                                        totalPrice,
                                    },
                                });
                            }}
                            disabled={selectedSeats.length === 0}
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            Continue
                        </button> */}

                        <button
                            type="button"
                            onClick={() => {
                                console.log("Going to booking:", id);

                                if (!id) {
                                    console.error("Show ID is missing");
                                    return;
                                }

                                navigate(`/shows/${id}/bookings`, {
                                    state: {
                                        selectedSeats,
                                        totalPrice,
                                    },
                                });
                            }}
                            disabled={selectedSeats.length === 0}
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            Continue
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default SeatSelection;