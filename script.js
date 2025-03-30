const mealCategoryToCocktailIngredient = {
    Biff: "Whiskey",
    Kylling: "Vodka",
    Sjømat: "Rom",
    Vegetar: "Gin",
    Pasta: "Vin",
    Dessert: "Baileys",
    Lam: "Vodka",
    Diverse: "Vodka",
    Svin: "Tequila",
    Tilbehør: "Brandy",
    Forrett: "Rom",
    Frokost: "Vodka",
    Geit: "Whiskey",
    Vegan: "Rom"
};

 function init() {
    fetchRandomMeal()
          .then(function(meal) {
              displayMealData(meal);
              const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
              console.log("Matchende drikkeingrediens:", spirit);
              return fetchCocktailByDrinkIngredient(spirit);
          })
          .then(function(cocktail) {
              displayCocktailData(cocktail);
          })
          .catch(function(error) {
              console.error("Error i init-funksjonen:", error);
          });
  }


function fetchRandomMeal() {
    return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(function(response) {
            return response.json();
        })
    
    
}

document.getElementById("getMeal").addEventListener("click", function () {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const meal = data.meals[0];

            let ingredientsList = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient !== "") {
                    ingredientsList.push(`${ingredient}: ${measure}`);
                }
            }

            document.getElementById("mealContainer").innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <h3>Ingredients:</h3>
                <ul>
                    ${ingredientsList.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <p><strong>Instructions:</strong></p>
                <p>${meal.strInstructions}</p>
                <div id="cocktailContainer"></div>
            `;

            fetchMatchingCocktail(meal.strCategory);
        })
        .catch(error => console.error("Error fetching meal:", error));
});

const mealCategoryToCocktailIngredient = {
    "Beef": "Whiskey",
    "Chicken": "Vodka",
    "Seafood": "Rum",
    "Vegetarian": "Gin",
    "Pasta": "Wine",
    "Dessert": "Baileys"
};

function mapMealCategoryToDrinkIngredient(category) {
    return mealCategoryToCocktailIngredient[category] || "Vodka";
}

function fetchMatchingCocktail(mealCategory) {
    const drinkIngredient = mapMealCategoryToDrinkIngredient(mealCategory);

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkIngredient}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                return data.drinks[Math.floor(Math.random() * data.drinks.length)];
            } else {
                return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
                    .then(response => response.json())
                    .then(randomData => randomData.drinks[0]);
            }
        })
        .then(cocktail => {
            if (!cocktail) {
                console.error("No cocktail data found.");
                document.getElementById("cocktailContainer").innerHTML = `<p>No cocktail found.</p>`;
                return;
            }

            let cocktailIngredients = [];
            for (let i = 1; i <= 15; i++) {
                const ingredient = cocktail[`strIngredient${i}`];
                const measure = cocktail[`strMeasure${i}`];
                if (ingredient && ingredient !== "") {
                    cocktailIngredients.push(`${ingredient}: ${measure || ''}`);
                }
            }

            document.getElementById("cocktailContainer").innerHTML = `
                <h2>Suggested Cocktail: ${cocktail.strDrink}</h2>
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                <h3>Ingredients:</h3>
                <ul>
                    ${cocktailIngredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <p><strong>Instructions:</strong></p>
                <p>${cocktail.strInstructions}</p>
            `;
        })
        .catch(error => {
            console.error("Error fetching cocktail:", error);
            document.getElementById("cocktailContainer").innerHTML = `<p>Something went wrong while fetching the cocktail.</p>`;
        });
}
