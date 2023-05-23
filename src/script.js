import { getSongsApi } from './spotiAPI';

const playlistBtn = document.querySelector('.playlistBtn');
const showPlaylist = document.querySelector('.showPlaylists');
const bgcBlur = document.querySelector('.bgcBlur');
const playBtn = document.querySelector('.playBtn');
let selectedId;
let songs;
let usedIndexes = [];
let toGameIndexes = [];

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

document.querySelector('.bgcBlur').addEventListener('click', function () {
	showPlaylist.classList.add('hide');
	bgcBlur.classList.add('hide');
});

//after clicking play button func gets one selected playlists Id
export function getPlaylistID() {
	document.querySelectorAll('.Playlist').forEach(item => {
		item.addEventListener('click', () => {
			selectedId = item.id;
			highlightOnOff(item);
			// console.log(navigator.userAgent);
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
	randomSongs(songs);
});

//returns 5 songs with name, artist and image
export function randomSongs(songs) {
	let max = songs.items.length - 1;
	const min = 0;
	toGameIndexes = [];

	//generatring non-repetable random number from given playlist 
	while (toGameIndexes.length <= 5) {
		let ranNum = Math.floor(Math.random() * (max - min) + min);
		if (!usedIndexes.includes(ranNum)) {
			usedIndexes.push(ranNum);
			toGameIndexes.push(ranNum);
		}
		if (usedIndexes >= max - 7) {
			break;
		}
	}
	//getting info from prev indexes
	let songInfo = [];
	toGameIndexes.forEach(e => {
		let track = songs.items[e].track;
		let name = track.name;
		let img = track.album.images;
		let artists = [];
		let snippet = track.preview_url

		track.artists.forEach(artist => artists.push(artist.name));
		songInfo.push({name, artists, img, snippet});
	});
	return songInfo
}
