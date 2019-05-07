function weather(city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=354538397448949ec40c126c21fade22"
  )
    .then(function(resp) {
      if (resp.ok) {
        // convert to json
        return resp.json();
      } else {
        // error display
        // hiding previous result
        $("#widget").attr("hidden", true);
        // adding wrong entry
        if ($("#wrong-entry-div").attr("hidden") == "hidden") {
          let wrongDiv = document.getElementById("wrong-entry-div");
          wrongDiv.removeAttribute("hidden");
          $("#wrong-entry").html("Wrong entry!");
          appear(wrongDiv);
        }
      }
    })
    .then(function(data) {
      if (data.cod == "200") {
        // hiding previous results
        $("#wrong-entry-div").attr("hidden", true);
        // FULL RESULT
        //console.log(data);

        if ($("#widget").attr("hidden") == "hidden") {
          $("#widget").attr("hidden", false);
          appear(widget);
        }

        // indices for today, tommorow, overmorrow ---- [0, 8, 16]
        addWeather(data, 0);

        $("#today").on("click", event => {
          addWeather(data, 0);
        });
        $("#tommorow").on("click", event => {
          addWeather(data, 8);
        });
        $("#over").on("click", event => {
          addWeather(data, 16);
        });
      }
    });
}

// smooth appearing of divs
function appear(element) {
  transition.begin(element, [
    "opacity",
    "0",
    "1",
    "300ms",
    "cubic-bezier(0.2,0.3,0.4,0.5)",
    "0s"
  ]);
}

function addWeather(data, i) {
  // Adding weather data
  // weather icon
  let iconClass = data.list[i].weather[0].id;
  let dn = data.list[i].weather[0].icon[2];
  var day = { d: "day", n: "night" };
  $("#weather-icon").attr("class", "wi wi-owm-" + day[dn] + "-" + iconClass);

  // openweather weather icon
  // $("#weather-icon").attr('src', "http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png");

  // city & country ---- data.city.name, data.city.country
  // date ---- data.list[0].dt_txt.split(" ")[0]
  // temperature ---- parseInt(data.list[0].main.temp-273)+ "°"
  // condition ---- data.list[0].weather[0].main, data.list[0].weather[0].description

  $("#city").html(data.city.name + ", " + data.city.country);
  let date = data.list[i].dt_txt.split(" ")[0].split("-");
  $("#date").html(date[2] + "." + date[1] + "." + date[0]);
  $("#temp").html(parseInt(data.list[8].main.temp - 273) + "°");
  $("#desc").html(data.list[i].weather[0].main);
  $("#desc-extra").html(data.list[i].weather[0].description);
}

var widget = document.getElementById("widget");

// After pressing enter on search
$("#search").on("keyup", event => {
  if (event.key === "Enter") {
    if ($("#search").val() != "") {
      weather($("#search").val());
      // reset input field
      $("#search").val("");
    }
  }
});
// After pressing submit on (non-empty) search
$("#submit").on("click", event => {
  if ($("#search").val() != "") {
    console.log($("#search").val());
    weather($("#search").val());
    $("#search").val("");
  }
});

$(document).ready(() => {
  $("#search").focus();
});

// Get all the tabs
const tabs = document.querySelectorAll(".tab");

tabs.forEach(clickedTab => {
  clickedTab.addEventListener("click", () => {
    // Remove the active class from all the tabs
    tabs.forEach(tab => {
      tab.classList.remove("active");
    });

    // Add the active class on the clicked tab
    clickedTab.classList.add("active");

    let clickedBGColor = getComputedStyle(clickedTab).getPropertyValue("color");

    // adding improvised hover effect for weather-icon
    $("#weather-icon").on("mouseenter", () => {
      $("#weather-icon").css("color", clickedBGColor);
    });
    $("#weather-icon").on("mouseleave", () => {
      $("#weather-icon").css("color", "black");
    });

    // changing background
    switch (clickedBGColor) {
      case "rgb(60, 128, 15)":
        document.body.style.background =
          "linear-gradient(270deg, rgba(174,238,174,1) 0%, rgba(124,189,80,1) 100%)";
        break;
      case "rgb(201, 55, 157)":
        document.body.style.background =
          "linear-gradient(270deg, rgba(236,193,223,1) 0%, rgba(212,90,175,1) 100%)";
        break;
      case "rgb(230, 169, 25)":
        document.body.style.background =
          "linear-gradient(270deg, rgba(242,221,170,1) 0%, rgba(230,169,25,1) 100%)";
        break;
    }
  });
});
