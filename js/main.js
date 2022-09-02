let deckId
let playerPoints = 0
let housePoints = 0
let playerHand = []
let houseHand = []

window.onload = function() {
    getDeck();
}
// seperate into mvc, the mode stores hands and totals in the db
//Use that to compare trends in cards drawn with expectations.
//See how random each game really is.  
document.querySelector(".draw-card").addEventListener('click', drawHand)
document.querySelector(".hit").addEventListener('click', hitPlayer)
document.querySelector(".stay").addEventListener('click', startHouseTurn)
document.querySelector('.shuffle').addEventListener('click', reshuffleDeck)

function getDeck(){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            deckId = data.deck_id
        })
        .catch(err => {
            console.log(`error${err}`)
        });
        
}

function drawHand(){
    clearAll()
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`)
        .then(res => res.json())
        .then(data => {
            clearHands()
            addInitToHands(data)
            showInitDraw()
            showPlayerPoints()
        })
        .catch(err => {
            console.log(`error${err}`)
        });
        document.querySelector('.stay').style.display = 'inline'
            document.querySelector('.hit').style.display = 'inline'
}

function showInitDraw(){
    for (let i=0; i<playerHand.length;i++){
        let newCard = document.createElement('img')
        newCard.src = playerHand[i].image
        let element = document.querySelector('.pcards')
        element.appendChild(newCard)
    }
    for (let i = 0; i < houseHand.length; i++) {
        let newCard = document.createElement('img')
        newCard.src = houseHand[i].image
        let element = document.querySelector('.hcards')
        element.appendChild(newCard)
    }
    document.querySelector('.housePointCount').innerHTML = houseHand[1].value
}

function showPlayerPoints(){
    playerPoints=0
    for (let i=0; i<playerHand.length; i++){
        if (playerHand[i].value === "KING" || playerHand[i].value === "QUEEN" || playerHand[i].value==="JACK"){
            playerPoints+=10
        } else if (playerHand[i].value==='ACE'){
            playerPoints+=11
        } else {
            playerPoints+=Number(playerHand[i].value)
        }
    }
        if (playerPoints > 21){
            let aces= playerHand.filter((card)=> card.value === 'ACE').length
            playerPoints-=10*aces
        }
    document.querySelector('.playerPointCount').innerText = playerPoints
}

function hitPlayer(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            console.log('hitPlayer')
            playerHand.push(data.cards[0])
            showPlayerPoints()
            let newCard = document.createElement('img')
            newCard.src = data.cards[0].image
            let element = document.querySelector('.pcards')
            element.appendChild(newCard)
            if (playerPoints>21){
                countHousePoints()
                announceWinner()
            }
        })
        .catch(err => {
            console.log(`error${err}`)
        });   
}

function hitHouse(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            console.log('hitHouse')
            houseHand.push(data.cards[0])
            countHousePoints()
            let newCard = document.createElement('img')
            newCard.src = data.cards[0].image
            let element = document.querySelector('.hcards')
            element.appendChild(newCard)
            document.querySelector('.housePointCount').innerText = housePoints
            if (housePoints<17 && housePoints<=playerPoints){
                hitHouse()
            } else{ 
                countHousePoints()
                announceWinner()
            }
        })
        .catch(err => {
            console.log(`error${err}`)
        });   
    
}

function startHouseTurn(){
    countHousePoints()
    document.querySelector('.hcards').children[0].src = houseHand[0].reveal
    document.querySelector('.housePointCount').innerHTML = housePoints
    if(housePoints<17){
        hitHouse()
    }
    countHousePoints()
    announceWinner()
}


function countHousePoints(){
    housePoints = 0
    for (let i = 0; i < houseHand.length; i++) {
        if (houseHand[i].value === "KING" || houseHand[i].value === "QUEEN" || houseHand[i].value === "JACK") {
            housePoints += 10
        } else if (houseHand[i].value === 'ACE') {
            housePoints += 11
        } else {
            housePoints += Number(houseHand[i].value)
        }
    }
    if (housePoints > 21) {
        let aces = houseHand.filter((card) => card.value === 'ACE' || card.value === 11).length
        housePoints -= 10 * aces
    }
}

function clearHands(){
    playerHand = []
    houseHand = []
}

function clearScore(){
    document.querySelector('.pcards').innerHTML = '';
    document.querySelector('.hcards').innerHTML = '';
    document.querySelector('.playerPointCount').innerHTML = ''
    document.querySelector('.housePointCount').innerHTML = ''
}

function clearAll(){
    clearHands()
    clearScore()
    document.querySelector('h1').innerText = ''
    document.querySelector('.stay').style.display = 'none'
    document.querySelector('.hit').style.display = 'none'
}

function reshuffleDeck(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .catch(err => {
            console.log(`error${err}`)
        })
        clearAll()
        document.querySelector('.shuffle').style.display = 'none'
}

function addInitToHands(data){
    playerHand.push(data.cards[2])
    playerHand.push(data.cards[3])
    houseHand.push(data.cards[0])
    houseHand.push(data.cards[1])
    if (houseHand[1].value === 'ACE'){
        houseHand[1].value = 11
    } else if (houseHand[1].value == 'KING' || houseHand[1].value == 'QUEEN' || houseHand[1].value =='JACK'){
        houseHand[1].value = 10
    }
    houseHand[0].reveal = houseHand[0].image
    houseHand[0].image = "\img/yugiCardBack.jpg"
}


function announceWinner(){
    document.querySelector('.housePointCount').innerHTML = housePoints

    if (playerPoints > 21 || (playerPoints < housePoints && housePoints<=21) || (housePoints === 21 && playerPoints != 21)) {

        document.querySelector('.hcards').children[0].src = houseHand[0].reveal
        document.querySelector('h1').innerText = "House Wins. Better luck next time."
    } 
    if (housePoints > 21 || (playerPoints === 21 && housePoints !== 21) || housePoints >= 17 && playerPoints > housePoints && playerPoints < 22) {

        document.querySelector('h1').innerText = "You Win. Rematch?"
    }
    if (playerPoints === housePoints && housePoints > 17) {
        
        document.querySelector('h1').innerText ='Its a tie!'
    }
    document.querySelector('.stay').style.display = 'none'
    document.querySelector('.hit').style.display = 'none'
    document.querySelector('.shuffle').style.display = 'inline'
}

