const URL = new URLSearchParams(window.location.search)
const OFFSET = parseInt(URL.get("offset") || 0)
const NEXT_PAGE = document.querySelector(".nextPage")
const PREVIOUS_PAGE = document.querySelector(".previousPage")

// if (OFFSET === 0 ) {PREVIOUS_PAGE.href = `?offset=${OFFSET + 1280}`}
// else PREVIOUS_PAGE.href = `?offset=${OFFSET - 10}`
// if (OFFSET === 1280) NEXT_PAGE.href = `?offset=${OFFSET - 1280}`
// else NEXT_PAGE.href = `?offset=${OFFSET + 10}`

fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${OFFSET}`)
    .then(function(response) {
        if (response.status === 200) {
            return response.json()
        } else {
            document.body.innerText="Ups, noget gik galt. Prøv igen senere"
        }
    })
    .then(function(data) {
        console.log(data);
        
        const UL = document.querySelector(".searchResult")

        const LAST_OFFSET = data.count - (data.count % 10)

        if (OFFSET === 0) {
            PREVIOUS_PAGE.style.display = "none"
            document.querySelector(".flipPage").style.justifyContent = "end"
        }
        PREVIOUS_PAGE.href = `?offset=${OFFSET - 10}`
        if (OFFSET === LAST_OFFSET) {NEXT_PAGE.style.display = "none"}
        NEXT_PAGE.href = `?offset=${OFFSET + 10}`
        
        // PREVIOUS_PAGE.href = `?offset=${Math.max(OFFSET - 10, 0)}`
        // NEXT_PAGE.href = `?offset=${Math.min(OFFSET + 10, LAST_OFFSET)}`
        
        // PREVIOUS_PAGE.href = `?offset=${OFFSET <= 0 ? 0 : OFFSET -10}`
        // NEXT_PAGE.href = `?offset=${OFFSET + 10 > data.count ? LAST_OFFSET : OFFSET + 10}`
        
        data.results.forEach(function(result) {
            const LI = document.createElement("li")
            LI.innerHTML = `<a href="/pokemon.html?name=${result.name}">${result.name}</a>`
            UL.append(LI)
            // UL.innerHTML +=`<li><a href="/pokemon.html?name=${result.name}">${result.name}</a></li>`
        });
    })