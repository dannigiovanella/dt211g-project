"use strict";

//APIer (url och nyckel)
//Rawg API
const rawgApi = "https://api.rawg.io/api/games";
const rawgKey = import.meta.env.VITE_RAWGAPIKEY;
//Wiki API



//Hämta data om spel från Rawg vid sökning av Far Cry
async function getGames(search = "Far Cry") {
    try {
        const url = `${rawgApi}?key=${rawgKey}&search=${(search)}`;
        const response = await fetch(url);
        const rawgData = await response.json();

        //Visar arrayen i konsol om det funkar
        console.log(rawgData.results);
        //Skickar data till funkton som skapar spelkort
        showGames(rawgData.results);

        //Vid fel av hämting av data
    } catch (error) {
        console.error("Fel vid hämtning av spel", error);
    }
}


//Sökfunktion - Eventlyssnare för sökfältet
//Hämtar ID för knapp och sökfält
const searchBtn = document.querySelector("#searchbtn");
const searchInput = document.querySelector("#searchinput");

searchBtn.addEventListener("click", () => {
    const searchValue = searchInput.value.trim();
    //Kör funktionen för att hämta data med vädret från input vid klick av knapp
    if (searchValue) {
        getGames(searchValue);
    }
});

//Funktion skapar kort som visar varje spel (skapar klass för css)
// Kort = Bild, spelnamn, releasedatum, knapp för mer info

function showGames(games) {
    //Hämtar id för div till att visa spel
    const gameDiv = document.querySelector("#searchresults");
    //Tömmer listan med sökningar
    gameDiv.innerHTML = "";
    //Skapar ett kort (div) med spelinfo och css-klass och knapp
    games.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.classList.add("gamecard");

        gameCard.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}">
      <h3>${game.name}</h3>
      <p>Released: ${game.released}</p>
      <button class="showinfo">Show info</button>
    `;
        //Lägger till div för spelkort i "searchresults"
        gameDiv.appendChild(gameCard);

    });
}

//Anropa funktion för att hämta spel
getGames();


//1. Hämta data om spel från Rawg

//2. Lägg eventlyssnare på sökfunktion. Data som spel ska visas

//3. Skriv ut data i dom med info om spel och knapp till vidare info

//4. Hämta data (summering av spel) från wikipedia

//5. Lägg eventlyssnare på knappen för att visa mer info. Den ska visa summeringen från wiki

//.6 Filtera de 3 bäst rankade spelen

//7. Skriv ut topspelen i dom med spelinfo och knapp till summering (Toppspel ska ligga på startsida vid laddning)

//8. Dokumetera funktionerna

// Om tid finns. hitta api att addera mer info/lore till spelen