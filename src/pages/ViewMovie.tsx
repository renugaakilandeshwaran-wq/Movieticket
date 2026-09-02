import type { Movie } from "../types/movie";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
function ViewMovie() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await api.get<Movie>(`/movies/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error("Error fetching movie:", error)
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();

    }, [id]);

    if (loading) {
        return (

            <p className="text-center mt-50 text-blue-500">Loading....</p>
        );
    }
    if (!movie) {
        return (
            <p className="mt-50 text-center text-red-500">
                Movie not found.
            </p>
        )
    }
    return (
        <div className="min-h-screen bg-gray-100 p-6 mt-20 max-w-7xl mx-auto">
            <button
                onClick={() => navigate("/movies")}
                className="mb-6 rounded-lg bg-gray-300 px-4 py-2 "
            >
                ← Back
            </button>
            <h1 className="text-3xl  text-center text-blue-900 font-bold uppercase">Movie Details</h1>


            <div className=" grid  lg:grid-cols-[3fr_2fr]  lg:justify-center  gap-10 items-center  md:grid-cols-2">

                <img
                    src={movie.poster}
                    alt={movie.name}
                    className="h-[400px] w-full mt-4 rounded-lg object-cover"
                />

                <div>
                    <h1 className="text-3xl font-bold">
                        {movie.name}
                    </h1>

                    <p className="mt-4">
                        <strong>Genre:</strong> {movie.genre}
                    </p>

                    <p className="mt-3">
                        <strong>Language:</strong> {movie.language}
                    </p>

                    <p className="mt-3">
                        <strong>Duration:</strong> {movie.duration}
                    </p>

                    <p className="mt-3">
                        <strong>Release Date:</strong> {movie.releaseDate}
                    </p>

                    <p className="mt-3">
                        <strong>Rating:</strong> ⭐ {movie.rating}
                    </p>

                    <p className="mt-3">
                        <strong>Status:</strong> {movie.status}
                    </p>

                    <div className="mt-5">
                        <h2 className="text-xl font-bold">
                            Description
                        </h2>

                        <p className="mt-2 text-gray-600">
                            {movie.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ViewMovie;
