var userInput = document.querySelector("#citySearch");
var btnContainer = document.querySelector("#buttonContainer");
var dayContainer = document.querySelector("#todayContainer");
var searchHistory = [];

// Added this function to filter out the duplicates in the searchHistory array
function uniqueSearchHistory(data) {
    return [...new Set(data)];
};

// Changed the length of the searchHistory array so that it won't go past the view screen
function init() {
    var storedData = localStorage.getItem("history");
    if (storedData) {
        searchHistory = JSON.parse(storedData)
        searchHistory.length = 8;
    };
createBtn();
};

init();

// Using the function uniqueSearchHistory to loop through the history buttons
// Added data-search attribute to use later on for recalling a history city search
function createBtn() {
    btnContainer.innerHTML = "";
    
    for (var index = 0; index < uniqueSearchHistory(searchHistory).length; index++) {
        var addBtnVar = document.createElement('button');
        addBtnVar.setAttribute('id', 'historyBtn');
        addBtnVar.setAttribute('class', 'btn btn-secondary');
        addBtnVar.setAttribute('type', 'button');
        addBtnVar.setAttribute('data-search', uniqueSearchHistory(searchHistory)[index]);
        addBtnVar.textContent = uniqueSearchHistory(searchHistory)[index];
        addBtnVar.onclick = runHistory;

        btnContainer.appendChild(addBtnVar);
    };
};

// Added this function that to grab the data-search attribute and convert it into a peramiter in the getCoordinateApi
function runHistory() {
    var historyData = this.getAttribute("data-search");
    var historyDataBtn = historyData;

    getCoordinateApi(historyDataBtn);
};

function getCoordinateApi(search) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&units=imperial&appid=d8a9dd36291435cdba31ee628d84c869";
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            var longitude = data.coord.lon;
            var latitude = data.coord.lat;
            var city = data.name;
            var todayIcon = data.weather[0].icon;
            var temperature = data.main.temp;
            var todayWind = data.wind.speed;
            var todayHumidity = data.main.humidity;

// Using the unshift method to add new city to the beginning of the array and setting the filtered array to local storage
            searchHistory.unshift(city);
            localStorage.setItem("history", JSON.stringify(uniqueSearchHistory(searchHistory)));

// Calling the createBtn function to start dynamically creating historical buttons if there are cities in the array
            createBtn();

// Adding a header element to div with id="todayContainer" and include the city veriable and moment fuction to append the date next to the h3
            dayContainer.setAttribute('class', 'container-fluid border border-dark');
            var header = document.createElement('h3');
            var today = moment().format('L');
            header.classList.add('fw-bolder');
            header.innerHTML = city + " (" + today + ")";
            dayContainer.innerHTML ="";
            dayContainer.appendChild(header);

// Adding a image element and appending it next to the h3 headder
            var iconVar = document.createElement('img');
            iconVar.src = "https://openweathermap.org/img/wn/" + todayIcon + "@2x.png";
            header.append(iconVar);

// Appending the other data to the bottom of todays container
            var tempVar = document.createElement('p');
            tempVar.innerHTML = "<strong>Temp: </strong>" + temperature + "\xB0 F";
            dayContainer.appendChild(tempVar);

            var windVar = document.createElement('p');
            windVar.innerHTML = "<strong>Wind: </strong>" + todayWind + " MPH"
            dayContainer.appendChild(windVar);

            var humidityVar = document.createElement('p');
            humidityVar.innerHTML = "<strong>Humidity: </strong>" + todayHumidity + " %"
            dayContainer.appendChild(humidityVar);

// Calling my Second API, learned we don't have to use function created a variable to use in the fetch request
            var requestOneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=d8a9dd36291435cdba31ee628d84c869"

            fetch(requestOneUrl)
            .then(function (secondResponse) {
                return secondResponse.json();
            })
            .then(function (secondData) {
                var uvindexVar = document.createElement('p');
                uvindexVar.innerHTML = "<strong>UV Index: </strong>";
                dayContainer.appendChild(uvindexVar);

// Adding a span element then using an if statement to set styling classes depending on the UV Index
                var uvBox = document.createElement('span');
                if (secondData.current.uvi <= 2.49) {
                    uvBox.setAttribute('class', 'span-box-green');
                    uvBox.innerHTML = secondData.current.uvi;
                    uvindexVar.append(uvBox);
                } else if (secondData.current.uvi >= 2.50 && secondData.current.uvi <= 5.49) {
                    uvBox.setAttribute('class', 'span-box-yellow');
                    uvBox.innerHTML = secondData.current.uvi;
                    uvindexVar.append(uvBox);
                } else {
                    uvBox.setAttribute('class', 'span-box-red');
                    uvBox.innerHTML = secondData.current.uvi;
                    uvindexVar.append(uvBox);
                };
                
// Creating div containers and adding five day forecast header dynamically
                var fiveDayContainer = document.getElementById('fiveDay');
                fiveDayContainer.setAttribute('class', 'container-fluid five-day-cont');
                fiveDayContainer.innerHTML = "";
                var fivedaytitle = document.createElement('h3');
                fivedaytitle.setAttribute('class', 'fw-bolder');
                fivedaytitle.textContent = "5-Day Forecast:";
                fiveDayContainer.append(fivedaytitle);

// Creating a smaller div container for forecast cards
                var cardContainerVar = document.createElement('div');
                cardContainerVar.setAttribute('class', 'd-flex flex-row justify-content-between cardContStyle');
                fiveDayContainer.append(cardContainerVar);

// Using for loop to add weather data to each card dynamically
                for (var index = 1; index <= 5; index++) {
                    var cardDivVar = document.createElement('div');
                    cardDivVar.setAttribute('class', 'card-body cardStyle');
                    cardContainerVar.appendChild(cardDivVar);

// Using UNIX Date and converting it to a string to use for the cards date
                    var cardContentVar = document.createElement('h5');
                    var unixDate = new Date (secondData.daily[index].dt * 1000);
                    var date = unixDate.toLocaleString();
                    cardContentVar.innerHTML = date.slice(0,-12);
                    cardDivVar.appendChild(cardContentVar);

                    var iconSmall = document.createElement('img');
                    iconSmall.src = "https://openweathermap.org/img/wn/" + secondData.daily[index].weather[0].icon + ".png";
                    cardDivVar.appendChild(iconSmall);

                    var tempSmallVar = document.createElement('p');
                    tempSmallVar.innerHTML = "<strong>Temp: </strong>" + secondData.daily[index].temp.max + "\xB0 F - " + secondData.daily[index].temp.min + "\xB0 F";
                    cardDivVar.appendChild(tempSmallVar);

                    var windSmallVar = document.createElement('p');
                    windSmallVar.innerHTML = "<strong>Wind: </strong>" + secondData.daily[index].wind_speed + " MPH"
                    cardDivVar.appendChild(windSmallVar);

                    var humiditySmallVar = document.createElement('p');
                    humiditySmallVar.innerHTML = "<strong>Humidity: </strong>" + secondData.daily[index].humidity + " %"
                    cardDivVar.appendChild(humiditySmallVar);
                }
            })
        })
};

// Function added to allow search to execute with Enter Key & clear the input field right after
function pressEnter(event) {
    if (event.key === "Enter") {
        getCoordinateApi(userInput.value);
        document.getElementById('citySearch').value ="";
    }
};

// Added this function to grab the input value and convert it into a peramiter in the getCoordinateApi & clear the input field right after
function getCityInput(){
    getCoordinateApi(userInput.value);
    document.getElementById('citySearch').value ="";
};

userInput.onkeyup = pressEnter;

searchBtn.onclick = getCityInput;