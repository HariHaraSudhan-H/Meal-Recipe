// Importing all HTML Data
let searchButton = document.getElementById('searchButton');
let searchText = document.getElementById('searchValue');
let display = document.getElementById('display');
let randomRecipe = document.getElementById('RandomRecipe');
let clearButton = document.getElementById('clearText');
let favouritesList = document.getElementById('favouriteList');
let home = document.getElementById('Home');

// Event Listeners for operations
searchText.addEventListener('keyup', search);
searchButton.addEventListener('click', search);
randomRecipe.addEventListener('click', randomSelect);
favouritesList.addEventListener('click', showFavourites);
clearButton.addEventListener('click', (e) => {
    searchText.value = '';
    e.preventDefault();
    display.innerHTML = '';
    document.getElementById('searchResult').style.display = 'none';
});

if (localStorage.getItem("favourites") == null) {
    localStorage.setItem("favourites", JSON.stringify([]));
}

// fetchs data from API
async function fetchMealFromAPI(url, value) {
    try {
        let data;
        if (value) {
            data = await fetch(`${url + value}`);
        } else {
            data = await fetch(`${url}`);
        }
        const meals = await data.json();
        return meals;
    } catch (error) {
        console.log('error');
    }

}

// searches in list as per value enter and displays
function search(event) {
    event.preventDefault();
    console.log('Hello connected')
    let searchedItem = document.getElementById('searchValue').value;
    console.log(searchedItem)
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = '';
    let meals = fetchMealFromAPI(url, searchedItem);
    let favourites = JSON.parse(localStorage.getItem("favourites"));
    meals.then((data) => {
        if (data.meals) {
            document.getElementById('searchResult').style.display = 'block';
            data.meals.forEach((element) => {
                // console.log(data.meals);
                let index = isInFav(element.idMeal);
                if(index!=-1){
                    html += `<div id="card" class="card mb-3 food-card">
                            <img src="${element.strMealThumb}" class="card-img-top meal-image" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-4">
                                    <button type="button" class="btn btn-dark moreDetails" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                    <button id="main${element.idMeal}" class="btn btn-danger btn-outline-danger active favIcon" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                                </div>
                            </div>
                        </div>`
                }else{
                    html += `<div id="card" class="card mb-3 food-card">
                            <img src="${element.strMealThumb}" class="card-img-top meal-image" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-4">
                                    <button type="button" class="btn btn-dark moreDetails" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                    <button id="main${element.idMeal}" class="btn btn-dark btn-outline-dark favIcon active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                                </div>
                            </div>
                        </div>`
                } 
            })
        } else {
            html = `<div>
                        Item not found
                    </div>`
        }
        display.innerHTML = html;
    })
}

// Selects a random Meal from list
function randomSelect(event) {
    event.preventDefault();
    let favourites = JSON.parse(localStorage.getItem('favourites'));
    let url = "https://www.themealdb.com/api/json/v1/1/random.php";
    let meals = fetchMealFromAPI(url);
    let html = '';
    meals.then((data) => {
        let element = data.meals[0];
        // console.log(element);
        if (element) {
            let index = isInFav(element.idMeal);
            if(index!=-1){
                html += `<div id="card" class="card mb-3 food-card">
                        <img src="${element.strMealThumb}" class="card-img-top meal-image" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${element.strMeal}</h5>
                            <div class="d-flex justify-content-between mt-4">
                                <button type="button" class="btn btn-dark moreDetails" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                <button id="main${element.idMeal}" class="btn btn-danger btn-outline-danger active favIcon" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                            </div>
                        </div>
                    </div>`
            }else{
                html += `<div id="card" class="card mb-3 food-card">
                        <img src="${element.strMealThumb}" class="card-img-top meal-image" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${element.strMeal}</h5>
                            <div class="d-flex justify-content-between mt-4">
                                <button type="button" class="btn btn-dark moreDetails" onclick="showMealDetails(${element.idMeal})">More Details</button>
                                <button id="main${element.idMeal}" class="btn btn-dark btn-outline-dark favIcon active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                            </div>
                        </div>
                    </div>`
            } 
        } else {
            console.log('not found')
        }
        // document.getElementById('favourites').style.display = 'flex';
        display.innerHTML= html;
    });
}

