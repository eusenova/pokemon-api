const url = 'https://pokeapi.co/api/v2/pokemon/';
const imageUrl = 'https://img.pokemondb.net/artwork/large/';
const pokemonBlock = document.querySelector('.pokemon-block');
const input = document.getElementById('search');
let pokemons = [];
let search;

const getPokemons = async (url) => {
    try {
        const response = await fetch(url+'?limit=1600');
        const data = await response.json();
        pokemons = data.results.slice(0,10);
    } catch (e) {
        console.log(e);
        pokemonBlock.innerHTML = '<h3>Network problems</h3>'
    }
};

const onSearch = e => {
    pokemonBlock.innerHTML = '<span class="loader"></span>';
    search = pokemons.filter(i=> i.name.includes(e.target.value.toLowerCase()));
    if(e.target.value === ''){
        search=[];
        pokemonBlock.innerHTML='';
    }else if(search.length === 0){
        pokemonBlock.innerHTML = '<h3>Not found</h3>'
    }
    for (let index = 0; index < search.length; index++) {
        if(index === 0){
            pokemonBlock.innerHTML='';
        }
        getPokemonData(search[index].name)
    }
};

input.addEventListener('input', onSearch);

const getPokemonData = async (name) => {
    const response = await fetch(url+name);
    const data = await response.json();
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card')
    const type = data.types.map(i=>i.type.name);
    const types = type.join();
    const names = data['name'][0].toUpperCase() + data['name'].slice(1);
    pokemonCard.classList.add(type[0]);
    pokemonCard.innerHTML = `
    <div class="pokemon-card__img-container">
        <img src="${imageUrl + data.name}.jpg" alt="${names}" />
    </div>
    <div class="pokemon-card__info">
        <span class="pokemon-card__number">#${data.id.toString().padStart(4, '0')}</span>
        <h3 class="pokemon-card__name">${names}</h3>
        <div><small>EXP: <span>${data.base_experience}</span></small></div>
        <div><small>Main type: <span>${type[0]}</span></small></div>
        <div><small>Types: <span>${types}</span></small></div>
    </div>
`;
    pokemonBlock.append(pokemonCard);
}

getPokemons(url);