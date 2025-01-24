function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement("article");

        // Create link wrapper
        const link = document.createElement("a");
        link.href = `photographer.html?id=${data.id}`;

        // Image and name (inside link)
        const img = document.createElement("img");
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);

        const h2 = document.createElement("h2");
        h2.textContent = name;

        link.appendChild(img);
        link.appendChild(h2);

        // Location
        const location = document.createElement("p");
        location.className = "location";
        location.textContent = `${city}, ${country}`;

        // Tagline
        const taglineElement = document.createElement("p");
        taglineElement.className = "tagline";
        taglineElement.textContent = tagline;

        // Price
        const priceElement = document.createElement("p");
        priceElement.className = "price";
        priceElement.textContent = `${price}€/jour`;

        // Append all elements
        article.appendChild(link);
        article.appendChild(location);
        article.appendChild(taglineElement);
        article.appendChild(priceElement);

        return article;
    }
    return { name, picture, getUserCardDOM };
}
