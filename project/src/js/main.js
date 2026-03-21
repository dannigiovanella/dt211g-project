"use strict";


//APIer (url och nyckel)
//Rawg API
const rawgApi = "https://api.rawg.io/api/games";
const rawgKey = import.meta.env.VITE_RAWGAPIKEY;

//Wiki API: `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;

// HÄMTA SPELDATA (RAWG)

/**
 * Hämtar data om spel från Rawg API utifrån en sökterm.
 * Filtrerar resultaten så att endast relevanta Far Cry spel visas.
 * Funktionen är asynkron och returnerar en Promise utan värde, men skickar datan till funktionen showGames
 * 
 * @param {string} search - Söksträngen som användaren anger i input
 * @returns {Promise<void>} 
 */
async function getGames(search) {
    try {
        const url = `${rawgApi}?key=${rawgKey}&search=${encodeURIComponent(search)}&page_size=20`;
        const response = await fetch(url);
        const rawgData = await response.json();

        // Filtrerar resultaten så att bara relevanta far cry spel kommer upp vid sökning
        const filteredGames = rawgData.results.filter(game => {
            const name = game.name.toLowerCase();
            return name.startsWith("far cry") &&
                !name.includes("edition") &&
                !name.includes("collection") &&
                !name.includes("bundle");
        });

        //Skickar data till funkton som skapar spelkort
        showGames(filteredGames);

    } catch (error) {
        console.error("Fel vid hämtning av spel", error);
    }
}

// SÖKFUNKTION

//Hämtar ID för knapp och sökfält
const searchBtn = document.querySelector("#searchbtn");
const searchInput = document.querySelector("#searchinput");
//Hämtar id till div för felmeddelande
const messageDiv = document.querySelector("#searchmessage");
//Sökfunktion - Eventlyssnare för sökfältet
searchBtn.addEventListener("click", () => {

    //Animation för knapp
    //Knapp får class som tas bort tillfälligt för att kunna uppdateras och kunna köras igen vid nästa klick
    searchBtn.classList.remove("click");
    void searchBtn.offsetWidth;
    searchBtn.classList.add("click");

    const searchValue = searchInput.value.trim().toLowerCase();
    //Kör funktionen för att hämta data med vädret från input vid klick av knapp
    //Värdet i input måste innehålla antingen far eller cry annar visas felmeddelande

    if (!searchValue.toLowerCase().includes("far") && !searchValue.toLowerCase().includes("cry")) {
        messageDiv.textContent = "Needs at least 'far' or 'cry'";
        return;
    }
    //Gör så att rubrik för sökresultat visar vad man sökt på i rubrik
    document.querySelector("#searchtitle").textContent = `Search result: ${searchValue}`;

    //Tömmer sökfältet efter sökning
    searchInput.value = "";

    // Om input är rätt, töm meddelandet
    messageDiv.textContent = "";

    //Tömmer show info vid sökning
    document.querySelector("#gamesummary").innerHTML = "";

    // göm toppspel om det görs en sökning
    document.querySelector("#topgames").style.display = "none";

    // Döljer topspel när man söker
    document.querySelector("#topgames").style.display = "none";

    // Visar sökresultaten
    document.querySelector("#searchresults").style.display = "flex";

    //Anropar funktion getgames 
    getGames(searchValue);

});

// VISA SPEL (SÖKNING)

/**
 * Skapar och visar klickbara cards baserat på en lista av far cry spel vid sökning.
 * Varje card innehåller: Bild, titel och releasedatum
 * 
 * @param {Object[]} games - Lista (array) med objekt för spelen från API
 * @returns {void} - Returnerar inget värde
 */

function showGames(games) {
    //Hämtar id för div till att visa spel
    const gameDiv = document.querySelector("#searchresults");
    //Visar rubrik för sökresultat
    document.querySelector("#searchtitle").style.display = "block";
    //Döljer rubrik för top spel
    document.querySelector("#toptitle").style.display = "none";

    //Tömmer listan med sökningar
    gameDiv.innerHTML = "";
    //Skapar ett kort (div) med spelinfo och css-klass och knapp
    games.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.classList.add("gamecard");

        gameCard.innerHTML = `
      <img src="${game.background_image}" alt="${game.name} loading="lazy">
      <h3>${game.name}</h3>
      <p>Released: ${game.released}</p>
    `;
        // Eventlyssnare som gör så att hela kortet blir klickbart
        gameCard.addEventListener("click", () => {

            // Döljer topspel och sökresultat
            document.querySelector("#topgames").style.display = "none";
            document.querySelector("#searchresults").style.display = "none";

            //Anropar funktion för att hämta mer info om spel utifrån sökning
            getInfo(game, "search");

        });

        // Lägger till kortet i gamediv
        gameDiv.appendChild(gameCard);

    });

}

