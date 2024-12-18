// const { VITE_JSEARCH_KEY: jsKey } = import.meta.env;
let jobs = [];  // global variables
let jsKey = "AIzaSyDy7cLklRcBVgQPW9k16qD7A9mGY8G_7c4";
// 1. loading saved favorites in localStorage
const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];
const favoritesContainer = document.querySelector(".favoriteContainer");

// 2. check if there is any saved job-id
if (favoriteIds.length === 0) {
    favoritesContainer.innerHTML = "<p>You have no favorite jobs yet!</p>";
} else {
    // 3. Check if I've already fetched the job data
    const cachedJobs = JSON.parse(localStorage.getItem("cachedJobs")) || [];
    if (cachedJobs.length > 0) {
        renderFavoriteJobs(cachedJobs, favoriteIds);  // Pass both jobs and favoriteIds
    } else {
        // 3. call API to fetch job information
        const url = `https://jsearch.p.rapidapi.com/job-details?job_id=${favoriteIds.join(',')}&country=all`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': jsKey,
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        };

        fetch(url, options) // API URL
            .then(response => response.json())
            .then(data => {
                jobs = data.data || []; //define global variables
                console.log("Fetched data:", data);

                if (!Array.isArray(jobs)) {
                    throw new Error("Expected 'jobs' to be an array");
                }

                // Cache the jobs data to avoid redundant API calls
                localStorage.setItem('cachedJobs', JSON.stringify(jobs));

                renderFavoriteJobs(jobs, favoriteIds);  // Pass both jobs and favoriteIds
            })
            .catch(error => {
                console.error("Error fetching jobs data:", error);
                favoritesContainer.innerHTML = "<p>Failed to load your favorite jobs. Please try again later.</p>";
            });
    }
}

function renderFavoriteJobs(jobs, favoriteIds) {
    favoritesContainer.innerHTML = "";  // clear the text

    // filter favorite job from jobs array based on favoriteIds
    const favoriteJobs = jobs.filter(job => favoriteIds.includes(job.job_id)); // filter based on favoriteIds
    // if favoriteJobs stores in the localstorage, render the page.
    if (favoriteJobs.length > 0) {
        favoriteJobs.forEach(job => {
            const jobElement = document.createElement("div");
            jobElement.classList.add("job-item");
            jobElement.innerHTML = `
                    <div class="employer-logo">
                        <a href="${job.employer_website || '#'}" target="_blank"><img src="${job.employer_logo || ''}" alt="${job.employer_name || 'Employer Logo'}" loading="lazy" width="60" height="60"></a>
                        <h1>${job.job_title || 'No job title available.'}</h1>
                    </div>
                    <h2>${job.employer_name || 'No employer name available.'}</h2>
                    <p>Publisher: ${job.job_publisher || "No information available."}</p>
                    <p>Type: ${job.job_employment_type || "No information available."}</p>
                    <p>Country: ${job.job_country || "No information available."}</p>
                    <p><a href="${job.job_apply_link}" target="_blank">Apply Here</a></p>
                    <p><a href = "${job.job_apply_link}" target = "_blank" >Job Detail</a ></p>`;
            const removeButton = document.createElement("button");
            removeButton.classList.add("removeBtn");
            removeButton.textContent = "Remove";
            removeButton.setAttribute("data-job-id", job.job_id); // Set the job id for the remove button
            jobElement.appendChild(removeButton);
            favoritesContainer.appendChild(jobElement);
        });
    } else {
        favoritesContainer.innerHTML = "<p>No matching favorite jobs found!</p>";
    }
}


// Event delegation to handle remove button click
favoritesContainer.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("removeBtn")) {
        const jobIdToRemove = event.target.getAttribute("data-job-id");
        removeJobFromFavorites(jobIdToRemove);
    }
});

// Remove a job from the favorites list
function removeJobFromFavorites(jobIdToRemove) {
    // Remove job_id from favoriteIds array 
    const updatedFavorites = favoriteIds.filter(jobId => jobId !== jobIdToRemove);

    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    // Update cached jobs in localStorage
    const cachedJobs = JSON.parse(localStorage.getItem('cachedJobs'));
    const updatedJobs = cachedJobs.filter(job => updatedFavorites.includes(job.job_id));
    localStorage.setItem('cachedJobs', JSON.stringify(updatedJobs));

    // Re-render the favorite jobs page
    renderFavoriteJobs(updatedJobs, updatedFavorites);
}
