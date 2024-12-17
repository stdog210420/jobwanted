const { VITE_GOOGLE_MAPS_API_KEY: key } = import.meta.env;

const search = document.querySelector(".search");
search.addEventListener("click", () => {

    openModal("台積電");
})
const mapModal = document.getElementById("mapModal");
const closeButton = document.querySelector(".close-button");
const mapContainer = document.getElementById("mapContainer");

function openModal(companyName) {
    // if (!companyName || !companyState) {
    //     console.error("Missing companyName or companyState!");
    //     return;
    // }

    if (!companyName) {
        console.error("Missing companyName or companyState!");
        return;
    }
    const mapUrl = generateMapUrl(companyName);
    console.log(mapUrl);
    mapContainer.innerHTML = `< iframe width = "100%" height = "100%" frameborder = "0" style = "border:0" src = "${mapUrl}" allowfullscreen ></iframe > `;
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
function generateMapUrl(companyName) {
    // Embed Google Maps with the user's location
    // const mapUrl = `https://www.google.com/maps/embed/v1/search?q=${companyName}&key=${key}&zoom=15`;

    const mapUrl = `https://www.google.com/maps/embed/v1/search?q=${companyName}&key=AIzaSyDy7cLklRcBVgQPW9k16qD7A9mGY8G_7c4`;
    // const mapUrl = `https://www.google.com/maps/embed/v1/search?q=${companyName}||${companyState}&key=${key}&zoom=15`;
    return mapUrl;
}