// Helps in displaying the favourites
async function showFavourites(isduplicate) {
    let favourites = JSON.parse(localStorage.getItem('favourites'));
    let url = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
    let html = ''
    if (favourites.length == 0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        for (let meal in favourites) {
            await fetchMealFromAPI(url, favourites[meal])
                .then((data) => {
                    let element = data.meals[0];
                    html += `<div id="card-${meal}" class="card mb-3 fav-card">
                <img src="${element.strMealThumb}" class="card-img-top meal-fav-image" alt="...">
                <div class="card-body fav-card-body">
                    <h5 class="card-title">${element.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-4">
                        <button type="button" class="btn btn-dark moreDetails fav-moreDetails" onclick="showMealDetails(${element.idMeal})">More Details</button>
                        <button id="main${element.idMeal}" class="btn btn-danger btn-outline-danger active favIcon" onclick="addRemoveToFavList(${element.idMeal},true)" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            </div>`
                })
        }
    }
    document.getElementById('app').style.filter = 'blur(4px)';
    let list = document.getElementById('fav-list');
    document.getElementById('navbar').classList.remove('sticky-top');
    document.getElementById('favourites-list').style.display = 'flex';
    list.innerHTML = html;
    // console.log(document.getElementById('favourites-list').innerHTML);
}

// Helps in show details of a meal
async function showMealDetails(element_id) {
    closeFavPage();
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = '';
    let meal = await fetchMealFromAPI(url, element_id)
        .then((data) => {
            let element = data.meals[0];
            let index = isInFav(element.idMeal);
            html = `<div class="mealDetails">
                    <div class="detailName">
                        <img src="${element.strMealThumb}" alt="MealImage" class="meal-image meal-detail-image">
                        <div class="detailInfo">
                            <h5 class="mealTitle">${element.strMeal}</h5>
                            <div class="mealCategory"><span>Category : </span>${element.strCategory}</div>`
                            if(index!=-1){
                                html+=`<button id="main${element.idMeal}" class="btn btn-danger btn-outline-danger active favIcon" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>`
                            }else{
                                html+=`<button id="main${element.idMeal}" class="btn btn-dark btn-outline-dark active favIcon mt-3" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>`
                            }
                            
                        html+=`</div>
                        
                    </div>
                    <div class="mealInstructions">
                        <div style = "font-weight:600">Instructions </div>
                        ${element.strInstructions}
                    </div>
                    <div class="Video">
                        <a href="${element.strYoutube}">Watch Video</a>
                    </div>
                </div>`
            // console.log(element);
            document.getElementById('Home').classList.remove('remove');
        })
    document.getElementById('app').innerHTML = html;
}

// Helps in adding and removing favourites
function addRemoveToFavList(element_id,isFavPage) {
    let favourites = JSON.parse(localStorage.getItem("favourites"));
    console.log(favourites);
    // let index = favourites.findIndex((id) => {
    //     return id == element_id;
    // });
    let index = isInFav(element_id);
    if (index == -1) {
        favourites.push(element_id);
        alert('Selected meal is added from Favourites!!');
        document.getElementById(`main${element_id}`).classList.remove('btn-dark','btn-outline-dark');
        document.getElementById(`main${element_id}`).classList.add('btn-danger','btn-outline-danger');
    } else {
        favourites.splice(index, 1);
        alert('Selected meal is removed from Favourites!!');
        document.getElementById(`main${element_id}`).classList.add('btn-dark','btn-outline-dark');
        document.getElementById(`main${element_id}`).classList.remove('btn-danger','btn-outline-danger');
    }
    localStorage.setItem('favourites', JSON.stringify(favourites));
    if(isFavPage){
        showFavourites();
    }
    
}

// helps in closing the fav page
function closeFavPage(){
    // e.preventDefault();
    document.getElementById('favourites-list').style.display = 'none';
    document.getElementById('app').style.filter = 'blur(0px)';

}

// Checks whether it is in favourites list
function isInFav(element_id){
    let favourites = JSON.parse(localStorage.getItem("favourites"));

    let index = favourites.findIndex((id) => {
        return id == element_id;
    });
    return index;
}