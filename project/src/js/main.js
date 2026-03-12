"use strict";

//APIer (url och nyckel)
//Rawg API
const rawgApi = "https://api.rawg.io/api/games";
const rawgKey = import.meta.env.VITE_RAWGAPIKEY;
//Wiki API


//Hämta data om spel från Rawg vid sökning av Far Cry
async function getGames(search = "Far Cry") {
    try {
        const url = `${rawgApi}?key=${rawgKey}&search=${encodeURIComponent(search)}&page_size=20`;
        const response = await fetch(url);
        const rawgData = await response.json();

        // Filtrerar resultaten så att bara far cry spel kommer upp vid sökning
        //Exluderar special editions
        const filteredGames = rawgData.results.filter(game =>
            !game.name.toLowerCase().includes("edition") &&
            !game.name.toLowerCase().includes("collection") &&
            !game.name.toLowerCase().includes("bundle")
        );
        //Sorterar spel så att högst rankade kommer fört
        const sortedGames = filteredGames.sort((a, b) => b.rating - a.rating);

        //Skickar data till funkton som skapar spelkort
        showGames(sortedGames);

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

        //Evenlyssnare för knapp till mer info. (Summering av spel från wiki)
        const infoBtn = gameCard.querySelectorAll(".showinfo");

        infoBtn.forEach(infoButton => {
            infoButton.addEventListener("click", () => {
                //Tömmer sökningarna
                gameDiv.innerHTML = "";
                //Hämtar data utifrån titel
                const gameTitle = infoButton.dataset.title;

                // Anropa funktion som hämtar info från wiki
                getInfo(game);

            });
        });
    });
}

//Funktion hämtar data från wikipedia. Summering av spel.
async function getInfo(game) {
    try {
        // Justering av mellanslag då Wiki använder underscore istället för mellanslag. 
        const wikiTitle = game.name.replaceAll(" ", "_");
        //Hämtar summering utifrån sidtitel
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;
        const response = await fetch(url);
        const wikiData = await response.json();

        //Hämtar id till div för spelsummering
        const infoDiv = document.querySelector("#gamesummary");

        // Skapar div inuti gamesummary som visar både info från rawg och wiki. skapar class till css
        infoDiv.innerHTML = `
      <div class="infocard">
        <img src="${game.background_image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p><strong>Released:</strong> ${game.released}</p>
        <p><strong>Rating:</strong> ${game.rating}</p>
        <hr>
        <p>${wikiData.extract || "No info found"}</p>
      </div>
    `;

    } catch (error) {
        console.error("Fel vid hämtning av info", error);
    }
}


//Funktion hämtar top 3 rankade spelen och visar på sidan vid laddning
async function getTopGames(search = "Far Cry") {
    try {
        const url = `${rawgApi}?key=${rawgKey}&search=${encodeURIComponent(search)}&page_size=20`;
        const response = await fetch(url);
        const rawgData = await response.json();

        // Filtrerar resultaten så att bara far cry spel kommer upp
        //Exluderar special editions
        const filteredGames = rawgData.results.filter(game =>
            !game.name.toLowerCase().includes("edition") &&
            !game.name.toLowerCase().includes("collection") &&
            !game.name.toLowerCase().includes("bundle")
        );
        //Sorterar spel så att högst rankade kommer fört
        const sortedGames = filteredGames.sort((a, b) => b.rating - a.rating);

        // Plockar ut dom tre bäst rankade
        const topGames = sortedGames.slice(0, 3);


        //Vid fel av hämting av data
    } catch (error) {
        console.error("Fel vid hämtning av topspel", error);
    }
}

//Funktion som visar topp 3 spelen

//1. Hämta data om spel från Rawg

//2. Lägg eventlyssnare på sökfunktion. Data som spel ska visas

//3. Skriv ut data i dom med info om spel och knapp till vidare info

//4. Hämta data (summering av spel) från wikipedia

//5. Lägg eventlyssnare på knappen för att visa mer info. Den ska visa summeringen från wiki

//.6 Filtera de 3 bäst rankade spelen

//7. Skriv ut topspelen i dom med spelinfo och knapp till summering (Toppspel ska ligga på startsida vid laddning)

//8. Dokumetera funktionerna

// Om tid finns. hitta api att addera mer info/lore till spelen