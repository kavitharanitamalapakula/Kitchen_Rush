const url = "https://salty-purple-kryptops.glitch.me/AllRecipes"

async function getData() {
    try {
        let response = await fetch(url);
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
let favoriteRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
function displayData(filterProducts = null) {
    let categorytitle = document.getElementById("category-title");
    let searchBar = document.getElementById("searchBar");

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
        let isFav = favoriteRecipes.some(fav => fav.id === obj.id);

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
    btnContainer.innerHTML = "";
    searchBar.classList.add("d-none");
    resultsContainer.classList.add("d-none");
    categorytitle.classList.add("d-none");
    profileContainer.classList.add("d-none");
    recipeForm.classList.remove("d-none");
    recipesContainer.appendChild(recipeForm);
});
document.getElementById("publish").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const ingredients = document.getElementById("ingredients").value.trim().split("\n");
    const instructions = document.getElementById("instructions").value.trim().split("\n");
    const photoInput = document.getElementById("photo");
    const file = photoInput.files[0];

    if (!title || ingredients.length === 0 || instructions.length === 0 || !file) {
        alert("Please fill out all fields and upload an image.");
        return;
    }
    const imageBase64 = await toBase64(file);

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            image: imageBase64
        })
    };
    let response = await fetch(url, options);

    if (response.ok) {
        alert("Recipe added successfully!");
        document.getElementById("title").value = "";
        document.getElementById("ingredients").value = "";
        document.getElementById("instructions").value = "";
        document.getElementById("photo").value = "";
        document.getElementById("publish").disabled = true;
    } else {
        alert("Error adding recipe. Please try again.");
    }
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
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
    row.className = "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4";

    favRecipes.forEach(obj => {
        let item = document.createElement("div");
        item.className = "col favrecipe";
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
    profileContainer.classList.remove("d-none");
    recipesContainer.appendChild(profileContainer);
});

function toggleForm(formId) {
    const form = document.getElementById(formId);
    const menuItem = form.previousElementSibling;

    // Close other open forms
    document.querySelectorAll(".form-container").forEach(el => {
        if (el.id !== formId) {
            el.style.display = "none";
            el.previousElementSibling.classList.remove("active");
        }
    });

    // Toggle current form
    if (form.style.display === "block") {
        form.style.display = "none";
        menuItem.classList.remove("active");
    } else {
        form.style.display = "block";
        menuItem.classList.add("active");
    }
}

function saveChanges() {
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const saveMessage = document.getElementById("saveMessage");

    if (fullName.trim() === "" || email.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }

    saveMessage.style.display = "block";
    setTimeout(() => saveMessage.style.display = "none", 2000);
}

function saveRecipe() {
    const recipeName = document.getElementById("recipeName").value;
    const recipeDescription = document.getElementById("recipeDescription").value;
    const recipeMessage = document.getElementById("recipeMessage");

    if (recipeName.trim() === "" || recipeDescription.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }

    recipeMessage.style.display = "block";
    setTimeout(() => recipeMessage.style.display = "none", 2000);
}

function showActivity() {
    const activityLog = document.getElementById("activityLog");
    activityLog.innerHTML = "You last edited your profile 5 minutes ago!";
}

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
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to load recipes.json");
        }
        allRecipes = await response.json();
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
allRecipes = JSON.parse(localStorage.getItem("AllRecipes")) || [];

function searchRecipes() {
    let searchInput = document.getElementById("searchBar").value.toLowerCase();
    if (searchInput === "") {
        resultsContainer.style.display = "none";
        return;
    } else {
        resultsContainer.style.display = "block";
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
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keyup", debounce(searchRecipes, 500));

getData()



