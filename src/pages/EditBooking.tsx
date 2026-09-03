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

type BookingItem = {
    id: string;
    showId: string;
    seats: number[];
    bookingStatus: string;

};

type Show = {
    id: string;
    movieId: string;
    theatreId: string;
    screen: string;
    date: string;
    showTime: string;
    ticketPrice: number;
};

function EditBooking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        phone: "",
        bookingStatus: "Confirmed",
    });

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookedSeats, setBookedSeats] = useState<number[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [show, setShow] = useState<Show | null>(null);
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await api.get<Booking>(
                    `/bookings/${id}`
                );

                const data = response.data;

                setBooking(data);
                setSelectedSeats(data.seats);

                const bookingsResponse = await api.get<BookingItem[]>(
                    `/bookings?showId=${data.showId}`
                );

                const otherBookedSeats = bookingsResponse.data
                    .filter(
                        (item) =>
                            item.id !== data.id &&
                            item.bookingStatus === "Confirmed"
                    )
                    .flatMap((item) => item.seats);

                setBookedSeats(otherBookedSeats);

                const showResponse = await api.get<Show>(
                    `/shows/${data.showId}`
                );
                setShow(showResponse.data);
                setFormData({
                    customerName: data.customerName,
                    email: data.email,
                    phone: data.phone,
                    bookingStatus: data.bookingStatus,
                });
            } catch (error) {
                console.error("Failed to fetch booking:", error);
                setError("Failed to load booking.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };
    const handleSeatClick = (seatNumber: number) => {
        if (bookedSeats.includes(seatNumber)) {
            return;
        }

        setSelectedSeats((prev) =>
            prev.includes(seatNumber)
                ? prev.filter((seat) => seat !== seatNumber)
                : [...prev, seatNumber]
        );
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (
            !formData.customerName ||
            !formData.email ||
            !formData.phone
        ) {
            setError("Please fill in all fields.");
            return;
        }
        if (selectedSeats.length === 0) {
            setError("Please select at least one seat.");
            return;
        }


        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        const phonePattern = /^[0-9]{10}$/;

        if (!phonePattern.test(formData.phone)) {
            setError("Phone number must contain exactly 10 digits.");
            return;
        }

        try {
            await api.put(`/bookings/${id}`, {
                ...booking,
                ...formData,
                seats: selectedSeats,
                numberOfTickets: selectedSeats.length,
                totalAmount: selectedSeats.length * (show?.ticketPrice || 0),
            });

            navigate("/bookings");
        } catch (error) {
            console.error("Failed to update booking:", error);
            setError("Failed to update booking.");
        }
    };

    if (loading) {
        return (
            <p className="mt-40 text-center text-blue-500">
                Loading...
            </p>
        );
    }

    if (!booking) {
        return (
            <p className="mt-40 text-center text-red-500">
                Booking not found.
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Edit Booking
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-600">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="mb-1 block font-medium">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            maxLength={10}
                            className="w-full rounded border p-3"
                            placeholder="Enter 10-digit phone number"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            Booking Status
                        </label>

                        <select
                            name="bookingStatus"
                            value={formData.bookingStatus}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                        >
                            <option value="Confirmed">
                                Confirmed
                            </option>
                            <option value="Cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>

                    <div className="rounded-lg bg-gray-100 p-4">
                        <p className="mb-3 font-semibold">
                            Select Seats:
                        </p>

                        <div className="grid grid-cols-5 gap-3 sm:grid-cols-8">
                            {Array.from({ length: 40 }, (_, index) => index + 1).map(
                                (seat) => {
                                    const isBooked = bookedSeats.includes(seat);
                                    const isSelected = selectedSeats.includes(seat);

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
                                                    : "bg-white hover:bg-blue-100"
                                                }`}
                                        >
                                            {seat}
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        <p className="mt-4">
                            <strong>Selected Seats:</strong>{" "}
                            {selectedSeats.join(", ")}
                        </p>

                        <p>
                            <strong>Number of Tickets:</strong>{" "}
                            {selectedSeats.length}
                        </p>

                        <p className="mt-2 text-lg font-bold">
                            Total: ₹{show ? selectedSeats.length * show.ticketPrice : 0}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                        >
                            Update Booking
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/bookings")}
                            className="rounded-lg bg-gray-500 px-5 py-3 text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBooking;