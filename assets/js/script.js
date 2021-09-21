var userInput = document.querySelector("#citySearch");

// Call the API
function getCoordinateApi() {
    var requestUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + userInput.value + "&appid=d8a9dd36291435cdba31ee628d84c869";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            return data
        })

};

// var longitude = data.coord.lon;
// var latitude = data.coord.lat;

// function getOneCallApi() {
//     var requestOneUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=d8a9dd36291435cdba31ee628d84c869"
// };

searchBtn.onclick = getCoordinateApi;