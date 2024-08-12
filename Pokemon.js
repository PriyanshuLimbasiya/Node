const pokemon = async () => {
    const pokemonname = document.getElementById("pokemonname").value.toLowerCase();
    const pokevalue = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonname}`);

    if (!pokevalue.ok) {
        throw new Error("Could not fetch the data");
    }

    const pokemonData = await pokevalue.json();
    const pokemonimage = pokemonData.sprites.front_default;
    const pokeimage = document.getElementById("pokemonimage");

    pokeimage.src = pokemonimage;
    pokeimage.style.display = "block";
    
};

pokemon();
