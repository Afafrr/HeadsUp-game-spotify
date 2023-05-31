import { randomSongs, usedIndexes, songs, roundTime } from './script';

const countdownDiv = document.querySelector('.countdownDiv');
const gameCountdown = document.querySelector('.gameCountdown');
const getBackBtn = document.querySelector('.getBackBtn');
const replayBtn = document.querySelector('.replay');
let counter = -1;
let randomSongsVar;
let gameSec;
let interval;
let stopExecuton;
//begins game by counting down few seconds and gets new set of songs
export async function start() {
	let seconds = 5;
	let interval = setInterval(() => {
		countDown(seconds);
		if (seconds === 0) clearInterval(interval);
		seconds--;
	}, 1000);
	stopExecuton = false;
	randomSongsVar = randomSongs(songs);
	// getBackBtn.classList.remove('hide');
	console.log(randomSongsVar);
}

//displaying start() time and calling game() when finished
function countDown(seconds) {
	document.querySelector('.countdown').textContent = `${seconds}`;
	if (seconds === 0) {
		// setTimeout(() => game(), 3000);
		countdownDiv.classList.add('hide');
		game();
	}
}

//another timer that is used in every song, calls game() after end of time
function gameTimer() {
	gameSec = roundTime || 20;
	interval = setInterval(() => {
		displayGameTime(gameSec);

		if (counter === 5 && gameSec === 0) {
			clearInterval(interval);
			document.querySelector('.gameButtons').classList.remove('hide');
			return;
		}

		if (gameSec === 0) {
			setTimeout(() => game(), 1500);
			clearInterval(interval);
		}
		//when all songs pass
		gameSec--;
	}, 1000);
}

//displaying gameTimer() and changing timer color when <= 10
function displayGameTime(gameSec) {
	gameCountdown.textContent = `${gameSec}`;
	if (gameSec <= 10) {
		gameCountdown.classList.add('colorRed');
	} else {
		gameCountdown.classList.remove('colorRed');
	}
}

//starts new timer and switches info about songs
function game() {
	counter++;

	const songInfo = randomSongsVar[counter];

	let artistArr = [];
	songInfo.artists.forEach(e => {
		artistArr.push(e);
	});

	document.querySelector('.title').textContent = `${songInfo.name}`;
	document.querySelector('.GameArtist').textContent = `${artistArr.join(', ')}`;
	document.querySelector('.songImage').innerHTML = `<img src="${songInfo.img[1].url}"></img>`;
	document.querySelector('audio').innerHTML = `<source src="${songInfo.snippet}" type="audio/mpeg"></source>`;
	console.log(counter, songInfo.name);
	// console.log(songInfo.snippet);
	// gameSec = 1;

	if (stopExecuton) return;

	gameTimer();
}

//replay button
replayBtn.addEventListener('click', function () {
	counter = -1;
	start();
	console.log('replaybtn');
	document.querySelector('.countdownDiv').classList.remove('hide');
	document.querySelector('.gameButtons').classList.add('hide');
});

//returns to previous page, clears all info
getBackBtn.addEventListener('click', function () {
	usedIndexes.length = 0;
	stopExecuton = true;
	counter = -1;

	document.getElementById('game').classList.add('hide');
	document.querySelector('.showPlaylists').classList.add('hide');
	document.querySelector('.bgcBlur').classList.add('hide');
	document.getElementById('profile').classList.remove('hide');
	document.querySelector('.gameButtons').classList.add('hide');
	clearInterval(interval);
});

document.querySelector('.nextSong').addEventListener('click', function () {
	gameSec = 0;
});
