import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

type Movie = {
    id: string;
    name: string;
};

type Theatre = {
    id: string;
    name: string;
};

function AddShow() {
    const navigate = useNavigate();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [theatres, setTheatres] = useState<Theatre[]>([]);

    const [formData, setFormData] = useState({
        movieId: "",
        theatreId: "",
        screen: "",
        date: "",
        showTime: "",
        ticketPrice: "",
        availableSeats: "",
    });

    const [error, setError] = useState("");

    // Fetch Movies and Theatres
    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieResponse = await api.get<Movie[]>("/movies");
                setMovies(movieResponse.data);

                const theatreResponse = await api.get<Theatre[]>("/theatres");
                setTheatres(theatreResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("Failed to load movies or theatres.");
            }
        };

        fetchData();
    }, []);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Add Show clicked");

        if (
            !formData.movieId ||
            !formData.theatreId ||
            !formData.screen ||
            !formData.date ||
            !formData.showTime ||
            !formData.ticketPrice ||
            !formData.availableSeats
        ) {
            setError("Please fill in all fields.");
            return;
        }


        try {
            console.log("Sending API request...");

            await api.post("/shows", {
                ...formData,
                ticketPrice: Number(formData.ticketPrice),
                availableSeats: Number(formData.availableSeats),
            });

            navigate("/shows");
        } catch (error) {
            console.error("Failed to add show:", error);
            setError("Failed to add show.");
        }
    };

    return (
        <div className="min-h-screen mt-20 bg-gray-100 p-6">
            <div className="px-4 py-4">
                <button
                    type="button"
                    onClick={() => navigate("/shows")}
                    className="rounded-lg  bg-gray-500 px-5 py-2 text-white"
                >
                    Back
                </button>
            </div>
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Add Show
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-600">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Movie */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Movie
                        </label>

                        <select
                            name="movieId"
                            value={formData.movieId}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                        >
                            <option value="">Select Movie</option>

                            {movies.map((movie) => (
                                <option key={movie.id} value={movie.id}>
                                    {movie.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Theatre */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Theatre
                        </label>

                        <select
                            name="theatreId"
                            value={formData.theatreId}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                        >
                            <option value="">Select Theatre</option>

                            {theatres.map((theatre) => (
                                <option key={theatre.id} value={theatre.id}>
                                    {theatre.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Screen */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Screen
                        </label>

                        <input
                            type="text"
                            name="screen"
                            value={formData.screen}
                            onChange={handleChange}
                            placeholder="Enter screen name"
                            className="w-full rounded border p-3"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Date
                        </label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                        />
                    </div>

                    {/* Show Time */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Show Time
                        </label>

                        <input
                            type="time"
                            name="showTime"
                            value={formData.showTime}
                            onChange={handleChange}
                            className="w-full rounded border p-3"
                        />
                    </div>

                    {/* Ticket Price */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Ticket Price
                        </label>

                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleChange}
                            placeholder="Enter ticket price"
                            className="w-full rounded border p-3"
                        />
                    </div>

                    {/* Available Seats */}
                    <div>
                        <label className="mb-1 block font-medium">
                            Available Seats
                        </label>

                        <input
                            type="number"
                            name="availableSeats"
                            value={formData.availableSeats}
                            onChange={handleChange}
                            placeholder="Enter available seats"
                            className="w-full rounded border p-3"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                        >
                            Add Show
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/shows")}
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

export default AddShow;