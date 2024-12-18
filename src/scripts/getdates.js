

// copyright year
const currentYear = new Date().getFullYear();
// Modify the content
document.querySelector('#year').innerText = `${currentYear}`;


// Get the last modified date of the document
const lastModifiedDate = new Date(document.lastModified);

// Format the date to display in a readable format
const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' };
const formattedDate = lastModifiedDate.toLocaleDateString('en-US', options);

// Update the placeholder text with the last modified date

document.getElementById('lastModified').innerText = `Last Modified: ${formattedDate}`;


