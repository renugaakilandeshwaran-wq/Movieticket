import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

type Show = {
    id: string;
    movieId: string;
    theatreId: string;
    screen: string;
    date: string;
    showTime: string;
    ticketPrice: number;
};
type Movie = {
    id: string;
    name: string;
};

type Theatre = {
    id: string;
    name: string;
};
function Booking() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const selectedSeats: number[] =
        location.state?.selectedSeats || [];

    const [show, setShow] = useState<Show | null>(null);
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [movie, setMovie] = useState<Movie | null>(null);
    const [theatre, setTheatre] = useState<Theatre | null>(null);
    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                const showResponse = await api.get<Show>(`/shows/${id}`);
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
                console.error("Failed to fetch booking data:", error);
            }
        };

        fetchBookingData();
    }, [id]);

    const totalAmount = show
        ? selectedSeats.length * show.ticketPrice
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName.trim() || !email.trim() || !phone.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        // customer Name validation
        if (customerName.trim().length < 3) {
            setError("Customer name must be at least 3 character.");
            return;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }


        // phone validation
        const phonePattern = /^[0-9]{10}$/;

        if (!phonePattern.test(phone)) {
            setError("Phone number must contain exactly 10 digits.");
            return;
        }

        // seat validation

        if (selectedSeats.length === 0) {
            setError("Please select at least one seat.")
            return;
        }

        try {
            await api.post("/bookings", {
                customerName: customerName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                showId: id,
                seats: selectedSeats,
                numberOfTickets: selectedSeats.length,
                totalAmount,
                bookingStatus: "Confirmed",
            });

            navigate("/bookings", {
                state: {
                    bookingSuccess: true,
                },
            });
        } catch (error) {
            console.error("Failed to create booking:", error);
            setError("Failed to create booking.");
        }
    };

    if (!show) {
        return (
            <p className="mt-40 text-center text-blue-500">
                Loading...
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24 max-w-7xl mx-auto">
            <div className="mt-4 mb-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-lg bg-gray-500 px-5 py-3 text-white"
                >
                    Back
                </button>
            </div>
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Booking
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-600">
                        {error}
                    </p>
                )}



                <div className="mb-6 rounded-lg bg-gray-100 p-4">

                    <p>
                        <strong>Movie:</strong> {movie?.name || "N/A"}
                    </p>

                    <p>
                        <strong>Theatre:</strong> {theatre?.name || "N/A"}
                    </p>

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
                        <strong>Selected Seats:</strong>{" "}
                        {selectedSeats.join(", ")}
                    </p>

                    <p className="mt-2 text-xl font-bold">
                        Total Amount: ₹{totalAmount}
                    </p>

                </div>
                {/* Booking Summary */}
                <div className="mb-6 rounded-lg bg-gray-100 p-4">
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
                        <strong>Selected Seats:</strong>{" "}
                        {selectedSeats.join(", ")}
                    </p>

                    <p className="mt-2 text-xl font-bold">
                        Total Amount: ₹{totalAmount}
                    </p>
                </div>

                {/* Customer Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="mb-1 block font-medium">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(e.target.value)
                            }
                            className="w-full rounded border p-3"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full rounded border p-3"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Phone
                        </label>

                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value.replace(/\D/g, ""))
                            }
                            maxLength={10}

                            className="w-full rounded border p-3"
                            placeholder="Enter 10-digit phone number"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                        >
                            Confirm Booking
                        </button>


                    </div>

                </form>
            </div>
        </div>
    );
}

export default Booking;