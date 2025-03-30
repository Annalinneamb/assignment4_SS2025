const mealCategoryToCocktailIngredient = {
    Beef: "whiskey",
    Chicken: "gin",
    Dessert: "amaretto",
    Lamb: "vodka",
    Miscellaneous: "vodka",
    Pasta: "tequila",
    Pork: "tequila",
    Seafood: "rum",
    Side: "brandy",
    Starter: "rum",
    Vegetarian: "gin",
    Breakfast: "vodka",
    Goat: "whiskey",
    Vegan: "rum",
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
        .then(function(data) {
        console.log("Måltids-API fungerer:", data);
        let meal = data.meals[0];
        return meal;
        })
        .catch(function(error) {
            console.error("Feil ved henting av måltid:", error);
          });
}

function displayMealData(meal) {
      document.getElementById("img").src = meal.strMealThumb;
      document.getElementById("MealName").textContent = meal.strMeal;
      document.getElementById("category").textContent = "Category: " + meal.strCategory;
    
      let ingredientList = document.getElementById("ingredients");
      for ( let i = 1; i <= 20; i++){
        let ingredient = meal["strIngredient" + i];
        let measure = meal["strMeasure" + i];
  
        if (!ingredient || ingredient.trim() === "") { 
          break; 
        }
        else {
          const li = document.createElement("li");
      
          li.textContent = measure + " " + ingredient;
          ingredientList.appendChild(li);
        }}
    
        document.getElementById("instructions").textContent = meal.strInstructions
  }


  function mapMealCategoryToDrinkIngredient(category) {
    if (!category) return "Cola";
    return mealCategoryToCocktailIngredient[category] || "Cola";
  }


function fetchCocktailByDrinkIngredient(drinkIngredient) {
    console.log("Henter cocktail for:", drinkIngredient);
      const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkIngredient)}`;
      return fetch(url)
          
          .then(function(response) {
              return response.json();
          })
          
          .then(function(data) {
              if (data.drinks && data.drinks.length > 0) {
                  console.log("Fant cocktail:", data.drinks[0]);
                  return data.drinks[0];
              } else {
                  console.log("Ingen match, henter tilfeldig cocktail");
                  return fetchRandomCocktail();
              }
          })
          
          .catch(function(error) {
              console.error("Feil ved henting av cocktail:", error);
              return fetchRandomCocktail();
          });
  }

 function fetchRandomCocktail() {
    console.log("Henter en tilfeldig cocktail");
      return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
          
          .then(function(response) {
              return response.json();
          })
          
          .then(function(data) {
              console.log("Data for tilfeldig cocktail:", data);
              return data.drinks[0];
          })
          
          .catch(function(error) {
              console.error("Kunne ikke hente tilfeldig cocktail:", error);
          });
  }


function displayCocktailData(cocktail) {
    if (!cocktail) {
      console.error("Vi fant ingen cocktaildata");
      return;
  }
  
  document.getElementById("drinkimg").src = cocktail.strDrinkThumb;
  document.getElementById("cname").textContent = cocktail.strDrink;
  document.getElementById("cCategory").textContent = "Category: " + (cocktail.strCategory || "Unknown");
  
  let ingredientList = document.getElementById("cIngredients");
  ingredientList.innerHTML = "";
  for (let i = 1; i <= 15; i++) {
      let ingredient = cocktail["strIngredient" + i];
      let measure = cocktail["strMeasure" + i];
      if (!ingredient || ingredient.trim() === "") {
          break;
      }
  
      const li = document.createElement("li");
      li.textContent = (measure ? measure + " " : "") + ingredient;
      ingredientList.appendChild(li);
  }
  }
  
  window.onload = init;


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
