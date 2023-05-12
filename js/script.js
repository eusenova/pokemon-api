const url = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonBlock = document.querySelector('.pokemon-block');
const input = document.getElementById('search');
const select = document.getElementById('select');
const prev = document.getElementById('prev-btn');
const next = document.getElementById('next-btn');

let pokemons = [];
let search;
let pageStart = 0;
let pageEnd = 10;

const getPokemons = async (url) => {
    try {
        const response = await fetch(url+'?limit=1600');
        const data = await response.json();
        pokemons = data.results;
    } catch (e) {
        console.log(e);
        pokemonBlock.innerHTML = '<h3>Network problems</h3>'
    }
};
const makePokemonBlock = async () => {
    pokemonBlock.innerHTML = '<span class="loader"></span>';
    search = pokemons.filter(i=> i.name.includes(input.value.toLowerCase())).slice(pageStart,pageEnd);
    if(input.value === ''){
        search=[];
        pokemonBlock.innerHTML='';
    }else if(search.length === 0){
        pokemonBlock.innerHTML = '<h3>Not found</h3>'
    }
    for (let index = 0; index < search.length; index++) {
        if(index === 0){
            pokemonBlock.innerHTML='';
        }
        await getPokemonData(search[index].name)
    }
    select.value = 'id asc';
};

const showPrev = () => {
    if (pageStart) {
        pageStart-=10;
        pageEnd-=10;
        makePokemonBlock();
    }
};

const showNext = () => {
    if (pageEnd) {
        pageStart+=10;
        pageEnd+=10;
        makePokemonBlock();
    }
};

const onSearch = async (e) => {
    pageStart = 0;
    pageEnd = 10;
    makePokemonBlock();
};

const onSort = async (e) => {
    if(search){
    if(select.value === 'az'){
        search = search.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
    }else if(select.value === 'za'){
        search = search.sort(function (a, b) {
            if (a.name > b.name) {
              return -1;
            }
            if (a.name < b.name) {
              return 1;
            }
            return 0;
          });
    }else if(select.value === 'id desc'){
        search = search.sort(function (a, b) {
            const aId = a.url.split('/');
            const bId = b.url.split('/');
            return +bId[bId.length-2] - +aId[aId.length-2];
            ;
          });
    }else if(select.value === 'id asc'){
        search = search.sort(function (a, b) {
            const aId = a.url.split('/');
            const bId = b.url.split('/');
            if (Number(aId[aId.length-2]) < Number(bId[bId.length-2]) ){
              return -1;
            }
            if (Number(aId[aId.length-2]) > Number(bId[bId.length-2])) {
              return 1;
            }
            return 0;
          });
    }
    for (let index = 0; index < search.length; index++) {
        if(index === 0){
            pokemonBlock.innerHTML='';
        }
        await getPokemonData(search[index].name)
    }}
};

select.addEventListener('change', onSort);
input.addEventListener('input', onSearch);
prev.addEventListener('click', showPrev);
next.addEventListener('click', showNext);

const getPokemonData = async (name) => {
    const response = await fetch(url+name);
    const data = await response.json();
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card')
    const type = data.types.map(i=>i.type.name);
    const types = type.join();
    const names = data['name'][0].toUpperCase() + data['name'].slice(1);
    pokemonCard.classList.add(type[0]);
    if(data.sprites.front_default){
        pokemonCard.innerHTML = `
        <div class="pokemon-card__img-container">
            <img src="${data.sprites.front_default}" alt="${names}" />
        </div>
        <div class="pokemon-card__info">
            <span class="pokemon-card__number">#${data.id.toString().padStart(4, '0')}</span>
            <h3 class="pokemon-card__name">${names}</h3>
            <div><small>EXP: <span>${data.base_experience}</span></small></div>
            <div><small>Main type: <span>${type[0]}</span></small></div>
            <div><small>Types: <span>${types}</span></small></div>
        </div>`;
    } else {
        pokemonCard.innerHTML = `
        <div class="pokemon-card__img-container">
            <img src="../images/pokeball.png"}" alt="${names}" />
        </div>
        <div class="pokemon-card__info">
            <span class="pokemon-card__number">#${data.id.toString().padStart(4, '0')}</span>
            <h3 class="pokemon-card__name">${names}</h3>
            <div><small>EXP: <span>${data.base_experience}</span></small></div>
            <div><small>Main type: <span>${type[0]}</span></small></div>
            <div><small>Types: <span>${types}</span></small></div>
        </div>`;
    }
    pokemonBlock.append(pokemonCard);
}

getPokemons(url);