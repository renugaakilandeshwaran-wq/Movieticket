import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AddMovie() {
    // form data states

    const [formData, setFormData] = useState({
        name: "",
        poster: "",
        genre: "",
        language: "",
        duration: "",
        releaseDate: "",
        rating: "",
        status: "",
        description: "",

    });
    const [error, setError] = useState("");


    // navigate

    const navigate = useNavigate();
    // input change function

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    // submit function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !formData.name ||
            !formData.poster ||
            !formData.genre ||
            !formData.language ||
            !formData.duration ||
            !formData.releaseDate ||
            !formData.rating ||
            !formData.status ||
            !formData.description
        ) {
            setError("Please fill in all fields.");

            return;
        }
        try {
            await api.post("/movies", {
                ...formData,
                rating: Number(formData.rating),
            });
            navigate("/movies");
        } catch (error) {
            setError("Failed to Add Movie.");
            console.error(error);
        }
    };
    return (
        <div className="bg-gray-100 mt-30 max-w-7xl mx-auto ">
            <div className="px-4 py-4">
                <button
                    type="button"
                    onClick={() => navigate("/movies")}
                    className="rounded-lg  bg-gray-500 px-5 py-2 text-white"
                >
                    Back
                </button>
            </div>
            <h1 className="text-center text-3xl font-bold py-4">Add Movies </h1>


            <form onSubmit={handleSubmit}>
                <div className="bg-white max-w-4xl mx-auto px-4 py-4">
                    <input type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter movie name"
                        className="w-full border p-3 rounded mb-4"

                    />
                    <input type="text"
                        name="poster"
                        value={formData.poster}
                        onChange={handleChange}
                        className="w-full border p-3 rounded mb-4"

                        placeholder="Enter poster "
                    />
                    <input type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        placeholder="Enter genre "
                        className="w-full border p-3 rounded mb-4"

                    />


                    <select
                        className="w-full border p-3 rounded mb-4"

                        value={formData.language}
                        onChange={handleChange}
                        name="language"
                    >
                        <option value="">Select Language</option>
                        <option value="Tamil">Tamil</option>
                        <option value="English">English</option>
                        <option value="Thelugu">Thelugu</option>
                        <option value="Malayalam">Malayalam</option>
                        <option value="Kannadam">Kannadam</option>
                        <option value="Kannadam">Hindi</option>

                    </select>
                    <div>
                        <label htmlFor="">Enter  Duration</label>

                        <input

                            className="w-full border p-3 rounded mb-4"

                            type="time"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Example: 2h 30m"
                        />
                    </div>
                    <input
                        className="w-full border p-3 rounded mb-4"
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleChange}
                        placeholder="Enter movie releasedate... "
                    />
                    {/* <input
                        className="w-full border p-3 rounded mb-4"

                        type="text"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        placeholder="Enter rating... "
                    /> */}
                    {/* <input type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    placeholder="Enter rating... "
                /> */}

                    <select
                        className="w-full border p-3 rounded mb-4"

                        name="status"
                        onChange={handleChange}
                        value={formData.status}
                    >
                        <option value=""> Select status</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Now Showing">Now Showing</option>
                    </select>

                    {/* <input type="text"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Enter rating... "
                /> */}
                    <select
                        className="w-full border p-3 rounded mb-4"

                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                    >
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
                        className="w-full border p-3 rounded mb-4"

                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter movie description"
                    />

                    <button type="submit" className=" flex justify-center text-white bg-blue-500 rounded-full px-4 py-2 mx-auto ">
                        Add Movie
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddMovie;