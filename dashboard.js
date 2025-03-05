async function getData() {
    try {
        let response = await fetch("https://salty-purple-kryptops.glitch.me/AllRecipes");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let result = await response.json();
        localStorage.setItem("AllRecipes", JSON.stringify(result))
        displayData()
        createBtn()
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// -------------------------------------------------------------------changeHome Start-------------------------------------
// displayData - DOM
let recipesContainer = document.getElementById("recipe-list");
let favoriteRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || []; // Store in localStorage

function displayData(filterProducts = null) {
    let categorytitle = document.getElementById("category-title"); // Ensure it's defined
    let searchBar = document.getElementById("searchBar"); // Ensure it's defined

    if (!categorytitle || !searchBar) {
        console.error("Category title or search bar is missing from the DOM.");
        return;
    }

    categorytitle.className = "d-block";
    searchBar.className = "d-flex m-3 p-2";
    recipesContainer.innerHTML = "";
    profileContainer.className = "d-none"
    let Recipes = JSON.parse(localStorage.getItem("AllRecipes")) || [];

    if (filterProducts) {
        Recipes = filterProducts;
    }

    if (Recipes.length === 0) {
        recipesContainer.innerHTML = "No data available";
        return;
    }

    let recipeItem = document.createElement("div");
    recipeItem.className = "recipeCard";
    searchBar.className = "search-box";

    Recipes.forEach(obj => {
        let item = document.createElement("div");
        item.className = "itemCard";
        let isFav = favoriteRecipes.some(fav => fav.id === obj.id); // Check if it's in favorites

        item.innerHTML = `
            <img src="${obj.image}" class="card-img-top" alt="">
            <div class="card-body anchorTag">
                <p class="card-title" data-id="${obj.id}" style="cursor: pointer;">${obj.title}</p>
            </div>
            <span class="heart-icon" data-id="${obj.id}" style="color: ${isFav ? "red" : "black"};"><i class="bi bi-suit-heart-fill"></i></span>
        `;

        let heartIcon = item.querySelector(".heart-icon");

        heartIcon.addEventListener("click", function () {
            let isFav = favoriteRecipes.some(fav => fav.id === obj.id);

            if (isFav) {
                heartIcon.style.color = "black";
                favoriteRecipes = favoriteRecipes.filter(fav => fav.id !== obj.id);
            } else {
                heartIcon.style.color = "red";
                favoriteRecipes.push(obj);
            }

            // Save to localStorage so it persists
            localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
        });
        item.querySelector(".card-title").addEventListener("click", function () {
            window.location.href = `recipesDetails.html?id=${obj.id}`;
        });
        recipeItem.appendChild(item);
    });

    recipesContainer.appendChild(recipeItem);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("changeHome").addEventListener("click", function () {
        let Recieps = JSON.parse(localStorage.getItem("AllRecipes"));
        displayData(Recieps)
    });
});

// ------------------------------------------------------------------changeHome End-------------------------------------------------

// ----------------------------------------------------------------------createReceips start-----------------------------------------
let categorytitle = document.getElementById("category-title")
document.getElementById("createReceips").addEventListener("click", function () {
    recipesContainer.innerHTML = "";
    resultsContainer.className = "d-none"
    btnContainer.innerHTML = ""
    searchBar.className = "d-none"
    categorytitle.className = "d-none"
    let recipeForm = document.getElementById("recipeForm")
    recipeForm.className = "d-block container *none"
    recipesContainer.appendChild(recipeForm)

});

// ----------------------------------------------------------------------createReceips End ------------------------------------------

// -----------------------------------------------------------------------Favorite Recipes Start --------------------------------------
document.getElementById("showFavorites").addEventListener("click", function () {
    recipesContainer.innerHTML = "";
    btnContainer.innerHTML = ""
    searchBar.className = "d-none"
    categorytitle.className = "d-none"
    let favRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

    if (favRecipes.length === 0) {
        recipesContainer.innerHTML = `<p class="text-center text-muted">No favorite recipes found.</p>`;
        return;
    }

    let row = document.createElement("div");
    row.className = "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"; // Responsive grid

    favRecipes.forEach(obj => {
        let item = document.createElement("div");
        item.className = "col favrecipe"; // Bootstrap grid column
        item.innerHTML = `
            <div class="card shadow-sm border-0">
                <img src="${obj.image}" class="card-img-top img-fluid" alt="Recipe Image">
                <div class="card-body">
                    <h5 class="card-title">${obj.title}</h5>
                </div>
            </div>
        `;
        row.appendChild(item);
    });

    recipesContainer.appendChild(row);
});

// -----------------------------------------------------------------------Favorite Recipes End --------------------------------------
//------------------------------------------------------------------------user profile start-----------------------------------------------
let profileContainer = document.getElementById("profile-container")
document.getElementById("changeProfile").addEventListener("click", function () {
    recipesContainer.innerHTML = "";
    btnContainer.innerHTML = ""
    searchBar.className = "d-none"
    recipesContainer.appendChild(profileContainer)
})

//-----------------------------------------------------------------------user profile end--------------------------------------------
// buttons creation

let btnContainer = document.getElementById("filters");
function createBtn() {
    btnContainer.innerHTML = ""
    let btn = document.createElement("button")
    btn.innerText = "All"
    btn.className = "btn btn-secondary"
    btn.addEventListener("click", () => {
        window.onload = displayData()
    });

    let filterRecieps = JSON.parse(localStorage.getItem("AllRecipes")) || [];
    if (filterRecieps.length === 0) return;
    let categories = [...new Set(filterRecieps.map(obj => obj.category))];

    categories.forEach(category => {
        let button = document.createElement("button");
        button.innerText = category;
        button.className = "btn btn-secondary";
        button.addEventListener("click", () => filterData(category));
        btnContainer.append(button, btn);
    });

}

// filter Data

function filterData(category) {
    let recipes = JSON.parse(localStorage.getItem("AllRecipes")) || [];
    let filtered = recipes.filter(obj => obj.category === category);
    displayData(filtered);
}

// search using debounce

let allRecipes = [];

// Function to fetch recipes from an external JSON file
async function fetchRecipes() {
    try {
        const response = await fetch("https://salty-purple-kryptops.glitch.me/AllRecipes"); // Ensure the file is in the same directory
        if (!response.ok) {
            throw new Error("Failed to load recipes.json");
        }
        allRecipes = await response.json();
        console.log("Recipes Loaded:", allRecipes); // Debugging
    } catch (error) {
        console.error("Error loading recipes:", error);
    }
}

// Debounce function to optimize search performance
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Search function to filter recipes
let resultsContainer = document.getElementById("results");

function searchRecipes() {
    let searchInput = document.getElementById("searchBar").value.toLowerCase();
    if (searchInput === "") {
        resultsContainer.style.display = "none"; // Hide results if search is empty
        return;
    } else {
        resultsContainer.style.display = "block"; // Show results when searching
    }

    if (allRecipes.length === 0) {
        console.warn("Recipes are not loaded yet.");
        return;
    }

    let filteredRecipes = allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchInput)
    );

    ShowData(filteredRecipes);
}

// Function to display search results
function ShowData(filteredRecipes) {
    let resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (filteredRecipes.length === 0) {
        resultsContainer.innerHTML = `<p>No recipes found</p>`;
        return;
    }

    filteredRecipes.forEach(recipe => {
        let item = document.createElement("div");
        item.classList.add("recipe-item");
        item.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img">
            <p class="recipe-title" data-id="${recipe.id}" style="cursor: pointer;">${recipe.title}</p>
        `;
        item.querySelector(".recipe-title").addEventListener("click", function () {
            window.location.href = `recipesDetails.html?id=${recipe.id}`;
        });
        resultsContainer.appendChild(item);
    });
}

// Attach event listener to search bar
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keyup", debounce(searchRecipes, 500));

// Load recipes from JSON and only allow searching after it's loaded
fetchRecipes().then(() => {
    console.log("Recipe data is ready for searching.");
});

getData()



