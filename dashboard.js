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
    categorytitle.className = "d-none";
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
        item.className = "itemCard shadow";
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
        createBtn()
        displayData(Recieps)
    });
});

// ------------------------------------------------------------------changeHome End-------------------------------------------------

// ----------------------------------------------------------------------createReceips start-----------------------------------------
let categorytitle = document.getElementById("category-title")
let recipeForm = document.getElementById("recipeForm");
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
    let newRecipe = {
        id: Date.now(),
        title: title,
        description: {
            introduction: "Coming Soon",
            Video: "Coming Soon",
            tips: ["Coming Soon"],
            ingredients: {
                main_ingredients: ingredients.length > 0 ? ingredients : ["Coming Soon"]
            }
        },
        instructions: instructions.length > 0
            ? [{ details: instructions.map(step => ({ text: step.trim(), image: "Coming Soon" })) }]
            : [{ details: [{ text: "Coming Soon", image: "Coming Soon" }] }],
        category: "userRecipes",
        image: imageBase64 || "Coming Soon"
    };

    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
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
    row.className = "row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3";

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

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".tab-btn");
    const sections = document.querySelectorAll(".content-section");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            sections.forEach(section => section.classList.add("d-none"));
            const targetId = this.getAttribute("data-target");
            document.getElementById(targetId).classList.remove("d-none");
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

document.querySelectorAll(".changeProfile").forEach(button => {
    button.addEventListener("click", function () {
        let targetSection = this.getAttribute("data-target");
        recipesContainer.innerHTML = "";
        btnContainer.innerHTML = "";
        categorytitle.classList.add("d-none");
        searchBar.classList.add("d-none");
        profileContainer.classList.remove("d-none");
        recipesContainer.appendChild(profileContainer);
    });
});

function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = (form.style.display === "none" || form.style.display === "") ? "block" : "none";
}


// manage recipe

document.getElementById("searchRecipe").addEventListener("click", function () {
    let searchTitle = document.getElementById("searchTitle").value.trim().toLowerCase();
    let recipes = JSON.parse(localStorage.getItem("AllRecipes")) || [];

    const recipeList = document.getElementById("recipe-list2");
    recipeList.innerHTML = "";

    if (searchTitle === "") {
        console.warn("⚠️ Search field is empty.");
        recipeList.innerHTML = "<p>Please enter a recipe title to search.</p>";
        return;
    }

    let filteredRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(searchTitle));

    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = "<p>No matching recipes found.</p>";
        console.warn("⚠️ No recipes matched the search query.");
        return;
    }
    filteredRecipes.forEach((recipe) => {
        let recipeItem = document.createElement("div");
        recipeItem.classList.add("recipe-card");
        recipeItem.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="">
            <div class="card-body anchorTag">
                <p class="card-title" data-id="${recipe.id}" style="cursor: pointer;">${recipe.title}</p>
            </div>
                <button class="delete-btn mb-3" onclick="deleteRecipe('${recipe.id}')">Delete</button>
            </div>
        `;
        recipeList.appendChild(recipeItem);
    });
});

function editRecipe(title) {
    let recipes = JSON.parse(localStorage.getItem("AllRecipes")) || [];
    let recipe = recipes.find(r => r.title === title);

    if (!recipe) {
        console.warn(`⚠️ Recipe with title "${title}" not found.`);
        return;
    }

    document.getElementById("editTitle").value = recipe.title;
    document.getElementById("editDescription").value = recipe.description;
    document.getElementById("editModal").classList.remove("d-none");

    document.getElementById("editModal").dataset.title = title;
}

function searchRecipeAgain() {
    let searchTitle = document.getElementById("searchTitle").value.trim().toLowerCase();
    let recipes = JSON.parse(localStorage.getItem("AllRecipes")) || [];

    const recipeList = document.getElementById("recipe-list2");
    recipeList.innerHTML = "";

    let filteredRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(searchTitle));

    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = "<p>No matching recipes found.</p>";
        return;
    }

    filteredRecipes.forEach((recipe) => {
        let recipeItem = document.createElement("div");
        recipeItem.classList.add("recipe-card");
        recipeItem.innerHTML = `
            <div class="card">
                <img src="${recipe.image}" class="card-img-top" alt="">
            <div class="card-body anchorTag">
                <p class="card-title" data-id="${recipe.id}" style="cursor: pointer;">${recipe.title}</p>
            </div>
                <button class="delete-btn" onclick="deleteRecipe('${recipe.title}')">Delete</button>
            </div>
        `;
        recipeList.appendChild(recipeItem);
    });
}
async function deleteRecipe(id) {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
        let response = await fetch(`${url}/${id}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        let recipes = JSON.parse(localStorage.getItem("AllRecipes")) || [];
        let updatedRecipes = recipes.filter(recipe => recipe.id !== id);
        localStorage.setItem("AllRecipes", JSON.stringify(updatedRecipes));

        alert("Recipe deleted successfully!");
        displayData(updatedRecipes);
    } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe. Please try again.");
    }
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
        button.className = "btn btn-secondary fs-6";
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

let allRecipes = [];

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

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

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

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    window.location.href = "index.html";
});

function logActivity(action) {
    let activities = JSON.parse(localStorage.getItem("userActivities")) || [];
    let timestamp = new Date().toLocaleString();
    activities = activities.filter(activity => activity.action !== action);
    activities.unshift({ action, timestamp });
    localStorage.setItem("userActivities", JSON.stringify(activities));
}
document.addEventListener("click", function (event) {
    let element = event.target;
    let action = element.innerText.trim() || element.tagName;

    if (action) {
        logActivity(`Clicked on "${action}"`);
    }
});
function displayActivity() {
    let activities = JSON.parse(localStorage.getItem("userActivities")) || [];
    let activityContainer = document.getElementById("view-activity");

    if (!activityContainer) return;

    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <h2>View Activity</h2>
            <p>No recent activity.</p>
        `;
        return;
    }

    let activityList = activities
        .map(item => `<li>${item.timestamp} - ${item.action}</li>`)
        .join("");

    activityContainer.innerHTML = `
        <h2>View Activity</h2>
        <ul>${activityList}</ul>
    `;
}
document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", function () {
        let targetSection = this.getAttribute("data-target");
        logActivity(`Visited ${targetSection.replace("-", " ")}`);

        if (targetSection === "view-activity") {
            displayActivity();
        }
    });
});
window.addEventListener("load", displayActivity);


getData()



