// const { GOOGLE_MAPS_API_KEY: key } = import.meta.env;
/* Declare and initialize global variables */
const search = document.querySelector(".search");
search.addEventListener("click", () => {
    getJobs();
})
/* async getJobs Function using fetch()*/
async function getJobs() {
    const skillInput = document.querySelector("#searchSkill");
    const countryInput = document.querySelector("#searchLocation");
    const typeInput = document.querySelector("#searchType");

    if (!skillInput) {
        console.error("Form elements not found. Please check your HTML.");
        return;
    }

    const skill = skillInput.value.trim();
    const country = countryInput.value.trim();
    let type = typeInput.value.trim();
    if (type = "True") {
        type = true;
    }


    if (!skill) {
        alert("Please fill in skill fields.");
        return;
    }

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(skill)}&page=1&num_pages=1&country=${encodeURIComponent(country)}&date_posted=all&work_from_home=${encodeURIComponent(type)})`;
    // const url = `https://jsearch.p.rapidapi.com/estimated-salary?job_title=${encodeURIComponent(skill)}&location=${encodeURIComponent(country }&location_type=${encodeURIComponent(type || "ANY")}&years_of_experience=ALL`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'c72daf91e1msh92c85f15c8eedf9p1c3948jsn14f967bd0034',
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        displayJobs(result); // Display jobs function to show results to users
    } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to fetch jobs. Please try again later.");
    }
}


function displayJobs(data) {
    const jobsContainer = document.querySelector(".jobs");
    if (!jobsContainer) {
        console.error("Results container not found. Please check your HTML.");
        return;
    }

    jobsContainer.innerHTML = ""; // Clear previous results
    if (data && data.data && data.data.length > 0) {
        data.data.forEach(job => {
            const jobElement = document.createElement("div");
            jobElement.classList.add("job-item");

            let latitude = job.job_latitude;
            let longitude = job.job_longitude;
            let companyName = job.employer_name;

            const mapButton = document.createElement("button");
            mapButton.classList.add("map");
            mapButton.textContent = "View on Map";

            // Add event listener for the button
            mapButton.addEventListener("click", () => {
                openModal(latitude, longitude, companyName);
            });
            // const jobId = job.job_id;
            jobElement.innerHTML = `
                <h1>${job.job_title}</h1>
                <h2>${job.employer_name || "No employer name available."}</h2>
                <p>${job.job_publisher || "No information available."}</p>
                <p>${job.job_employment_type || "No information available."}</p>
                <p>${job.job_country || "No information available."}</p>
                <p>${job.job_latitude || "No information available."}</p>
                <p>${job.job_longitude || "No information available."}</p>
                <a href="${job.job_apply_link}" target="_blank">Apply Here</a>
            `;
            jobElement.appendChild(mapButton);
            jobsContainer.appendChild(jobElement);
        });
    } else {
        jobsContainer.innerHTML = "<p>No jobs found for the given criteria.</p>";
    }
}
// Google Maps API Key (Replace with your key if using Google Maps)
//Hide the API Key. When needed,remarked line 8, and then tha code would work.
const GOOGLE_MAPS_API_KEY = 'AIzaSyC_C9ING3B6KFDr2hTZn9yCoIbRR0npCUw';

// Get references to elements
const mapModal = document.getElementById("mapModal");
const closeButton = document.querySelector(".close-button");
const mapContainer = document.getElementById("mapContainer");

// Function to open the modal
function openModal(latitude, longitude, companyName) {
    const mapUrl = generateMapUrl(latitude, longitude, companyName);
    mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="${mapUrl}" allowfullscreen></iframe>`;
    mapModal.style.display = "flex";
}

// Function to close the modal
function closeModal() {
    mapModal.style.display = "none";
    mapContainer.innerHTML = ""; // Clear the iframe content
}

// Event listeners
closeButton.addEventListener("click", closeModal);

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === mapModal) {
        closeModal();
    }
});
// Function to initialize the map
function generateMapUrl(latitude, longitude, companyName) {
    // Embed Google Maps with the user's location
    const mapUrl = `https://www.google.com/maps/embed/v1/www.google.com/maps/embed/v1/search?q=${companyName}&key=${GOOGLE_MAPS_API_KEY}&center=${latitude || "ANY"},${longitude || "ANY"}&zoom=15`;
    return mapUrl;
}

