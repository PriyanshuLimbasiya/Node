const pokemon = async () => {
    const pokemonname = document.getElementById("pokemonname").value.trim().toLowerCase();
    const pokeerror = document.getElementById("errorid");
    const pokeimage = document.getElementById("pokemonimage");
    const pokeinfo = document.getElementById("pokeinfo");
    const searchButton = document.getElementById("searchButton"); // Reference to the search button

    pokeerror.textContent = "";
    pokeimage.style.display = "";
    pokeinfo.innerHTML = ""; // Clear previous info

    // Validate input
    if (!pokemonname) {
        pokeerror.textContent = "Please enter a Pokémon name.";
        return;
    }

    try {

        const pokevalue = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonname}`);

        if (!pokevalue.ok) {
            throw new Error("Invalid Pokémon name");
        }

        const pokemonData = await pokevalue.json();
        const pokemonImageURL = pokemonData.sprites.front_default;

        if (pokemonImageURL) {
            pokeimage.src = pokemonImageURL;
            pokeimage.style.display = "block";
        } else {
            pokeimage.style.display = "none";
            pokeerror.textContent = "Image not available for this Pokémon.";
        }


        const hp = pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat;
        const attack = pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat;
        const defense = pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat;

        pokeinfo.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Pokémon Info</div>
                <div class="card-body">
                    <p><strong>Health (HP):</strong> ${hp}</p>
                    <p><strong>Attack:</strong> ${attack}</p>
                    <p><strong>Defense:</strong> ${defense}</p>
                </div>
            </div>
        `;

        // Hide Button
        searchButton.style.display = "none";

    } catch (error) {
        pokeimage.style.display = "none"; // Hide image 
        pokeerror.textContent = "Please enter a valid Pokémon name.";
        pokeerror.style.backgroundColor = "black";
        pokeerror.style.color = "red";
    }
};

//For Suggestions Fetching
const fetchSuggestions = async (query) => {
    if (query.length === 0) {
        document.getElementById("suggestions").innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`); // Fetch a list of Pokémon
        const data = await response.json();
        const pokemonList = data.results;


        const filteredPokemon = pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().startsWith(query.toLowerCase())
        );


        if (filteredPokemon.length === 0) {
            document.getElementById("suggestions").innerHTML = "<li>No matches found</li>";
        } else {
            showSuggestions(filteredPokemon);
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
};


const showSuggestions = (suggestions) => {
    const suggestionsList = document.getElementById("suggestions");
    suggestionsList.innerHTML = "";

    suggestions.forEach(suggestion => {
        const listItem = document.createElement("li");
        listItem.textContent = suggestion.name;
        listItem.onclick = () => {
            document.getElementById("pokemonname").value = suggestion.name;
            suggestionsList.innerHTML = "";
            pokemon();
        };
        suggestionsList.appendChild(listItem);
    });
};


document.getElementById("pokemonname").addEventListener("input", (e) => {
    const query = e.target.value;
    fetchSuggestions(query);
});


document.getElementById("pokemonname").addEventListener("focus", () => {
    document.getElementById("searchButton").style.display = "block"; // Show the search button
});
