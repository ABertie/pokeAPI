const URL = new URLSearchParams(window.location.search)

const SCREEN = document.querySelector(".pokemonScreen")

SCREEN.innerHTML = `
    <h2 class="pokmonName">* *</h2>
    <img class="pokeImg" src="/img/pokeDexScreen.jpg" alt="pokedex">
    <div class="disc"></div>
    <h2 class="pokeID"><i class="fa-solid fa-bars"></i></h2>`

fetch(`https://pokeapi.co/api/v2/pokemon/${URL.get("name")}`)
    .then(function(response) {
        if (response.status === 200) {
            return response.json()
        } else {
            document.body.innerText="Ups, noget gik galt. Prøv igen senere"
        }
    })
    .then(function(data) {
        console.log(data);
        const DIV = document.querySelector(".pokemon")

        DIV.innerHTML = `
        <section class="pokeTypes">
            <h3 class="pokeTypes__header">Types:</h3>        
            <ul class="pokeTypes__list">
            ${data.types.map(elem => `<li class="${elem.type.name}">${elem.type.name}</li>`).join("")}
            </ul>
        </section>
        <div class="pokeSize">
            <p>Gns. height: ${data.height / 10} m</p>
            <p>Gns. weight: ${data.weight / 10} kg</p>
        </div>
        `

        SCREEN.innerHTML = `
        <h2 class="pokmonName">${data.species.name}</h2>
        <img class="pokeImg" src="${data.sprites.other.dream_world.front_default}" alt="${data.species.name}">
        <div class="disc"></div>
        <h2 class="pokeID">#${data.id}</h2>
        `
    })
