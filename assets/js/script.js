const apiKey = "9f16d208ad1cda81d1b3a4d27caa60bf";

// https://openweathermap.org/api/one-call-3

// function getWeatherForecast takes in 2 parameters (city and country)
const getWeatherForecast = (city, country) => {
	// then it fetches the forecast and subs in the queries city, country and the API key
	fetch(
		`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			// Empty out the weather forecast so that we can return new data
			$("#weather-forecast").empty();
			console.log(data);
			// for each data list item we will then create a function that has an if statement
			data.list.forEach((item) => {
				// if the item.dt_text has 12:00 then we will create a const "forecastCard"
				if (item.dt_txt.includes("12:00:00")) {
					// forecastCard creates a div with a class of card col (to add bootstrap styling)
					const forecastCard = $("<div>")
						.addClass("card col")
						// append another div with the class "card body"(to add bootstrap styling)
						.append(
							$("<div>")
								.addClass("card-body")
								// then append a heading element <h5>
								.append(
									$("<h5>")
										// add the class card title to <h5> and the date, to the local date
										.addClass("card-title")
										.text(new Date(item.dt_txt).toLocaleDateString()),
									// pass in a image with the properties src to retrieve the weather icon
									$("<img>").prop({
										src: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
									}),
									// pass a paragraph element with the class "card text" (to add bootstrap styling)
									$("<p>")
										.addClass("card-text")
										// the text to include is rounding the temp received from kelvin to celcius
										.text(`Temp: ${Math.round(item.main.temp - 273.15)}°C`),
									// pass a paragraph element with the class "card text" (to add bootstrap styling)
									$("<p>")
										.addClass("card-text")
										// the text that is retrieved is the wind speed, miles per second
										.text(`Wind: ${item.wind.speed} m/s`),
									// pass a paragraph element with the class "card text" (to add bootstrap styling)
									$("<p>")
										.addClass("card-text")
										// the text that is rendered is the items humidity percentage
										.text(`Humidity: ${item.main.humidity}%`)
								)
						);
					$("#weather-forecast").append(forecastCard);
					// .appendTo("#weather-forecast");
				}
			});
		});
};
// create function getUV that takes in the latitude and the longitude
const getUV = (lat, lon) => {
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			// console.log(data, "HELLOOOOO");
			// creating a badge variable that renders bg primary (blue)
			let badge = "bg-primary";
			//if uv is less than or equal to 0.7 then badge will be bg-success (green)
			if (data.current.uvi <= 0.7) {
				badge = "bg-success";
			}
			//if uv is greater than 0.7 then badge will be bg-danger(red)
			if (data.current.uvi > 0.7) {
				badge = "bg-danger";
			}
			// creating a const variable that creates a div and adds the class of "card px-3 py-3 my-4"(bootstrap styling)
			const uvtext = $("<div>")
				.addClass("card px-3 py-3 my-4")
				// then it appends it to another div with the added class of "card-text"(bootstrap styling)
				.append(
					$("<div>")
						.addClass("card-text")
						// adding UV-Index and appending a span which adds the class styling "badge badge-pill" and calling the badge variable we created previously
						.html(`UV-Index: `)
						.append(
							$("<span>")
								.addClass(`badge badge-pill ${badge}`)
								// add in the data for the uvi
								.html(`${data.current.uvi}%`)
						)
				);
			$("#weather").append(uvtext);
		});
};
// create a function called getWeather which takes in the parameters of city and country code (default to US)
const getWeather = (city, countryCode = "US") => {
	/// Country code is only required if country is not USA
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			// create a weather card function that creates a div
			const weatherCard = $("<div>")
				// add class of "card px-3 py-3 my-4" (to add bootstrap styling)
				.addClass("card px-3 py-3 my-4")
				// then append it to a heading <h1> and add the class "card-title"
				.append(
					$("<h1>")
						.addClass("card-title")
						// add text of the name, the country and then moment formatting the date
						.text(
							`${data.name}, ${data.sys.country} - ${moment().format(
								"MMMM Do YYYY"
							)}`
						)
						// add to the front with prepend, the weather icon
						.prepend(
							`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
						),
					// create a paragraph element that adds the class of "card-text"
					$("<p>")
						.addClass("card-text")
						// rounding the text from kelvin to celcius
						.text(`Temp: ${Math.round(data.main.temp - 273.15)}°C`),
					// create a paragraph and then add the class "card-text"
					//the text that is retrieved is the wind speed, miles per second
					$("<p>").addClass("card-text").text(`Wind: ${data.wind.speed} m/s`),
					$("<p>")
						// create a paragraph and then add the class "card-text"
						.addClass("card-text")
						// the text that is rendered is the items humidity percentage
						.text(`Humidity: ${data.main.humidity}%`)
				);
			// emptying weather dom node before appending the data
			$("#weather").empty().append(weatherCard);
			// running getUV function with the city coordinates
			getUV(data.coord.lat, data.coord.lon);
		})
		// error handling, if something went wrong then alert and console log error
		.catch((e) => {
			alert("Something went wrong.. Please recheck the city and try again");
			console.error(e);
		});
};

// getting the element by Id "citySearch" and adding an event listener that listens for click and event
document.getElementById("citySearch").addEventListener("click", (e) => {
	e.preventDefault();
	// setting the search value to a constant search query variable
	const searchQuery = document.getElementById("search").value;
	// if the search query is greater than 0 length then let the previousSearches equal an empty array
	if (searchQuery.length > 0) {
		let previousSearches = [];
		// if the localStorage contains previousSearches then set previousSearches to the stored value
		if (localStorage.getItem("previousSearches") !== null) {
			previousSearches = JSON.parse(localStorage.getItem("previousSearches"));
		}
		//push the new search query into the previous searches and then set it to localStorage
		previousSearches.push(searchQuery);
		localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
		// then run the function with the new search query
		getWeather(searchQuery, "");
		getWeatherForecast(searchQuery, "");
		showPreviousSearches();
	}
});

// A Local Storage Function that parses the JSON (previousSearches)
// for each search, a constant variable that creates a list
const showPreviousSearches = () => {
	searches = JSON.parse(localStorage.getItem("previousSearches"));
	if (searches) {
		$("#previous-searches").empty();
		searches.forEach((search) => {
			const element = $(`<li>${search}</li>`).on("click", () => {
				getWeather(search, "");
				getWeatherForecast(search, "");
			});
			element.addClass("list-group-item search-history-item");
			$("#previous-searches").append(element);
		});
	}
};

// on first call we will run the weather for toronto
showPreviousSearches();
getWeather("Toronto", "CA");
getWeatherForecast("Toronto", "CA");
