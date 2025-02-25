const breedInput = document.getElementById("breedInput");
const breedList = document.getElementById("breedList");
const showImagesButton = document.getElementById("showImages");
const message = document.getElementById("message");
const imageContainer = document.getElementById("imageContainer");

let breeds = {};
let interval;


fetch("https://dog.ceo/api/breeds/list/all")
    .then(response => response.json())
    .then(data => {
        breeds = data.message;
        populateBreedList();
    });

function populateBreedList() {
    for (const breed in breeds) {
        if (breeds[breed].length === 0) {
            const option = document.createElement("option");
            option.value = breed;
            breedList.appendChild(option);
        } else {
            breeds[breed].forEach(subBreed => {
                const option = document.createElement("option");
                option.value = `${subBreed} ${breed}`;
                breedList.appendChild(option);
            });
        }
    }
}

showImagesButton.addEventListener("click", () => {
    const breedName = breedInput.value.toLowerCase().trim();
    let formattedBreed = "";

    if (breedName.includes(" ")) {
        let [subBreed, mainBreed] = breedName.split(" ");
        formattedBreed = `${mainBreed}/${subBreed}`;
    } else {
        formattedBreed = breedName;
    }

    if (isValidBreed(breedName)) {
        message.textContent = "";
        fetchAndDisplayImages(formattedBreed);
    } else {
        clearInterval(interval);
        imageContainer.innerHTML = "";
        message.textContent = "No such breed";
    }
});

function isValidBreed(breed) {
    if (breeds.hasOwnProperty(breed)) {
        return true;
    }
    for (const mainBreed in breeds) {
        if (breeds[mainBreed].includes(breed.split(" ")[0])) {
            return true;
        }
    }
    return false;
}

function fetchAndDisplayImages(breed) {
    clearInterval(interval);
    imageContainer.innerHTML = "";

    function loadImage() {
        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    imageContainer.innerHTML = `<img src="${data.message}" alt="${breed}">`;
                }
            })
            .catch(error => console.error("Error fetching image:", error));
    }

    loadImage();
    interval = setInterval(loadImage, 5000);
}
