const url = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonBlock = document.querySelector('.favourites');
const favourite = document.querySelector('.fa');

const favouriteHandler = id => {
    let arr =[];
    const favs = localStorage.getItem('favourite');
    const favsArr = JSON.parse(localStorage.getItem('favourite'))
    if(favs){
        if(favsArr.includes(id)){
            arr = favsArr.filter(i=>i!==id);
        }else{
            arr = [...favsArr,id];
        }
        localStorage.setItem('favourite', JSON.stringify(arr));
        makePokemonBlock();
    }else{
        console.log(9);
        localStorage.setItem('favourite',JSON.stringify([id]));
        makePokemonBlock();
    }
};

const makePokemonBlock = async () => {
    const favs = localStorage.getItem('favourite');
    const favsArr = JSON.parse(localStorage.getItem('favourite'));
    pokemonBlock.innerHTML = '<span class="loader"></span>';
    if(favs&&favsArr.length){
        for (let index = 0; index < favsArr.length; index++) {
            if(index === 0){
                pokemonBlock.innerHTML='';
            }
            await getPokemonData(favsArr[index]);
        }
    }else{
        pokemonBlock.innerHTML = '<h3>No favourites yet</h3>';
    }
};

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
    pokemonBlock.append(pokemonCard);
};

makePokemonBlock();