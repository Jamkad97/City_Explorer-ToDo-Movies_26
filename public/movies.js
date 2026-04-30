console.log("movies.js loaded");

const form = document.getElementById("movieForm");
const input = document.getElementById("movieInput");
const resultsElement = document.getElementById("results");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = input.value.trim();

    if (!search) {
        alert("Movie title is required");
        return;
    }

    try {
        resultsElement.style.display = "block";
        resultsElement.innerHTML = `
            <div class="flex item-center justify-center p-10">
                <i class="fas fa-spinner fa-spin text-4xl mr-4"></i>
                <p class="text-2xl">Loading movies...</p>
            </div>
        `;

        const response = await fetch(`/movies?search=${search}`);
        const data = await response.json();

        const movies = data.movieData;

        // Build the results section
        resultsElement.innerHTML = `
            <h2 id="movieTitle" class="text-xl font-medium mb-5"></h2>
            <div id="moviesParent">
                <div id="moviesSection" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
            </div>
        `;

        const movieTitleEl = document.getElementById("movieTitle");
        movieTitleEl.textContent = `Results for "${search}"`;

        const moviesSectionEl = document.getElementById("moviesSection");

        const posterBase = "https://media.themoviedb.org/t/p/w300_and_h450_face";

        movies.forEach(movie => {
            const poster = movie.poster_path
                ? `${posterBase}${movie.poster_path}`
                : "https://placehold.co/300x450?text=No+Image";

            const card = `
                <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition transform hover:-translate-y-1">
                    <img src="${poster}" alt="${movie.title}" class="w-full h-72 object-cover">
                        <div class="p-4">
                        <h4 class="font-semibold mb-2">${movie.title}</h4>
                        <p class="text-sm text-gray-600 mb-1">${movie.release_date || "Unknown release date"}</p>
                        <p class="text-sm text-gray-600 mb-1"><strong>Genres:</strong> ${movie.genres || "N/A"}</p>
                        <p class="text-sm text-gray-700">${movie.overview || "No description available."}</p>
                </div>
            </div>
        `;

            moviesSectionEl.insertAdjacentHTML("beforeend", card);
        });

    } catch (error) {
        console.error("Error getting movie data:", error);

        resultsElement.innerHTML = `
            <div class="bg-red-200 border border-red-400 text-red-800 rounded-lg p-5 mt-5">
                <h3 class="font-semibold mb-2">Error!</h3>
                <p>Failed to fetch movie data. Please try again later.</p>
                <p class="text-sm mt-2 text-red-700">${error.message}</p>
            </div>
        `;
    }
});