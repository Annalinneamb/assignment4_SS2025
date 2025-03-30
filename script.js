document.getElementById("getMeal").addEventListener("click", function () {
    // Send a GET request to the API for a random meal
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            // Log the full data to the console to explore the structure
            console.log(data);

            // Extract the meal data
            const meal = data.meals[0];

            // Create an array of ingredients and their measures
            let ingredientsList = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient !== "") {
                    ingredientsList.push(`${ingredient}: ${measure}`);
                }
            }

            // Populate the HTML with meal details
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
            `;
        })
        .catch(error => console.error("Error fetching meal:", error));  // Handle errors
});
