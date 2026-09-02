import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 fixed top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <Link to="/" className="lg:text-2xl font-bold ">
                    🎬 MTBS
                </Link>

                <div className="flex lg:gap-6 gap-2">
                    <Link to="/" className="hover:text-blue-400 text-sm lg:text-xl">
                        Dashboard
                    </Link>

                    <Link to="/movies" className="hover:text-blue-400 text-sm lg:text-xl">
                        Movies
                    </Link>

                    <Link to="/shows" className="hover:text-blue-400 text-sm lg:text-xl">
                        Shows
                    </Link>

                    <Link to="/bookings" className="hover:text-blue-400 text-sm lg:text-xl">
                        Bookings
                    </Link>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;