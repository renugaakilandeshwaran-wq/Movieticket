import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import api from "../services/api";


function Dashboard() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalBookings, setTotalBookings] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            const movieResponse = await api.get<Movie[]>("/movies");
            const bookingResponse = await api.get("/bookings");

            setMovies(movieResponse.data);
            setTotalBookings(bookingResponse.data.length);
        };

        fetchData();
    }, []);


    const nowshowing = movies.filter(
        (movie) => movie.status === "Now Showing"
    ).length;

    const UpcomingMovies = movies.filter(
        (movie) => movie.status === "Upcoming"
    ).length;

    return (
        <div className="grid max-w-7xl mx-auto mt-50 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 lg:px-2   ">
            <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-500 text-xl">Total Movies</p>
                <h2 className="font-bold text-3xl">{movies.length}</h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-500 text-xl">Now Showing</p>
                <h2 className="text-3xl font-bold mt-2">{nowshowing}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-xl text-gray-500">Upcoming Movies</p>
                <h2 className="text-3xl font-bold mt-2">{UpcomingMovies}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-xl text-gray-500">Total Bookings</p>
                <h2 className="text-3xl font-bold mt-2">{totalBookings}</h2>
            </div>
        </div>
    );
}
export default Dashboard;









