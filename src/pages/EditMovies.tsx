import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

function EditMovies() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [poster, setPoster] = useState("");
    const [genre, setGenre] = useState("");
    const [language, setLanguage] = useState("");
    const [duration, setDuration] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [rating, setRating] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await api.get(`/movies/${id}`)
                const movie = res.data;
                setName(movie.name);
                setPoster(movie.poster);
                setGenre(movie.genre);
                setLanguage(movie.language);
                setDuration(movie.duration);
                setReleaseDate(movie.releaseDate);
                setRating(String(movie.rating));
                setStatus(movie.status);
                setDescription(movie.description);
            } catch (error) {
                setError("Failed to load movie");
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);


    //  update job details

    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            await api.patch(`/movies/${id}`, {
                name,
                poster,
                genre,
                status,
                description,
                language,
                releaseDate,
                duration,
                rating: Number(rating),
            });
            navigate("/movies")

        } catch (error) {
            setError("Failed to update movie")
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <p className="text-center mt-50 text-blue-500">Loading...</p>
        );
    }
    if (error) {
        return (
            <p className="text-red-500 text-center mt-50">{error}</p>
        );
    }
    return (
        <div className="max-w-4xl mx-auto mt-10 bg-gray-100 px-4 py-1">

            <div>

                <h1 className="mt-10 mb-10 text-center mx-auto bg-green-200 px-4 py-2 shadow-lg rounded-full w-fit  ">EDIT Movie</h1>

                <button
                    type="button"
                    onClick={() => navigate("/movies")}
                    className="mb-5  bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                    ← Back
                </button>
            </div>

            <form
                className="space-y-3"
                onSubmit={handlesubmit}
            >
                <input
                    value={name}
                    type="text"
                    className="w-full border p-3 rounded mb-4"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Movie name"
                    required
                />
                <input
                    value={poster}
                    type="text"
                    className="w-full border p-3 rounded mb-4"
                    onChange={(e) => setPoster(e.target.value)}
                    placeholder="Movie Poster"
                    required
                />

                <input
                    value={genre}
                    type="text"
                    className="w-full border p-3 rounded mb-4"
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Enter Genre"
                    required
                />
                <div >

                    <label htmlFor="">Release Date</label>
                    <input

                        value={releaseDate}
                        type="text"
                        className="w-full border p-3 rounded mb-4"
                        onChange={(e) => setReleaseDate(e.target.value)}
                        placeholder="Enter Release Date"
                        required
                    />
                </div>
                <select
                    className="w-full border p-3 rounded mb-4"

                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Select Status</option>
                    <option value="Now Showing">Now Showing</option>
                    <option value="Upcoming">Upcoming</option>
                </select>

                <select
                    className="w-full border p-3 rounded mb-4"

                    onChange={(e) => setLanguage(e.target.value)}
                    value={language}
                >
                    <option value="">Select Language</option>
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Thelugu">Thelugu</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Kannadam">Kannadam</option>
                    <option value="Kannadam">Hindi</option>

                </select>
                <select
                    className="w-full border p-3 rounded mb-4"

                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                >
                    <option value="">Select Rating</option>
                    <option value="">Select Rating</option>
                    <option value="1">1 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="5">5 ⭐</option>
                    <option value="6">6 ⭐</option>
                    <option value="7">7 ⭐</option>
                    <option value="8">8 ⭐</option>
                    <option value="9">9 ⭐</option>
                    <option value="10">10 ⭐</option>

                </select>
                <textarea
                    rows={3}
                    className="w-full border p-3 rounded mb-4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                >
                </textarea>
                {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                )}
                <button
                    type="submit"

                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded"
                >
                    {loading ? "Editing..." : "Update Movie"}

                </button>
            </form>
        </div>
    )
}
export default EditMovies;