// HÄMTAR SPELINFORMATON (WIKI)

/**
 * Hämtar information om ett spel från Wikipedia utifrån titel.
 * Visar denna information på sidan tillsammans med information från Rawg.
 * Informationssida visar: Bild, titel, realeasedatum, rating och information.
 * Funktionen är asynkron och returnerar en Promise utan värde.
 * 
 * @param {Object} game - Objekt med information om spel från Rawg API
 * @param {string} [from="search"] - Berättar var användaren kom ifrån (search eller top, för att kunna gå tillbaka på rätt sätt med tillbakaknapp)
 * @returns {Promise<void>}
 */
async function getInfo(game, from = "search") {
    try {
        // Wiki använder understreck istället för mellanslag 
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

        //TILLBAKA-KNAPP

        //Skapar en tillbakaknapp i show info med class för css
        const backBtn = document.createElement("button");
        backBtn.classList.add("backbtn");
        backBtn.innerHTML = `<img src="./images/backicon.png" alt="Back">`;

        //eventlyssnare som gör att sökresultat visas vid klick av back
        backBtn.addEventListener("click", () => {

            infoDiv.innerHTML = "";
            if (from === "search") {
                // Visa sökresultaten
                document.querySelector("#searchresults").style.display = "flex";
            } else if (from === "top") {
                // Visa toppspelen igen
                document.querySelector("#topgames").style.display = "flex";
            }
        });
        //Knapp läggs till i div
        infocard.appendChild(backBtn);

        //Skapar div med samlad information om spel. "No info" om information saknas
        const infoContent = document.createElement("div");
        infoContent.innerHTML = `
        <div class="infocard">
        <img src="${game.background_image}" alt="${game.name} loading="lazy">
        <h3>${game.name}</h3>
        <p><strong>Released:</strong> ${game.released}</p>
        <p><strong>Rating:</strong> ${game.rating}</p>
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


// HÄMTA TOP 3 SPEL

/**
 * Hämtar och visar de tre högst rankade Far Cry-spelen vid laddning av sida från Rawg API.
 * Filtrerar bort ej relevanta titlar och sorterar fram de högst rankade.
 * Funktionen är asynkron och returnerar en Promise utan värde.
 *
 * @param {string} [search="Far Cry"] - Sökterm för att hämta specifik Far cry- spel
 * @returns {Promise<void>}
 */
async function getTopGames(search = "Far Cry") {
    try {
        const url = `${rawgApi}?key=${rawgKey}&search=${encodeURIComponent(search)}&page_size=20`;
        const response = await fetch(url);
        const rawgData = await response.json();

        // Filtrerar resultaten så att bara relevanta far cry spel kommer upp
        const filteredGames = rawgData.results.filter(game =>
            game.name.toLowerCase().includes("far cry") &&
            //exkluderar:
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

    } catch (error) {
        console.error("Fel vid hämtning av topspel", error);
    }
}

// VISA TOP 3 SPEL

/**
 * Visar topp 3 spel på sidan baserat på ratings från Rawg API.
 * Skapar klickbara cards som innehåller: Bild, titel och rating
 *
 * @param {Object[]} games - Lista (array) med toppspel
 * @returns {void} - Returnerar inget värde
 */
function showTopGames(games) {
    //Hämtar id för div till topspelen
    const topDiv = document.querySelector("#topgames");

    // Visa rubrik för top spel
    document.querySelector("#toptitle").style.display = "block";

    games.forEach(game => {
        //Skpar en div för spelkort
        const gameCard = document.createElement("div");
        gameCard.classList.add("topgamecard");
        //Skapar elementen i spelkort med data från rawg
        gameCard.innerHTML = `
            <img src="${game.background_image}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>Rating: ${game.rating}</p>
        `;
        // Eventlyssnare som gör hela kortet klickbart hela kortet klickbart
        gameCard.addEventListener("click", () => {

            // göm toppspel när man klickar in på spelet
            document.querySelector("#topgames").style.display = "none";

            //Döljer och sökresultat
            document.querySelector("#searchresults").style.display = "none";
            //Döljer rubrik för sökreultat
            document.querySelector("#searchtitle").style.display = "none";

            //Anropar funktion för att hämta mer info om spel
            getInfo(game, "top");
        });

        //LÄgger till spelkort med info i topgames (topDiv)
        topDiv.appendChild(gameCard);

    });
}

//Anropa funktion för att visa toppspelen vid laddning av sida
getTopGames();

//8. Dokumetera funktionerna

// Om tid finns. hitta api att addera mer info/lore till spelen