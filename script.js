function getInfo() {
    document.body.innerText = "Loading..."

    fetch(" https://pokeapi.co/api/v2/pokemon/eevee")
        .then(function(response) {
            if (response.status === 200) {
            return response.json()
            }
        })
        .then(function(result) {
            console.log(result);
            document.body.innerHTML = 
            `
            <h1>${result.species.name}</h1>
            <p>pokemon type:${result.types[0].type.name}</p>
            <ul class"ability"></ul>
            `
            // abilities.forEach(element => {
            //     // ability.appendChild(document.createElement("li").innerHTML = element.ability)
            //     console.log(element);
            // });
        })
}

const button = document.querySelector(".begin")
button.addEventListener("click", getInfo)