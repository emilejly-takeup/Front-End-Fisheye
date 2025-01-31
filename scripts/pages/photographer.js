function getPhotographerId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

async function getPhotographerData() {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    const photographerId = parseInt(getPhotographerId());

    const photographer = data.photographers.find((p) => p.id === photographerId);
    const photographerMedia = data.media.filter((m) => m.photographerId === photographerId);

    return { photographer, photographerMedia };
}

function createPhotographerInfo(photographer) {
    const info = document.querySelector(".photograph-header .photographer-info");
    info.querySelector("h1").textContent = photographer.name;
    info.querySelector(".location").textContent = `${photographer.city}, ${photographer.country}`;
    info.querySelector(".tagline").textContent = photographer.tagline;
}

function createPhotographerPortrait(photographer) {
    const portrait = document.querySelector(".photograph-header .photographer-portrait");
    portrait.src = `assets/photographers/Photographers ID Photos/${photographer.portrait}`;
    portrait.alt = photographer.name;
}

function updateDailyRate(price) {
    const dailyRateElement = document.querySelector(".daily-rate");
    dailyRateElement.textContent = `${price}€/jour`;
}

function displayPhotographerHeader(photographer) {
    createPhotographerInfo(photographer);
    createPhotographerPortrait(photographer);
    updateDailyRate(photographer.price);
}

function createMediaElement(media) {
    const mediaContainer = document.createElement("div");
    mediaContainer.className = "media-container";

    if (media.image) {
        return createImageElement(media, mediaContainer);
    }
    return createVideoElement(media, mediaContainer);
}

function createImageElement(media, container) {
    const img = document.createElement("img");
    img.src = `assets/photographers/${media.photographerId}/${media.image}`;
    img.alt = media.title;
    container.appendChild(img);
    return container;
}

function createVideoElement(media, container) {
    const video = document.createElement("video");
    video.src = `assets/photographers/${media.photographerId}/${media.video}`;
    video.controls = true;
    container.appendChild(video);
    return container;
}

function createLikesButton(media, updateCallback) {
    const likesButton = document.createElement("button");
    likesButton.className = "likes-button";
    likesButton.setAttribute("aria-label", "likes");
    likesButton.innerHTML = createHeartSvg();

    media.isLiked = media.isLiked || false;

    if (media.isLiked) {
        likesButton.classList.add("active");
    }

    likesButton.addEventListener("click", () => {
        media.isLiked = !media.isLiked;
        media.likes += media.isLiked ? 1 : -1;
        likesButton.classList.toggle("active", media.isLiked);
        updateCallback(media.likes);
    });

    return likesButton;
}

function createHeartSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="heart-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>`;
}

function createMediaCard(media, updateTotalLikes) {
    const article = document.createElement("article");
    article.className = "media-card";

    const mediaContainer = createMediaElement(media);
    const infoSection = createMediaInfo(media, updateTotalLikes);

    article.appendChild(mediaContainer);
    article.appendChild(infoSection);

    return article;
}

function createMediaInfo(media, updateTotalLikes) {
    const infoSection = document.createElement("div");
    infoSection.className = "media-info";

    const title = document.createElement("h2");
    title.textContent = media.title;

    const likesContainer = createLikesContainer(media, updateTotalLikes);

    infoSection.appendChild(title);
    infoSection.appendChild(likesContainer);

    return infoSection;
}

function createLikesContainer(media, updateTotalLikes) {
    const container = document.createElement("div");
    container.className = "likes-container";

    const likesCount = document.createElement("span");
    likesCount.className = "likes-count";
    likesCount.textContent = `${media.likes} `;

    const likesButton = createLikesButton(media, (newLikes) => {
        likesCount.textContent = `${newLikes} `;
        updateTotalLikes();
    });

    container.appendChild(likesCount);
    container.appendChild(likesButton);

    return container;
}

function displayMediaGallery(medias) {
    const gallery = document.querySelector(".media-gallery");
    gallery.innerHTML = "";

    let totalLikes = calculateTotalLikes(medias);

    const updateTotalLikes = () => {
        totalLikes = calculateTotalLikes(medias);
        const totalLikesElement = document.querySelector(".total-likes");
        totalLikesElement.textContent = `${totalLikes} ❤`;
    };

    medias.forEach((media) => {
        const card = createMediaCard(media, updateTotalLikes);
        gallery.appendChild(card);
    });

    updateTotalLikes();
}

function calculateTotalLikes(medias) {
    return medias.reduce((sum, media) => sum + media.likes, 0);
}

async function init() {
    try {
        const { photographer, photographerMedia } = await getPhotographerData();
        if (!photographer) {
            console.error("Photographer not found");
            return;
        }

        displayPhotographerHeader(photographer);

        const sortSelect = document.getElementById("sort");
        sortSelect.addEventListener("change", (e) => {
            const sortedMedia = sortMedia(photographerMedia, e.target.value);
            displayMediaGallery(sortedMedia);
        });

        const sortedMedia = sortMedia(photographerMedia, "popularity");
        displayMediaGallery(sortedMedia);
    } catch (error) {
        console.error("Error loading photographer data:", error);
    }
}

function sortMedia(media, criterion) {
    const mediaCopy = [...media];

    switch (criterion) {
        case "popularity":
            return mediaCopy.sort((a, b) => b.likes - a.likes);
        case "date":
            return mediaCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        case "title":
            return mediaCopy.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return mediaCopy;
    }
}

init();
