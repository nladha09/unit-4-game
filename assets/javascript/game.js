var characters, gameState

/* RESET FUNCTIONS */

// startGame acts as primary reset function.
// it is called at the bottom of the file to start the game.
function startGame() {
	// resets the game to original state;
	characters = resetCharacters()
	gameState = resetGameState()

	// renders characters
	renderCharacters()
}

function resetCharacters() {
	// resets the character stats to originals.
	return {
		'obiWanKenobi': {
			name: 'Obi-Wan Kenobi',
			health: 120,
			attack: 8,
			imageUrl: 'assets/images/obi-wan.jpg',
			enemyAttackBack: 15
		},
		'lukeSkywalker': {
			name: 'Luke Skywalker',
			health: 100,
			attack: 14,
			imageUrl: 'assets/images/luke-skywalker.jpg',
			enemyAttackBack: 5
		},
		'darthSidious': {
			name: 'Darth Sidious',
			health: 150,
			attack: 8,
			imageUrl: 'assets/images/darth-sidious.png',
			enemyAttackBack: 20
		},
		'darthMaul': {
			name: 'Darth Maul',
			health: 180,
			attack: 7,
			imageUrl: 'assets/images/darth-maul.jpg',
			enemyAttackBack: 25
		}
	}
}

function resetGameState() {
	// resets game state to originals.
	return {
		selectedCharacter: null,
		selectedDefender: null,
		enemiesLeft: 0,
		numAttacks: 0
	}
}

/* RENDERING FUNCTIONS */

// helpful for creating divs dynamically.
function createCharDiv(character, key) {
	// NOTE: data-name is necessary in charDiv so we can back reference in generic clickHandlers.
	var charDiv = $("<div class='character' data-name='" + key + "'>")
	var charName = $("<div class='character-name'>").text(character.name)
	var charImage = $("<img alt='image' class='character-image'>").attr('src', character.imageUrl)
	var charHealth = $("<div class='character-health'>").text(character.health)
	charDiv.append(charName).append(charImage).append(charHealth)
	return charDiv
}

// renders all characters in character-area to start
function renderCharacters() {
	console.log('rendering characters')
	// iterate through characters object,
	// render each character to the charactersSelect div
	var keys = Object.keys(characters)
	for (var i = 0; i < keys.length; i++) {
		// get the current character out of the object
		var characterKey = keys[i]
		var character = characters[characterKey]
		// append elements to the #character-area element
		var charDiv = createCharDiv(character, characterKey)
		$('#character-area').append(charDiv)
	}
}

// renders just the opponents (not the character that was just selected)
function renderOpponents(selectedCharacterKey) {
	// iterate through oponents object, and render
	// oponent divs for every key that is NOT the selectedCharacter
	var characterKeys = Object.keys(characters)
	for (var i = 0; i < characterKeys.length; i++) {
		if (characterKeys[i] !== selectedCharacterKey) {
			var enemyKey = characterKeys[i]
			var enemy = characters[enemyKey]

			var enemyDiv = createCharDiv(enemy, enemyKey)
			$(enemyDiv).addClass('enemy')
			$('#available-to-attack-section').append(enemyDiv)
		}
	}
}

/* BUSINESS LOGIC */

/*
  HOMEWORK INSTRUCTIONS: The player chooses an opponent by clicking on an enemy's picture.
*/
function enableEnemySelection() {
	$('.enemy').on('click.enemySelect', function () {
		console.log('opponent selected')
		var opponentKey = $(this).attr('data-name')
		gameState.selectedDefender = characters[opponentKey]

		// move enemy
		$('#defender').append(this)
		/*
		* HOMEWORK INSTRUCTIONS: Once the player selects an opponent,
		  that enemy is moved to a `defender area`.
		   The player will now be able to click the `attack` button
		*/
		$('#attack-button').show()
		$('.enemy').off('click.enemySelect')
	})
}

function attack(numAttacks) {
	console.log('attacking defender')
	// The opponent will lose `HP` (health points).
	gameState.selectedDefender.health -= gameState.selectedCharacter.attack * numAttacks
}

//  HOMEWORK INSTRUCTIONS: The opponent character will instantly counter the attack.
function defend() {
	console.log('defender countering')
	// HOMEWORK INSTRUCTIONS: the selectedCharacter will lose HP
	gameState.selectedCharacter.health -= gameState.selectedDefender.enemyAttackBack
}

