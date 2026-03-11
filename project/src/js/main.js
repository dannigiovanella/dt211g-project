"use strict";


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

        //Vid fel av hämting av data
    } catch (error) {
        console.error("Fel vid hämtning av spel", error);
    }
}
//Anropa funktion
getGames();


//Sökfunktion



//1. Hämta data om spel från Rawg

//2. Lägg eventlyssnare på sökfunktion. Data som spel ska visas

//3. Skriv ut data i dom med info om spel och knapp till vidare info

//4. Hämta data (summering av spel) från wikipedia

//5. Lägg eventlyssnare på knappen för att visa mer info. Den ska visa summeringen från wiki

//.6 Filtera de 3 bäst rankade spelen

//7. Skriv ut topspelen i dom med spelinfo och knapp till summering (Toppspel ska ligga på startsida vid laddning)

//8. Dokumetera funktionerna

// Om tid finns. hitta api att addera mer info/lore till spelen