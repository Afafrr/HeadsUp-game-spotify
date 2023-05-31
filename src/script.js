import { getSongsApi } from './spotiAPI';
import { start } from './game';

const playlistBtn = document.querySelector('.playlistBtn');
const showPlaylist = document.querySelector('.showPlaylists');
const bgcBlur = document.querySelector('.bgcBlur');
const playBtn = document.querySelector('.playBtn');
const settings = document.querySelector('.settings');
let selectedId;
let toGameIndexes = [];
export let songs;
export let usedIndexes = [];
export let firstSet;
export let roundTime;

//button which shows user playlists
playlistBtn.addEventListener('click', function () {
	showPlaylist.classList.remove('hide');
	bgcBlur.classList.remove('hide');
});

//user playlists hide after clicking close button or background
document.querySelector('.closePlaylists').addEventListener('click', function () {
	showPlaylist.classList.add('hide');
	bgcBlur.classList.add('hide');
});

bgcBlur.addEventListener('click', function () {
	showPlaylist.classList.add('hide');
	bgcBlur.classList.add('hide');

	if (!settings.classList.contains('hide')) {
		let selectedTime = document.getElementById('timeOfRound').value;

		if (Number.isInteger(Number(selectedTime)) && selectedTime > 0 && selectedTime <= 90) {
			roundTime = selectedTime;
			settings.classList.add('hide');
		} else {
			alert('Number is out of range!');
			settings.classList.add('hide');
		}
	}
});

document.querySelector('.settingsGear').addEventListener('click', function () {
	settings.classList.remove('hide');
	bgcBlur.classList.remove('hide');
});

//after clicking play button func gets one selected playlists Id
export function getPlaylistID() {
	document.querySelectorAll('.Playlist').forEach(item => {
		item.addEventListener('click', () => {
			selectedId = item.id;
			highlightOnOff(item);
		});
	});
}

// highlights selected element
function highlightOnOff(item) {
	document.querySelectorAll('.Playlist').forEach(e => {
		e.classList.remove('highlight');
		item.classList.add('highlight');
		playBtn.classList.remove('disableBtnClick');
	});
}
//getting songs from selected playlist
playBtn.addEventListener('click', async function () {
	songs = await getSongsApi(selectedId);

	if (songs.items.length < 6) {
		alert('Playlist has to be longer than 5 tracks!');
	} else {
		start();
		document.querySelector('.countdownDiv').classList.remove('hide');
		document.getElementById('profile').classList.add('hide');
		document.getElementById('game').classList.remove('hide');
	}
});

//returns 5 songs with name, artist and image
export function randomSongs(songs) {
	let max = songs.items.length - 1;
	const min = 0;
	toGameIndexes = [];

	//generatring non-repetable random number from given playlist
	while (toGameIndexes.length < 6) {
		let ranNum = Math.floor(Math.random() * (max - min) + min);
		if (!usedIndexes.includes(ranNum)) {
			usedIndexes.push(ranNum);
			toGameIndexes.push(ranNum);
		}
		if (usedIndexes >= max - 6) {
			break;
		}
	}

	//getting info about songs from prev indexes
	let songInfo = [];
	toGameIndexes.forEach(e => {
		let track = songs.items[e].track;
		let name = track.name;
		let img = track.album.images;
		let artists = [];
		let snippet = track.preview_url;

		track.artists.forEach(artist => artists.push(artist.name));
		songInfo.push({ name, artists, img, snippet });
	});
	console.log(toGameIndexes);
	console.log(usedIndexes);

	return songInfo;
}
