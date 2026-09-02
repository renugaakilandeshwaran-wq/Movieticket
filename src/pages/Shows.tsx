import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

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

function Shows() {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [theatreFilter, setTheatreFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("");
    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await api.get<Show[]>("/shows");
                setShows(response.data);
            } catch (error) {
                console.error("Error fetching shows:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, []);

    if (loading) {
        return (
            <p className="mt-40 text-center text-blue-500">
                Loading...
            </p>
        );
    }

    // delete functions

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this show?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/shows/${id}`);

            setShows((prevShows) =>
                prevShows.filter((show) => show.id !== id)
            );
        } catch (error) {
            console.error("Failed to delete show:", error);
        }
    };
    const filteredShows = shows
        .filter((show) =>
            theatreFilter ? show.theatreId === theatreFilter : true
        )
        .filter((show) =>
            dateFilter ? show.date === dateFilter : true
        )
        .filter((show) =>
            timeFilter ? show.showTime === timeFilter : true
        );
    return (
        <div className="min-h-screen bg-gray-100 p-6 mt-20">
            <div className="mx-auto max-w-7xl">

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        Shows
                    </h1>

                    <Link
                        to="/shows/add"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                        + Add Show
                    </Link>
                </div>
                <div className="mb-6 grid gap-4 md:grid-cols-3">

                    <select
                        value={theatreFilter}
                        onChange={(e) => setTheatreFilter(e.target.value)}
                        className="rounded-lg border bg-white p-3"
                    >
                        <option value="">All Theatres</option>

                        <option value="1">PVR Cinemas</option>
                        <option value="2">INOX</option>
                        <option value="3">AGS Cinemas</option>
                    </select>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="rounded-lg border bg-white p-3"
                    />

                    <input
                        type="time"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="rounded-lg border bg-white p-3"
                    />

                </div>
                {filteredShows.length === 0 ? (
                    <div className="rounded-lg bg-white p-10 text-center shadow">
                        No Shows Available.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredShows.map((show) => (
                            <div
                                key={show.id}
                                className="rounded-xl bg-white p-5 shadow"
                            >
                                <h2 className="text-xl font-bold">
                                    Movie ID: {show.movieId}
                                </h2>

                                <p className="mt-2">
                                    Theatre ID: {show.theatreId}
                                </p>

                                <p>
                                    Screen: {show.screen}
                                </p>

                                <p>
                                    Date: {show.date}
                                </p>

                                <p>
                                    Show Time: {show.showTime}
                                </p>

                                <p>
                                    Ticket Price: ₹{show.ticketPrice}
                                </p>

                                <p>
                                    Available Seats: {show.availableSeats}
                                </p>
                                <div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <Link
                                                to={`/shows/${show.id}/seats`}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                                            >
                                                Select Seats
                                            </Link>

                                            <Link
                                                to={`/shows/${show.id}/edit`}
                                                className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(show.id)}
                                                className="rounded-lg bg-red-600 px-4 py-2 text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Shows;