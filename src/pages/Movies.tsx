import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import api from "../services/api";
import { Link } from "react-router-dom";

function Movies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [language, setLanguage] = useState("");
    const [sortBy, setSortBy] = useState("");
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get<Movie[]>("/movies");
                setMovies(response.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // delete functions
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are sure do you want to delete this movie?"
        );
        if (!confirmDelete) return;
        try {
            await api.delete(`/movies/${id}`);
            setMovies((prevMovies) =>
                prevMovies.filter((movie) => movie.id! == id)
            );
        } catch (error) {
            console.error("Failed to delete movie:", error);
        }
    };


    if (loading) {
        return <p className="text-center mt-40 p-6 text-blue-500">Loading...</p>
    }
    const genres = [...new Set(movies.map((movie) => movie.genre))];
    const languages = [...new Set(movies.map((movie) => movie.language))];

    const filteredMovies = movies
        .filter((movie) =>
            movie.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((movie) =>
            genre ? movie.genre === genre : true
        )
        .filter((movie) =>
            language ? movie.language === language : true
        )
        .sort((a, b) => {
            if (sortBy === "rating") {
                return Number(b.rating) - Number(a.rating);
            }

            if (sortBy === "releaseDate") {
                return (
                    new Date(b.releaseDate).getTime() -
                    new Date(a.releaseDate).getTime()
                );
            }

            return 0;
        });
    return (
        <div className="min-h-screen mt-20  bg-gray-100 p-6 mx-auto max-w-7xl">

            <div className="  ">
                <h1 className="text-3xl font-bold text-center py-4">Movies</h1>

                <div className="mb-6 lg:flex items-center lg:justify-between">
                    <div className="mb-6 grid gap-4 md:grid-cols-4 mt-4 lg:mt-0 px-4 lg:px-2">
                        <input
                            type="text"
                            placeholder="Search movie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-lg border bg-white p-3"
                        />

                        <select
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="rounded-lg border bg-white p-3"
                        >
                            <option value="">All Genres</option>

                            {genres.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-lg border bg-white p-3"
                        >
                            <option value="">All Languages</option>

                            {languages.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-lg border bg-white p-3"
                        >
                            <option value="">Sort By</option>
                            <option value="rating">Rating</option>
                            <option value="releaseDate">Release Date</option>
                        </select>
                    </div>
                    <Link to="/movies/add"
                        className="rounded-lg flex mx-auto justify-center items-center w-fit bg-blue-600 p-3 lg:-mt-4 text-center text-white"
                    >
                        + Add Movie

                    </Link>

                </div>
                {filteredMovies.length === 0 ? (
                    <div className="rounded-lg bg-white p-10 text-center shadow">
                        No Movies Available.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className="overflow-hidden rounded-xl bg-white shadow"
                            >
                                <img
                                    src={movie.poster}
                                    alt={movie.name}
                                    className="h-72 w-full object-cover"
                                />
                                <div className="p-5">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">{movie.name}</h2>
                                        <Link
                                            to={`/movies/${movie.id}`}
                                            className="mt-4 inline-block rounded-lg text-blue-600 px-4 py-2 underline"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                    <span>⭐ {movie.rating}</span>

                                    <p className="mt-2 text-gray-500">
                                        {movie.genre} . {movie.language}
                                    </p>
                                    <p className="mt-1 text-gray-500">
                                        {movie.duration}
                                    </p>
                                    <p className="mt-3">
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
                                            {movie.status}
                                        </span>
                                    </p>
                                    <div>
                                        <div className="mt-4 flex gap-2">
                                            <Link
                                                to={`/movies/${movie.id}/edit`}
                                                className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(movie.id)}
                                                className="rounded-lg bg-red-600 px-4 py-2 text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))

                        }

                    </div>
                )}
            </div>

        </div>

    )
}
export default Movies; 