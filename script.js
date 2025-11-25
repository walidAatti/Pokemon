let pokemonList = [];

async function loadPokemonList() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        pokemonList = data.results.map(pokemon => pokemon.name);
        console.log("Pokemon list loaded:", pokemonList.length);
    } catch (error) {
        console.log("Error loading Pokemon list:", error);
    }
}

async function fetchData() {
    let pokemonName = document.querySelector(".pokemonName").value.toLowerCase().trim();

    if (!pokemonName) {
        alert("Please enter a Pokemon name");
        return;
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
        document.querySelector(".pokemon-card").innerHTML = `<p style="color: #d32f2f; font-size: 24px;font-weight: 800;">No Pokemon with this name</p>`;
        return;
    }

    const data = await response.json();

    const imgUrl = data.sprites.front_default;
    const backImg = data.sprites.back_default;
    const name = data.name.toUpperCase();
    const height = (data.height / 10).toFixed(1);
    const weight = (data.weight / 10).toFixed(1);
    const id = data.id;
    const abilities = data.abilities.map(ability => ability.ability.name).join(", ");
    const stats = data.stats.map(stat => [stat.stat.name, stat.base_stat]);
    const moves = data.moves.map(move => move.move.name).slice(0, 10).join(", ");
    const types = data.types.map(type => type.type.name);

    // types HTML
    const typesHTML = types.map(type => `<span class="type">${type}</span>`).join("");

    // stats HTML
    const statsHTML = stats.map(stat => `<li>${stat[0]}: ${stat[1]}</li>`).join("");

    // card HTML
    const cardHTML = `
        <h2 class="pokemon-name">${name}</h2>
        <p class="pokemon-id">#${String(id).padStart(3, '0')}</p>

        <div class="imgs">
            <img class="pokemon-img" src="${imgUrl}" alt="${name}">
            <img class="pokemon-img" src="${backImg}" alt="${name}">
        </div>
        
        <div class="types">
            ${typesHTML}
        </div>

        <div class="stats">
            <h3>Stats</h3>
            <ul>
                ${statsHTML}
            </ul>
        </div>

        <div class="abilities">
            <h3>Abilities</h3>
            <p>${abilities}</p>
        </div>

        <div class="size">
            <p>Height: ${height} m</p>
            <p>Weight: ${weight} kg</p>
        </div>

        <div class="moves">
            <h3>Moves</h3>
            <p>${moves}</p>
        </div>
    `;

    document.querySelector(".pokemon-card").innerHTML = cardHTML;
    document.querySelector(".suggestions").innerHTML = "";
}

function showSuggestions(value) {
    const suggestionsDiv = document.querySelector(".suggestions");
    
    if (value.length === 0) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    const filtered = pokemonList.filter(pokemon => 
        pokemon.startsWith(value.toLowerCase())
    ).slice(0, 10);

    if (filtered.length === 0) {
        suggestionsDiv.innerHTML = "";
        return;
    }

    suggestionsDiv.style.borderBottom = "2px solid #ddd";
    suggestionsDiv.innerHTML = filtered.map(pokemon => 
        `<div class="suggestion-item" onclick="selectPokemon('${pokemon}')">${pokemon}</div>`
    ).join("");
}

function selectPokemon(name) {
    document.querySelector(".pokemonName").value = name;
    document.querySelector(".suggestions").innerHTML = "";
    fetchData();
}

function saveData() {
    let input = document.querySelector(".pokemonName");

    input.onkeyup = (e) => {
        sessionStorage.setItem("value", input.value.trim());
        showSuggestions(input.value.trim());
    };
    
    const savedValue = sessionStorage.getItem("value");
    if (savedValue) input.value = savedValue;
}

document.body.addEventListener("keydown", e => {
    if (e.key === "Enter") fetchData();
});

saveData();
loadPokemonList();