// Design Note: I like naming functions that return a boolean after the question
// that they answer... like "isCharacterDead" instead of "CharacterDead". That way
// it feels more like the boolean returned is answering a question for me!
// ^make sure if you do this, that your boolean returns true / false in the correct situations

// returns boolean if the passed character is dead
function isCharacterDead(character) {
	console.log('checking if player is dead')
	return character.health <= 0
}

// checks if you won
function isGameWon() {
	console.log('checking if you won the game')
	return gameState.enemiesLeft === 0
}

// this function returns a boolean, indicating that the attack phase has been completed
function isAttackPhaseComplete() {
	// logic to check if defender or players are dead.
	if (isCharacterDead(gameState.selectedCharacter)) {
		// you lose!
		alert('You were defeated by ' + gameState.selectedDefender.name + '. Click reset to play again.')
		// display lose message to user, and present reset button.
		$('#selected-character').empty()
		$('#reset-button').show()

		return true // returning true because attack phase has completed.
	} else if (isCharacterDead(gameState.selectedDefender)) {
		console.log('defender dead')

		// decrement enemiesLeft counter and empty defender div
		gameState.enemiesLeft--
		$('#defender').empty()

		// checks if you win the game, or if there are more characters to fight
		if (isGameWon()) {
			// show reset button and alert
			alert('You win! Click Reset to play again')
			$('#reset-button').show()
		} else {
			// Prompt user to select another enemy
			alert('You defeated ' + gameState.selectedDefender.name + '! Select another enemy to fight.')
			enableEnemySelection()
		}
		return true // returning true because attack phase has completed.
	}
	// returning false, because attack phase is not complete.
	return false
}

// used when clicking on reset button to reset the game.
function emptyDivs() {
	// empty out all content areas
	$('#selected-character').empty()
	$('#defender').empty()
	$('#available-to-attack-section .enemy').empty()
	$('#character-area').empty()
	$('#characters-section').show()
}

// Attach handlers and start game once document has fully loaded.
// NOTE: function declarations (above) do not need to be wrapped in the document.ready function,
// but click handlers (below) do, since they rely on DOM elements being present to attach properly.
$(document).ready(function () {
	/* CLICK HANDLERS */

	/*
	* HOMEWORK INSTRUCTIONS: When the game starts, the player will choose a character
	 by clicking on the fighter's picture.
	 The player will fight as that character for the rest of the game.
	*/

	// NOTE: the second argument to the "on" method below means this is a "delegated event" listener
	// that will still trigger for dynamically added elements with the class ".character" .
	// The selector in the $ needs to be present when the event is attached in order for event
	// delegation to work.
	// This code reads: attach the function to all current and future elements with a class of character
	// inside of the element with ID character-area, triggered on click.
	$('#character-area').on('click', '.character', function () {
		// store selected character in javascript

		var selectedKey = $(this).attr('data-name')
		gameState.selectedCharacter = characters[selectedKey]
		console.log('player selected')

		// move to selected section
		$('#selected-character').append(this)

		/*
		  HOMEWORK INSTRUCTIONS: Enemies should be moved to a different area of the screen.
		*/
		renderOpponents(selectedKey)

		// then hide the characters-section from view
		$('#characters-section').hide()

		// set the number of enemies, and enable enemy selection;
		gameState.enemiesLeft = Object.keys(characters).length - 1
		enableEnemySelection()
	})

	$('#attack-button').on('click.attack', function () {
		console.log('attack clicked')
		// increment attackCounter (for power scaling of player attacks)
		gameState.numAttacks++

		// attack and defend stages
		attack(gameState.numAttacks)
		defend()

		// display updated values for character health
		$('#selected-character .character-health').text(gameState.selectedCharacter.health)
		$('#defender .character-health').text(gameState.selectedDefender.health)

		// hide the attack button if attack phase is over
		if (isAttackPhaseComplete()) {
			$(this).hide()
		}
	})

	$('#reset-button').on('click.reset', function () {
		console.log('resetting game')

		// empty all divs before resetting the game
		emptyDivs()

		// hide reset button
		$(this).hide()

		// start the game again
		startGame()
	})

	// KICKS OFF THE GAME
	startGame()
})