
const pokemon = async () => {
    const pokemonname = document.getElementById("pokemonname").value.trim().toLowerCase();
    const pokeerror = document.getElementById("errorid");
    const pokeimage = document.getElementById("pokemonimage");

    pokeerror.textContent = "";
    pokeimage.style.display = "none";


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
        const pokemonimage = pokemonData.sprites.front_default;

        // Display the Pokémon image
        pokeimage.src = pokemonimage;
        pokeimage.style.display = "block"; // Show the image
    } catch (error) {
        pokeimage.style.display = "none";
        pokeerror.textContent = "Please enter a valid Pokémon name.";
        pokeerror.style.backgroundColor = "black";
        pokeerror.style.color = "red";
    }
};


const fetchSuggestions = async (query) => {
    if (query.length === 0) {
        document.getElementById("suggestions").innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`); // Fetch a list of Pokémon
        const data = await response.json();
        const pokemonList = data.results;

        // Filter the Pokémon names that match the query
        const filteredPokemon = pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().startsWith(query.toLowerCase())
        );

        showSuggestions(filteredPokemon);
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
