const apiKey = "9f16d208ad1cda81d1b3a4d27caa60bf";

// https://openweathermap.org/api/one-call-3

const showPreviousSearches = () => {
	searches = JSON.parse(localStorage.getItem("previousSearches"));
	if (searches) {
		$("#previous-searches").empty();
		searches.forEach((search) => {
			$("#previous-searches").append(`<li>${search}</li>`);
		});
	}
};

const getWeatherForecast = (city, country) => {
	fetch(
		`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			$("#weather-forecast").empty();
			console.log(data);
			data.list.forEach((item) => {
				if (item.dt_txt.includes("12:00:00")) {
					const forecastCard = $("<div>")
						.addClass("card col")
						.append(
							$("<div>")
								.addClass("card-body")
								.append(
									$("<h5>")
										.addClass("card-title")
										.text(new Date(item.dt_txt).toLocaleDateString()),
									$("<img>").prop({
										src: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
									}),
									$("<p>")
										.addClass("card-text")
										.text(`Temp: ${Math.round(item.main.temp - 273.15)}°C`),
									$("<p>")
										.addClass("card-text")
										.text(`Wind: ${item.wind.speed} m/s`),
									$("<p>")
										.addClass("card-text")
										.text(`Humidity: ${item.main.humidity}%`)
								)
						);
					$("#weather-forecast").append(forecastCard);
					// .appendTo("#weather-forecast");
				}
			});
		});
};

const getWeather = (city, countryCode) => {
	/// Country code is only required if country is not USA
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			const weatherCard = $("<div>")
				.addClass("card px-3 py-3 my-4")
				.append(
					$("<h1>")
						.addClass("card-title")
						.text(
							`${data.name},${data.sys.country} ${moment().format(
								"MMMM Do YYYY"
							)}`
						)
						.prepend(
							`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
						),

					$("<p>")
						.addClass("card-text")
						.text(`Temp: ${Math.round(data.main.temp - 273.15)}°C`),
					$("<p>").addClass("card-text").text(`Wind: ${data.wind.speed} m/s`),
					$("<p>")
						.addClass("card-text")
						.text(`Humidity: ${data.main.humidity}%`)
				);

			$("#weather").empty().append(weatherCard);
		})
		.catch((e) => console.error(e));
};

document.getElementById("citySearch").addEventListener("click", (e) => {
	e.preventDefault();
	const searchQuery = document.getElementById("search").value;
	if (searchQuery.length > 0) {
		let previousSearches = [];
		if (localStorage.getItem("previousSearches") !== null) {
			previousSearches = JSON.parse(localStorage.getItem("previousSearches"));
		}
		previousSearches.push(searchQuery);
		localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
		getWeather(searchQuery, "");
		getWeatherForecast(searchQuery, "");
		showPreviousSearches();
	}
});

// on first call we will run the weather for toronto
showPreviousSearches();
getWeather("Toronto", "CA");
getWeatherForecast("Toronto", "CA");
