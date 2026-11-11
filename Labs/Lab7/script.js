const searchInput = document.getElementById("searchInput");
const methodSelect = document.getElementById("methodSelect");
const searchBtn = document.getElementById("searchBtn");
const statusMessage = document.getElementById("statusMessage");
const imageResults = document.getElementById("imageResults");

const API_URL = "https://cpit405-lab7-api.amaljohani05.workers.dev/";

function displayImages(photos) {
    imageResults.innerHTML = "";

    if (photos.length === 0) {
        statusMessage.textContent = "No images found.";
        return;
    }

    statusMessage.textContent = `${photos.length} images found.`;

    photos.forEach(function (photo) {
        const card = document.createElement("div");
        card.classList.add("image-card");

        const image = document.createElement("img");
        image.src = photo.urls.small;
        image.alt = photo.alt_description || "Unsplash image";
        image.loading = "lazy";

        const description = document.createElement("p");
        description.textContent =
            photo.alt_description || "No description available";

        card.appendChild(image);
        card.appendChild(description);

        imageResults.appendChild(card);
    });
}

function searchWithXHR(query) {
    const xhr = new XMLHttpRequest();

    const url = API_URL +
        "?query=" + encodeURIComponent(query);

    xhr.open("GET", url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayImages(data.results);
        } else {
            statusMessage.textContent =
                "Error: " + xhr.status;
        }
    };

    xhr.onerror = function() {
        statusMessage.textContent = "Network error.";
    };

    xhr.send();
}

function searchWithPromises(query) {
    const url = API_URL +
        "?query=" + encodeURIComponent(query);

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error(
                    "HTTP error: " + response.status
                );
            }

            return response.json();
        })
        .then(function(data) {
            displayImages(data.results);
        })
        .catch(function(error) {
            statusMessage.textContent = error.message;
        });
}

async function searchWithAsyncAwait(query) {
    const url = API_URL +
        "?query=" + encodeURIComponent(query);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                "HTTP error: " + response.status
            );
        }

        const data = await response.json();

        displayImages(data.results);

    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

function handleSearch() {
    const query = searchInput.value.trim();

    if (query === "") {
        statusMessage.textContent =
            "Please enter a search term.";
        return;
    }

    imageResults.innerHTML = "";
    statusMessage.textContent = "Loading images...";

    if (methodSelect.value === "xhr") {
        searchWithXHR(query);
    }
    else if (methodSelect.value === "promises") {
        searchWithPromises(query);
    }
    else if (methodSelect.value === "async") {
        searchWithAsyncAwait(query);
    }
}

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

