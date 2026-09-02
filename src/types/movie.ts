export type Movie = {
    id: string;
    name: string;
    poster: string;
    genre: string;
    language: string;
    duration: string;
    releaseDate: string;
    rating: number;
    status: "Now Showing" | "Upcoming";
    description: string;
};