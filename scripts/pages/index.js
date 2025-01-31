async function getPhotographers() {
    const photographersRaw = await fetch("data/photographers.json");
    const photographers = await photographersRaw.json();

    return {
        photographers: photographers.photographers,
    };
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        photographer.portrait = `Photographers ID Photos/${photographer.portrait}`;
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();
