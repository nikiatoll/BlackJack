# BlackJack
A web app to simulate a game of blackjack

This project allows you to play blackjack against the computer. Simulates using a real deck by drawing cards and allowing you to shuffle.
Link to project: https://blackjaaack.netlify.app/

How It's Made:

Tech used: HTML, CSS, JavaScript

As one of my first projects, the hardest part was picking a single aspect to start on. I decided to begin with the logic that counts up a hands total, and from there worked on how the game would keep track of individual hands. Much of the refactoring time was spent coming back to this part and refining it to work with drawing cards and counting totals. Next was seperating the players turn from the computers turn, more specifically outlining how the computer turn is taken once the player decides to stay. Another struggle I encontered was showing the player only one of the computers cards and the score of the revealed card while also showing the correct total once the game was over, this was ameliorated once I properly refactored the way the computer keeps track of hands.

Optimizations

(optional)
I incorporated code that prevents the computer from drawing cards when the player busts (gets a score higher than 21) or when the computer reaches 17 points to reduce the number of requests made to the server and increase efficiency. It also recongizes when a player busts and automatically end the game to reduce confusion and enhance player experience, as well as storing the deck to reuse between games to also reduce the number of new decks requested and by extension load on the server.

I plan to return to this project to practice OOP, specifically encapsulating the functions and variables into objects to make adding aditional players much easier, as well as improving redability and ease of iteration. I will also add CSS styling to improve the curb appeal.

Lessons Learned:

I was so focused on the more complex aspects of this project like outlining all of the win states and the game flow that it took me several hours to think of using an array to keep track of drawn cards, a solution that should have been obvious from the start. Once I did however, many other problems I was having vanished and the rest of the project slid into place. 

I learned first hand the importance of abstracting smaller processes that happened more than once into other functions I could reuse within larger actions (i.e hitting the player included drawing a card, updating the DOM with the score, and checking if the player went over 21 points. Each became their own function and the code became much easier to adjust and read.)
