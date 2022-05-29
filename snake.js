console.log('SNAKE LOADED')
document.querySelector('.startGame').addEventListener('click', startGame)
function startGame(){
	document.querySelector('.popup').classList.add('invisible')
	let snake = new Snake()

	let directions = ['up','left','down','right']
		directions.forEach((dir) => {
			document.querySelector('button.'+dir).addEventListener('click', () => {
				snake.setDirection(dir)
			})
		})
		// Keyboard input
		window.addEventListener("keydown", function (event) {
			// if (event.defaultPrevented) {
			// 	console.log('default prevented?')
			// 	return; // Do nothing if the event was already processed
			// }

			switch (event.key) {
				case "ArrowDown":
					snake.setDirection('down')
					break;
				case "ArrowUp":
					snake.setDirection('up')
					break;
				case "ArrowLeft":
					snake.setDirection('left')
					break;
				case "ArrowRight":
					snake.setDirection('right')
					break;
				default:
					return; // Quit when this doesn't handle the key event.
			}

			// Cancel the default action to avoid it being handled twice
			 event.preventDefault();
		}, true);

	document.querySelectorAll('.cell')[Math.floor(Math.random()*96)+3].classList.add('apple')
}

class Snake {
	constructor() {
		this.segments = [
			new Segment(2, 'head', 'right'),
			new Segment(1, 'body', 'right'),
			new Segment(0, 'tail', 'right'),
		]

		this.score = 0
		this.numOfSeg = this.segments.length

		this.direction = 'right'
		
		
		// Default movement delay
		this.delay = 300

		// Move snake
		this.playing = true
		this.gameLoop = setInterval(() => {
			this.moveSnake()
		}, this.delay)

		// Draw snake
		this.drawSnake()
	}

	moveSnake() {
		// Get new head location based on direction
		let head = this.segments[0].cell
		switch(this.direction) {
			case 'left':
				if (head % 10 > 0)
					head--
				else
					this.gameOver()
				break;
			case 'right':
				if (head % 10 < 9)
					head++
				else
					this.gameOver()
				break;
			case 'up':
				if (head >= 10)
					head -= 10
				else
					this.gameOver()
				break;
			case 'down':
				if (head <= 89)
					head += 10
				else
					this.gameOver()
				break;
		}

		// Check if head is in other snake segment
		for (let i = 1; i < this.segments.length-1; i++) {
			if (head == this.segments[i].cell) {
				this.gameOver()
				break
			}
		}

		// Check for apple & eat apple
		let ateApple = false;
		if (document.querySelectorAll('.cell')[head].classList.contains('apple')){
			document.querySelectorAll('.cell')[head].classList.remove('apple')
			ateApple = true;
			//remove old tail
			this.segments[this.segments.length-1].type = 'body'
			// add new tail
			this.segments.push(new Segment(this.segments[this.segments.length-1].cell + 1, 'tail', this.direction))
			//update score values
			this.score += 10
			this.numOfSeg = this.segments.length
			this.delay *= 0.95
			console.log(this.delay)
			this.updateSpeed()
			this.eatApple()
		}

		if (this.playing) {
			// Pop tail off
			this.segments.pop()
			
			// Make new last segment a tail
			this.segments[this.segments.length-1].type = 'tail'

			// Make former head into a body and adjust direction
			this.segments[0].type = 'body'
			this.segments[0].direction = this.direction

			// Make new head in the direction of movement
			this.segments.unshift(new Segment(head, 'head', this.direction))
		}

		// Draw snake
		this.drawSnake()

		if (ateApple){
			this.drawApple()
		}
		
		this.updateScore()
	}

	setDirection(dir) {
		switch(dir) {
			case 'left':
			case 'right':
				if (this.segments[0].direction == 'up' || this.segments[0].direction == 'down') {
					this.direction = dir
				}
				break;
			case 'up':
			case 'down':
				if (this.segments[0].direction == 'left' || this.segments[0].direction == 'right') {
					this.direction = dir
				}
				break;
		}
	}

	drawSnake() {
		// Remove all classes from all cells
		document.querySelectorAll('.cell').forEach((el) => {
			if(!el.classList.contains('apple')){
				el.className = 'cell'
			}
		})

		// Add snake classes
		for (let i = 0; i < this.segments.length; i++) {
			let segment = document.querySelectorAll('.cell')[this.segments[i].cell]
			segment.classList.add(this.segments[i].type, this.segments[i].direction)
			if (this.segments[i].type == 'body') {
				let bendClass = 'bend-'
				switch(this.segments[i-1].cell - this.segments[i].cell) {
					case -1:
						bendClass += 'left'
						break;
					case 1:
						bendClass += 'right'
						break;
					case -10:
						bendClass += 'up'
						break;
					case 10:
						bendClass += 'down'
						break;
				}

				switch(this.segments[i+1].cell - this.segments[i].cell) {
					case -1:
						bendClass += 'left'
						break;
					case 1:
						bendClass += 'right'
						break;
					case -10:
						bendClass += 'up'
						break;
					case 10:
						bendClass += 'down'
						break;
				}

				segment.classList.add(bendClass)
			}
		}
	}
	eatApple() {
		console.log('mm tasty apple')
		
	}
	updateSpeed(){
		clearInterval(this.gameLoop)
		this.gameLoop = setInterval(() => {
			this.moveSnake()
		}, this.delay)
	}

	updateScore(){
		document.querySelector('.scoreValue').innerText = this.score
		document.querySelector('.lengthValue').innerText = this.numOfSeg

	}

	drawApple() {
		let cells = document.querySelectorAll('.cell')
		let validApple = false
		let appleIndex = Math.floor(Math.random()*cells.length)
		while (!validApple){
			if(!cells[appleIndex].classList.contains('head') && !cells[appleIndex].classList.contains('body') && !cells[appleIndex].classList.contains('tail')){
				console.log('apple index is'+ appleIndex)
				validApple = true
			}else{
				appleIndex = Math.floor(Math.random()*cells.length)
				console.log('apple index is '+ appleIndex+ ' but there is a snake in my boot')
			}
		}
		cells[appleIndex].classList.add('apple')

		// do {
		// 	appleIndex = Math.floor(Math.random()*cells.length)
		// } while (cells.classList.contains('head'));
		// cells[appleIndex].classList.add('apple')
		// console.log('apple incoming')
	}

	gameOver() {
		document.querySelector('.gameOver').innerText = 'Game Over!'
		document.querySelector('.startGame').innerText = 'Play Again'
		document.querySelector('.popup').classList.remove('invisible')
		document.querySelectorAll('.cell').forEach((el) => {
			el.className = 'cell'
		})
		clearInterval(this.gameLoop)
		this.playing = false
	}
}

class Segment {
	constructor(cell, type, direction) {
		this.cell = cell
		this.type = type
		this.direction = direction
	}
}