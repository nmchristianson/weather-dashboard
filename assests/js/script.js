//Selects the full document and gets it ready for any click events
$(document).ready(function(){

    let today = moment().format("MMM Do YY"); 
    let city;
    //Query selector of all html tags with the class = "main-dash"
    var main = $(".main-dash");
    
    //Retrieve any saved locations into loal storage
    let lastSearched = localStorage.getItem("city");
    
    //IF lastSearched = true
    if(lastSearched) {
    
    //Query selector for all HTML button tags
    let savedBtn = $('<button>');
    
        //Set the "id" attribute on the selected <button> tags to the value of lastSearched (aka a string that is the city)
        savedBtn.attr("id", lastSearched);
        savedBtn.addClass("city-button");
        savedBtn.text(lastSearched);
    
        $("#city-buttons").append(savedBtn);
    }
    
    function findWeather() {
        //Prevents the auto-refresh from happening when a button is clicked and this function is run
        event.preventDefault();
    
        //Unhide the area for weather
        main.attr("style", "opacity: 1;")
    
        //api for finding the weather
        var apiKey = "39c72bd60849c57e86e67367a53f8e2d";
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
    
            $(".city-name").text(`${response.name} (${today})`);
            $(".temp").text("Temperature: " + Math.floor((response.main.temp - 273.15) * 1.80 + 32) + "\xB0F");
            $(".humidity").text("Humidity: " + response.main.humidity + "%");
            $(".wind").text("Wind Speed: " + Math.floor((response.wind.speed)*2.237) + "mph");
        
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;
    
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            let uvIndex = response.current.uvi;
            $("#uvIndexSpan").text(uvIndex);
    
            if(uvIndex < 3) {
                $("#uvIndexSpan").attr("style", "background-color: rgb(0, 4, 39;");
            } else if (uvIndex > 5) {
                $("#uvIndexSpan").attr("style", "background-color: rgb(187, 213, 252);");
            } else {
                $("#uvIndexSpan").attr("style", "background-color: blue;");
            }
    
            for(let i = 0; i < 6; i++){
                let date = moment().add(i+1, 'days').calendar();
                let day = date.split(" ", 1);
                $(`#date${i}`).text(day);
    
                let icon = response.daily[i].weather[0].icon;
                $(`.weather-icon${i}`).attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
    
                let futureTempMin = Math.floor((response.daily[i].temp.min - 273.15) * 1.80 + 32);
                let futureTempMax = Math.floor((response.daily[i].temp.max - 273.15) * 1.80 + 32);
                $(`#temp${i}`).text(futureTempMin + "\xB0F/" + futureTempMax + "\xB0F");
    
                let futureHumidity = response.daily[i].humidity;
                $(`#humidity${i}`).text("Humidity: " + futureHumidity + "%");
            }
        });
    
        });
    }
    
    $("#search-button").on("click", function(event){
        city = $(".search-input").val();
    
        if(city === "") {
            event.preventDefault();
            alert("Please enter a city to view the weather.");
        } else {
            localStorage.setItem("city", city);
    
            let newBtn = $('<button>');
    
            newBtn.attr("id", city);
            newBtn.addClass("city-button");
            newBtn.text(city);
    
            $("#city-buttons").append(newBtn);
    
            findWeather();
        }
    });
    
    //This says SELECT the full body tag, and if the user clicks a tag with the class = "city-button", take what the id is
    //equal to (which is a city name) and plug into the findWeather() function to find the weather 
    $("body").on("click", ".city-button", function(event){
        city = $(this).attr("id");
        
        findWeather();
    });
    
    });