const url = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonBlock = document.querySelector('.favourites');
const favourite = document.querySelector('.fa');

let search;

const favouriteHandler = id => {
    let arr =[];
    if(localStorage.getItem('favourite')){
        if(JSON.parse(localStorage.getItem('favourite')).includes(id)){
            arr = JSON.parse(localStorage.getItem('favourite')).filter(i=>i!==id);
        }else{
            arr = [...JSON.parse(localStorage.getItem('favourite')),id];
        }
        localStorage.setItem('favourite', JSON.stringify(arr));
        makePokemonBlock();
    }else{
        localStorage.setItem('favourite',JSON.stringify(arr));
    }
};

const makePokemonBlock = async () => {
    pokemonBlock.innerHTML = '<span class="loader"></span>';
    if(localStorage.getItem('favourite')
    &&JSON.parse(localStorage.getItem('favourite')).length){
        search = JSON.parse(localStorage.getItem('favourite'));
        for (let index = 0; index < search.length; index++) {
            if(index === 0){
                pokemonBlock.innerHTML='';
            }
            await getPokemonData(search[index]);
        }
    }else{
        pokemonBlock.innerHTML = '<h3>No favourites yet</h3>';
    }
};

const getPokemonData = async (name) => {
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
    if(localStorage.getItem('favourite')&&JSON.parse(localStorage.getItem('favourite')).includes(data.id)){
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
    pokemonBlock.append(pokemonCard);
};

makePokemonBlock();