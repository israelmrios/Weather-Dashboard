var userInput = document.querySelector("#citySearch");
var searchHistory = [];
var btnContainer = document.querySelector("#buttonContainer");
var dayContainer = document.querySelector("#todayContainer");

function uniqueSearchHistory(data) {
    return [...new Set(data)];
};

function init() {
    var storedData = localStorage.getItem("history");
    if (storedData) {
        searchHistory = JSON.parse(storedData)
        searchHistory.length = 8;
    };
createBtn();
};

init();

function createBtn() {
    btnContainer.innerHTML = "";
    
    for (var index = 0; index < uniqueSearchHistory(searchHistory).length; index++) {
        var addBtnVar = document.createElement('button');
        addBtnVar.setAttribute('id', 'historyBtn');
        addBtnVar.setAttribute('class', 'btn btn-secondary');
        addBtnVar.setAttribute('type', 'button');
        // addBtnVar.setAttribute('data-search', searchHistory[index]);
        // addBtnVar.textContent = searchHistory[index];
        addBtnVar.setAttribute('data-search', uniqueSearchHistory(searchHistory)[index]);
        addBtnVar.textContent = uniqueSearchHistory(searchHistory)[index];

        addBtnVar.onclick = runHistory;

        btnContainer.appendChild(addBtnVar);
    };
};

function runHistory() {
    var historyData = this.getAttribute("data-search");
    var historyDataBtn = historyData;
    console.log(historyDataBtn);
    getCoordinateApi(historyDataBtn);
};

function getCoordinateApi(search) {
    console.log(search);
    var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + search + "&units=imperial&appid=d8a9dd36291435cdba31ee628d84c869";
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var longitude = data.coord.lon;
            var latitude = data.coord.lat;
            var city = data.name;
            var todayIcon = data.weather[0].icon;
            var temperature = data.main.temp;
            var todayWind = data.wind.speed;
            var todayHumidity = data.main.humidity;

            searchHistory.unshift(city);
            localStorage.setItem("history", JSON.stringify(uniqueSearchHistory(searchHistory)));

            createBtn();

            // add a header element to div with id="todayContainer" and include the city veriable Note: the bottom dayContainer had container-fluid in it
            dayContainer.setAttribute('class', 'container-fluid border border-dark');
            var header = document.createElement('h3');
            var today = moment().format('L');
            header.classList.add('fw-bolder');

            header.innerHTML = city + " (" + today + ")";
            

            // var appendVar = document.getElementById("todayContainer");
            dayContainer.innerHTML =""
            dayContainer.appendChild(header);

            var iconVar = document.createElement('img');
            iconVar.src = "http://openweathermap.org/img/wn/" + todayIcon + "@2x.png";
            header.append(iconVar);

            // append the other data to todays container
            var tempVar = document.createElement('p');
            tempVar.innerHTML = "<strong>Temp: </strong>" + temperature + "\xB0 F";
            dayContainer.appendChild(tempVar);

            var windVar = document.createElement('p');
            windVar.innerHTML = "<strong>Wind: </strong>" + todayWind + " MPH"
            dayContainer.appendChild(windVar);

            var humidityVar = document.createElement('p');
            humidityVar.innerHTML = "<strong>Humidity: </strong>" + todayHumidity + " %"
            dayContainer.appendChild(humidityVar);

           // no need to use a function
            var requestOneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=d8a9dd36291435cdba31ee628d84c869"

            fetch(requestOneUrl)
            .then(function (secondResponse) {
                // console.log(secondResponse.status);
                return secondResponse.json();
            })
            .then(function (secondData) {
                console.log(secondData);

                var uvindexVar = document.createElement('p');
                uvindexVar.innerHTML = "<strong>UV Index: </strong>";
                dayContainer.appendChild(uvindexVar);

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
                
                var fiveDayContainer = document.getElementById('fiveDay')
                fiveDayContainer.setAttribute('class', 'container-fluid five-day-cont')
                fiveDayContainer.innerHTML = "";
                var fivedaytitle = document.createElement('h3')
                fivedaytitle.setAttribute('class', 'fw-bolder')
                fivedaytitle.textContent = "5 Day Forecast"
                fiveDayContainer.append(fivedaytitle)

                var cardContainerVar = document.createElement('div');
                cardContainerVar.setAttribute('class', 'd-flex flex-row justify-content-between cardContStyle');
                // cardContainerVar.setAttribute('style', 'width: 18rem;');
                fiveDayContainer.append(cardContainerVar);

                for (var index = 1; index <= 5; index++) {
                    var cardDivVar = document.createElement('div');
                    cardDivVar.setAttribute('class', 'card-body cardStyle');
                    cardContainerVar.appendChild(cardDivVar);

                    var cardContentVar = document.createElement('h5');
                    
                    var unixDate = new Date (secondData.daily[index].dt * 1000);
                    var date = unixDate.toLocaleString();

                    cardContentVar.innerHTML = date.slice(0,-12);
                    cardDivVar.appendChild(cardContentVar);

                    var iconSmall = document.createElement('img');
                    iconSmall.src = "http://openweathermap.org/img/wn/" + secondData.daily[index].weather[0].icon + ".png";
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

function pressEnter(event) {
    if (event.key === "Enter") {
        getCoordinateApi(userInput.value);
        document.getElementById('citySearch').value ="";
    }
};

function getCityInput(){
    getCoordinateApi(userInput.value);
    document.getElementById('citySearch').value ="";
};

userInput.onkeyup = pressEnter;

searchBtn.onclick = getCityInput;