import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";


type Movie = {
    id: string;
    name: string;
};

type Theatre = {
    id: string;
    name: string;
};

function EditShow() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        movieId: "",
        theatreId: "",
        screen: "",
        date: "",
        showTime: "",
        ticketPrice: "",
        availableSeats: "",

    });

    const [movies, setMovies] = useState<Movie[]>([]);
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const showResponse = await api.get(`/shows/${id}`);
                const show = showResponse.data;
                setFormData({
                    movieId: show.movieId,
                    theatreId: show.theatreID,
                    screen: show.screen,
                    date: show.date,
                    showTime: show.showTime,
                    ticketPrice: (String(show.ticketPrice)),
                    availableSeats: (String(show.availableSeats)),

                });

                const movieResponse = await api.get<Movie[]>("/movies");
                setMovies(movieResponse.data);

                const theatreResponse = await api.get<Theatre[]>("/theatres");
                setTheatres(theatreResponse.data);

            } catch (error) {
                console.error(error);

                setError("Failed to Load Show")
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !formData.movieId ||
            !formData.theatreId ||
            !formData.screen ||
            !formData.date ||
            !formData.showTime ||
            !formData.ticketPrice ||
            !formData.availableSeats
        ) {
            setError("please fill in all fields.");
            return;
        }
        try {
            setLoading(true);
            setError("");

            await api.put(`/shows/${id}`, {
                ...formData,
                ticketPrice: Number(formData.ticketPrice),
                availableSeats: Number(formData.availableSeats),
            });

            navigate("/shows");
        } catch (error) {
            console.error("Failed to update show:", error);

            setError("Failed to update show.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen mt-20 bg-gray-100 p-6 max-w-7xl mx-auto">

            <div className="py-2">
                <button
                    type="button"
                    onClick={() => navigate("/shows")}
                    className="rounded-lg bg-gray-500 px-5 py-3 text-white"
                >
                    Back
                </button>
            </div>
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Edit Show
                </h1>

                {error && (
                    <p className="mb-4 rounded bg-red-100 p-3 text-red-600">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-center text-blue-500">
                        Loading...
                    </p>
                ) : (
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
                                className="w-full rounded border p-3"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between items-center gap-4 pt-">
                            <div className="flex gap-4 ">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                                >
                                    Update Show
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/shows")}
                                    className="rounded-lg bg-gray-500 px-5 py-3 text-white"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>

                    </form>
                )}
            </div>
        </div>
    );
}

export default EditShow;