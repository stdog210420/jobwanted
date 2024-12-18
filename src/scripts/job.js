// const { VITE_GOOGLE_MAPS_API_KEY: key } = import.meta.env;
let key = "AIzaSyDy7cLklRcBVgQPW9k16qD7A9mGY8G_7c4";
//const { VITE_JSEARCH_KEY: jsKey } = import.meta.env;
let jsKey = "bf693709e5msh4cde3b39db47e80p184a6cjsne43559ba5412";
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
    let type = typeInput.checked; // directly get the check status
    if (type) {
        type = true; // checked
        console.log("Remote selected");
    } else {
        type = false; // not check
        console.log("Not remote");
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
            'x-rapidapi-key': jsKey,
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

            let companyName = job.employer_name;
            let companyState = job.job_state;
            const mapButton = document.createElement("button");
            mapButton.classList.add("mapBtn");
            mapButton.textContent = "View on Map";
            const saveButton = document.createElement("button");
            saveButton.classList.add("saveBtn");
            saveButton.textContent = "Save";
            saveButton.setAttribute("data-job-id", job.job_id); // Add data-job-id attribute
            // const jobId = job.job_id;
            // console.log(job);
            // console.log(job.job_id);
            // console.log(companyName, companyState, jobId);
            // Add event listener for the button
            mapButton.addEventListener("click", () => {
                jobElement.classList.add("jobMap");
                const jobMap = document.querySelector(".jobMap");
                jobMap.classList.add("job-bounce-active");

                openModal(companyName, companyState);
                // Reset background color after 4 seconds (duration of animation)
                setTimeout(() => {
                    jobElement.classList.remove("jobMap");
                }, 4000); // 4000 milliseconds = 4 seconds
            });

            saveButton.addEventListener("click", (e) => {
                const jobId = e.target.getAttribute("data-job-id");
                let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                // Check if the job is already saved
                if (!favorites.includes(jobId)) {
                    favorites.push(jobId);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    alert("Job saved to favorites!");
                } else {
                    alert("This job is already in your favorites.");
                }
            });
            jobElement.innerHTML = `
                <div class="employer-logo">
                    <a href="${job.employer_website || '#'}" target="_blank"><img src="${job.employer_logo || ''}" alt="${job.employer_name || 'Employer Logo'}" loading="lazy" width="60" height="60"></a>
                    <h1 class="">${job.job_title || 'No job title available.'}</h1>
                </div>
                <h2>${job.employer_name || 'No employer name available.'}</h2>
                <p>Publisher: ${job.job_publisher || "No information available."}</p>
                <p>Type: ${job.job_employment_type || "No information available."}</p>
                <p>Country: ${job.job_country || "No information available."}</p>
                <p><a href="${job.job_apply_link}" target="_blank">Apply Here</a></p>
                <p><a href = "${job.job_apply_link}" target = "_blank" >Job Detail</a ></p>`;
            // <p>${job.job_latitude || "No information available."}</p>
            // <p>${job.job_longitude || "No information available."}</p>
            const buttonsContainer = document.createElement("div");
            buttonsContainer.classList.add("buttons-container");

            buttonsContainer.appendChild(mapButton);
            buttonsContainer.appendChild(saveButton);
            jobElement.appendChild(buttonsContainer);
            jobsContainer.appendChild(jobElement);
        });
    } else {
        jobsContainer.innerHTML = "<p>No jobs found for the given criteria.</p>";
    }

}
// Google Maps API Key (Replace with your key if using Google Maps)
//Hide the API Key. When needed,remarked line 8, and then tha code would work.
// const GOOGLE_MAPS_API_KEY = 'AIzaSyC_C9ING3B6KFDr2hTZn9yCoIbRR0npCUw';

// Get references to elements
const mapModal = document.getElementById("mapModal");
const closeButton = document.querySelector(".close-button");
const mapContainer = document.getElementById("mapContainer");

// Function to open the modal
function openModal(companyName, companyState) {
    if (!companyName || !companyState) {
        console.error("Missing companyName and companyState!");
        return;
    }
    if (!companyName) {
        console.error("Missing companyName!");
        return;
    }
    const mapUrl = generateMapUrl(companyName, companyState);
    // console.log(mapUrl);
    mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="${mapUrl}" allowfullscreen ></iframe > `;
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
// function generateMapUrl(companyName, companyState) {
function generateMapUrl(companyName, companyState) {
    // Embed Google Maps with the user's location
    // const mapUrl = `https://www.google.com/maps/embed/v1/search?q=${companyName}&key=${key}&zoom=15`;

    // const mapUrl = `https://www.google.com/maps/embed/v1/search?q=${companyName}||${companyState}&key=AIzaSyC_C9ING3B6KFDr2hTZn9yCoIbRR0npCUw`;
    const mapUrl = `https://www.google.com/maps/embed/v1/search?q=${companyName}||${companyState}&key=${key}&zoom=15`;
    return mapUrl;
}
