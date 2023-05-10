const url = 'https://pokeapi.co/api/v2/pokemon/?limit=1600';
const imageUrl = 'https://img.pokemondb.net/artwork/large/';

const getPokemonData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const pokemons = data['results'].slice(0,10);
        let search = pokemons.filter(i=> i.name.includes('saur'));
        console.log(search);
    } catch (e) {
        console.log(e);
    }
};

getPokemonData(url);