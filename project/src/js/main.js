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

        // Döljer topspel när man söker
        document.querySelector("#topgames").style.display = "none";

        // Visar sökresultaten
        document.querySelector("#searchresults").style.display = "block";

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
                //Döljer topspel och sökresultat
                document.querySelector("#topgames").style.display = "none";
                document.querySelector("#searchresults").style.display = "none";


                //Hämtar data utifrån titel
                const gameTitle = infoButton.dataset.title;

                // Anropa funktion som hämtar info från wiki
                getInfo(game);

            });
        });
    });
}

//Funktion hämtar data från wikipedia. Summering av spel.
async function getInfo(game, from = "search") {
    try {
        // Justering av mellanslag då Wiki använder underscore istället för mellanslag. 
        const wikiTitle = game.name.replaceAll(" ", "_");
        //Hämtar summering utifrån sidtitel
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;
        const response = await fetch(url);
        const wikiData = await response.json();

        //Hämtar id till div för spelsummering
        const infoDiv = document.querySelector("#gamesummary");
        //Tömmer tidigare innehåll
        infoDiv.innerHTML = "";

        // Skapar div inuti gamesummary som visar både info från rawg och wiki. skapar class till css
        const infocard = document.createElement("div");
        infocard.classList.add("infocard");

        //Skapar en tillbakaknapp i show info med class för css
            const backBtn = document.createElement("button");
            backBtn.classList.add("backbtn");
            backBtn.textContent = "Back";
            //eventlyssnare som gör att sökresultat visas vid klick av back
            backBtn.addEventListener("click", () => {
                infoDiv.innerHTML = ""; 
                document.querySelector("#searchresults").style.display = "block";
            });
            //Knapp läggs till i div
            infocard.appendChild(backBtn);
        
        const infoContent = document.createElement("div");
        infoContent.innerHTML = `
        <div class="infocard">
        <img src="${game.background_image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p><strong>Released:</strong> ${game.released}</p>
        <p><strong>Rating:</strong> ${game.rating}</p>
        <hr>
        <p>${wikiData.extract || "No info found"}</p>
        </div>
    `;
        //Infocontetn läggs i div för infokortet. infokortet läggs i div för hela info
        infocard.appendChild(infoContent);
        infoDiv.appendChild(infocard);

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
        //Exluderar special editions och blood dragon(pga avvikande formaterad bild) 
        const filteredGames = rawgData.results.filter(game =>
            !game.name.toLowerCase().includes("edition") &&
            !game.name.toLowerCase().includes("collection") &&
            !game.name.toLowerCase().includes("bundle") &&
            !game.name.toLowerCase().includes("dragon")
        );
        //Sorterar spel så att högst rankade kommer fört
        const sortedGames = filteredGames.sort((a, b) => b.rating - a.rating);

        // Plockar ut dom tre bäst rankade
        const topGames = sortedGames.slice(0, 3);

        //Anropar funktion för att visa top 3 spel
        showTopGames(topGames);

        //Vid fel av hämting av data
    } catch (error) {
        console.error("Fel vid hämtning av topspel", error);
    }
}

//Funktion som visar topp 3 spelen
function showTopGames(games) {
    //Hämtar id för div till topspelen
    const topDiv = document.querySelector("#topgames");


    games.forEach(game => {
        //Skpar en div för spelkort
        const gameCard = document.createElement("div");
        gameCard.classList.add("topgamecard");
        //Skapar elementen i spelkort med data från rawg
        gameCard.innerHTML = `
            <img src="${game.background_image}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>Released: ${game.released}</p>
            <p>Rating: ${game.rating}</p>
            <button class="showinfo">Show info</button>
        `;
        //Knapp med samma utforming och syfte som show info i sökresultat
        const infoBtn = gameCard.querySelector(".showinfo");
        //Eventlissnare på knapp som hämtar samma info i funktion getInfo
        infoBtn.addEventListener("click", () => {
            //Döljer och sökresultat
            document.querySelector("#searchresults").style.display = "none";

            getInfo(game);
        });

        //LÄgger till spelkort med info i topgames (topDiv)
        topDiv.appendChild(gameCard);

    });
}

//Anropa funktion för att visa toppspelen vid laddning av sida
getTopGames();

//7. Skriv ut topspelen i dom med spelinfo och knapp till summering (Toppspel ska ligga på startsida vid laddning)

//8. Dokumetera funktionerna

// Om tid finns. hitta api att addera mer info/lore till spelen