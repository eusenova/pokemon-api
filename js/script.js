const url = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonBlock = document.querySelector('.pokemon-wrapper');
const input = document.getElementById('search');
const select = document.getElementById('select');
const prev = document.getElementById('prev-btn');
const next = document.getElementById('next-btn');

let pokemons = [];
let pokemonsWrapper;
let search;
let pageStart = 0;
let pageEnd = 10;

const favouriteHandler = id => {
    let arr =[];
    const favs = localStorage.getItem('favourite');
    const favsArr = JSON.parse(localStorage.getItem('favourite'));
    if(favs){
        if(favsArr.includes(id)){
            arr = favsArr.filter(i=>i!==id);
            console.log(1);
        }else{
            arr = [...favsArr,id];
            console.log(id);
        }
        localStorage.setItem('favourite', JSON.stringify(arr));
        makePokemonBlock();
    }else{
        console.log(3);

        localStorage.setItem('favourite',JSON.stringify([id]));
        makePokemonBlock();
    }
};

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
    pokemonsWrapper = document.createElement('div');
    pokemonsWrapper.className = 'pokemon-block';
    for (let index = 0; index < search.length; index++) {
        await getPokemonData(search[index].name);
        if(index === search.length-1){
            pokemonBlock.innerHTML='';
            pokemonBlock.append(pokemonsWrapper);
        }
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

const onSearch = async () => {
    pageStart = 0;
    pageEnd = 10;
    await makePokemonBlock();
};

const onSort = async () => {
    if(search){
        switch (select.value) {
            case 'az':
                search = search.sort(function (a, b) {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  });
                break;
            case 'za':
                search = search.sort(function (a, b) {
                    if (a.name > b.name) {
                      return -1;
                    }
                    if (a.name < b.name) {
                      return 1;
                    }
                    return 0;
                  });
                break;
            case 'id desc':
                search = search.sort(function (a, b) {
                    const aId = a.url.split('/');
                    const bId = b.url.split('/');
                    return +bId[bId.length-2] - +aId[aId.length-2];
                    ;
                  });
                break;
            case 'id asc':
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
                break;
            default:
                break;
        }
    for (let index = 0; index < search.length; index++) {
        if(index === 0){
            pokemonBlock.innerHTML='';
            pokemonsWrapper.innerHTML='';
        }
        await getPokemonData(search[index].name);
    }}
    pokemonBlock.append(pokemonsWrapper);
};

select.addEventListener('change', onSort);
input.addEventListener('input', onSearch);
prev.addEventListener('click', showPrev);
next.addEventListener('click', showNext);

const getPokemonData = async (name) => {
    const favs = localStorage.getItem('favourite');
    const favsArr = JSON.parse(localStorage.getItem('favourite'));
    const response = await fetch(url+name);
    const data = await response.json();
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card')
    const type = data.types.map(i=>i.type.name);
    const types = type.join();
    const names = data['name'][0].toUpperCase() + data['name'].slice(1);
    pokemonCard.classList.add(type[0]);
    let image;
    let favourite;
    if(favs&&favsArr.includes(data.id)){
        favourite=`<span onclick='favouriteHandler(${data.id});' class="fa fa-star checked"></span>`;
    }else{
        favourite=`<span onclick='favouriteHandler(${data.id});' class="fa fa-star"></span>`;
    }
    if(data.sprites.front_default){
        image=`<img src="${data.sprites.front_default}" alt="${names}" />`;
    } else {
        image = `<img src="../images/pokeball.png"}" alt="${names}" />`;
    }
    pokemonCard.innerHTML = `
        <div class="pokemon-card__img-container">
            ${image}
        </div>
        <div class="pokemon-card__info">
            <span class="pokemon-card__number">#${data.id.toString().padStart(4, '0')}</span>
            <h3 class="pokemon-card__name">${names}</h3>
            ${favourite}
            <div><small>EXP: <span>${data.base_experience}</span></small></div>
            <div><small>Main type: <span>${type[0]}</span></small></div>
            <div><small>Types: <span>${types}</span></small></div>
        </div>`;
    pokemonsWrapper.append(pokemonCard);
};

getPokemons(url);