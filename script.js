const apiKey = "9f16d208ad1cda81d1b3a4d27caa60bf";

// https://openweathermap.org/api/one-call-3

const getWeather = (city, countryCode) => {
	/// Country code is only required if country is not USA
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			document.getElementById("city").innerHTML = `${
				data.name
			}, ${moment().format("MMMM Do YYYY")}`;
			document.getElementById("temp").innerHTML = Math.round(
				data.main.temp - 273.15
			);
			document.getElementById("wind").innerHTML = data.wind.speed;
			document.getElementById("humidity").innerHTML = data.main.humidity;
			document.getElementById("uv").innerHTML = data.uvi;
		})
		.catch((e) => console.error(e));
};

document.getElementById("citySearch").addEventListener("click", (e) => {
	e.preventDefault();
	const searchQuery = document.getElementById("search").value;
	if (searchQuery.length > 0) {
		getWeather(searchQuery, "");
	}
});

// on first call we will run the weather for toronto
getWeather("Toronto", "CA");
// after searching for a city get current weather conditions (for that city) and then that city is added to search history

//include success vs modal error 404 response
// 5-Day Forecast, icons come from open weather
//
