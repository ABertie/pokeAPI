const URL = new URLSearchParams(window.location.search)
const OFFSET = parseInt(URL.get("offset") || 0)
const NEXT_PAGE = document.querySelector(".nextPage")
const PREVIOUS_PAGE = document.querySelector(".previousPage")

const SPINNER = document.querySelector(".spinner")
const UL = document.querySelector(".searchResult")

// if (OFFSET === 0 ) {PREVIOUS_PAGE.href = `?offset=${OFFSET + 1280}`}
// else PREVIOUS_PAGE.href = `?offset=${OFFSET - 10}`
// if (OFFSET === 1280) NEXT_PAGE.href = `?offset=${OFFSET - 1280}`
// else NEXT_PAGE.href = `?offset=${OFFSET + 10}`

fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${OFFSET}`)
    .then(function(response) {
        if (response.status !== 200) 
            throw new Error("fejlbesked")
        return response.json()
    })
    .then(function(data) {
        console.log(data);

        SPINNER.style.display = "none"

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
            makeLiResult(result.name)
            // UL.innerHTML +=`<li><a href="/pokemon.html?name=${result.name}">${result.name}</a></li>`
        });
    })
    .catch(function (error) {
        window.location.href="/couldNotFind.html"
    })

    
function makeLiResult(pokemonName) {
    const LI = document.createElement("li")
    LI.innerHTML = `<a href="/pokemon.html?name=${pokemonName}">${pokemonName}</a>`
    UL.append(LI)
}

const FORM = document.querySelector(".searchForm")
const INPUT = FORM.querySelector(".search")
const SEARCH_OBTIONS = FORM.querySelector("#searchObtions")
const SELECT = FORM.querySelector("select")

INPUT.addEventListener("focus", focusHandler)
INPUT.addEventListener("focusout", function() {
    SEARCH_OBTIONS.innerHTML = ""
})
FORM.addEventListener("submit", submitHandler)

function focusHandler() {
    if (SELECT.value === "pokemon") {
        makeSearchOption(`https://pokeapi.co/api/v2/pokemon?limit=1300`)
    }
    else if (SELECT.value === "type") {
        makeSearchOption(`https://pokeapi.co/api/v2/type`)
    }

    function makeSearchOption(haystack) {
        fetch(haystack)
            .then(function(response) {
                if (response.status !== 200) 
                    throw new Error("fejlbesked")
                return response.json()
            })
            .then(function(data) { 
                data.results.forEach(function(element) {
                    SEARCH_OBTIONS.innerHTML += `<option>${element.name}</option>`
                })
            })
            .catch(function (error) {
                window.location.href="/couldNotFind.html"
            })
    }
    
}


function submitHandler(event) {
    event.preventDefault()

    UL.innerHTML = ""

    document.querySelector(".flipPage").innerHTML = `
    <button class="previousResult"><i class="fa-solid fa-chevron-left"></i></button>
    <button class="nextResult"><i class="fa-solid fa-chevron-right"></i></button>
    `

    const PREVIOUS_RESULTS = document.querySelector(".previousResult")
    const NEXT_RESULTS = document.querySelector(".nextResult")

    const ARRAY = []

    let firstSlice = 0
    let lastSlice = firstSlice + 10

    function checkForPreviousButton() {
        if (firstSlice === 0) {
            PREVIOUS_RESULTS.style.display = "none"
            document.querySelector(".flipPage").style.justifyContent = "end"
        } else {
            PREVIOUS_RESULTS.style.display = "block"
            document.querySelector(".flipPage").style.justifyContent = "space-between"
        }
    }
    
    function checkForNextButton() {
        if (firstSlice === (ARRAY.length - (ARRAY.length % 10))) NEXT_RESULTS.style.display = "none"
        else NEXT_RESULTS.style.display = "block"
    }

    function sliceArray() {
        lastSlice = firstSlice + 10

        UL.innerHTML = ""

        ARRAY.slice(firstSlice, lastSlice).forEach(function(element) {
            makeLiResult(element)
        })

        checkForPreviousButton()
    }

    if (SELECT.value === "pokemon") {
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=1300`)
            .then(function(response) {
                if (response.status !== 200) 
                    throw new Error("fejlbesked")
                return response.json()
            })
            .then(function(data) {
                data.results.forEach(function(pokemon) {
                    if (pokemon.name.includes(event.target.name.value.toLowerCase())) {
                        ARRAY.push(pokemon.name)
                    } 
                })
                checkForPreviousButton()
                checkForNextButton()
                PREVIOUS_RESULTS.addEventListener("click", function () {
                    firstSlice = firstSlice - 10
                    sliceArray()
                    checkForNextButton()
                })
                NEXT_RESULTS.addEventListener("click", function () {
                    firstSlice = firstSlice + 10
                    sliceArray()
                    checkForNextButton()
                })
                sliceArray()
            })
            .catch(function (error) {
                window.location.href="/couldNotFind.html"
            })
    } 
    else if (SELECT.value === "type") {
        fetch(`https://pokeapi.co/api/v2/type`)
            .then(function(response) {
                if (response.status !== 200) 
                    throw new Error("fejlbesked")
                return response.json()
            })
            .then(function(data) {
                data.results.forEach(function(element) {
                    if (element.name === event.target.name.value) {
                        fetch(element.url)
                            .then(function(response) {
                                if (response.status !== 200) 
                                    throw new Error("fejlbesked")
                                return response.json()
                            })
                            .then(function(data) {                
                                data.pokemon.forEach(function(element) {
                                    // makeLiResult(element.pokemon.name)
                                    ARRAY.push(element.pokemon.name)
                                })
                                checkForPreviousButton()
                                checkForNextButton()
                                PREVIOUS_RESULTS.addEventListener("click", function () {
                                    firstSlice = firstSlice - 10
                                    sliceArray()
                                    checkForNextButton()
                                })
                                NEXT_RESULTS.addEventListener("click", function () {
                                    firstSlice = firstSlice + 10
                                    sliceArray()
                                    checkForNextButton()
                                })
                                sliceArray()
                            })
                            .catch(function (error) {
                                window.location.href="/couldNotFind.html"
                            })
                    }
                })
            })
            .catch(function (error) {
                window.location.href="/couldNotFind.html"
            })
    }
}