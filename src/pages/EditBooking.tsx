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

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await api.get<Booking>(
                    `/bookings/${id}`
                );

                const data = response.data;

                setBooking(data);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.customerName ||
            !formData.email ||
            !formData.phone
        ) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await api.put(`/bookings/${id}`, {
                ...booking,
                ...formData,
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
                            onChange={handleChange}
                            className="w-full rounded border p-3"
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
                        <p>
                            <strong>Seats:</strong>{" "}
                            {booking.seats.join(", ")}
                        </p>

                        <p>
                            <strong>Tickets:</strong>{" "}
                            {booking.numberOfTickets}
                        </p>

                        <p>
                            <strong>Total:</strong> ₹
                            {booking.totalAmount}
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