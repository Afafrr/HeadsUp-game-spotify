import {getSongsApi} from './spotiAPI'

const playlistBtn = document.querySelector('.playlistBtn');
const showPlaylist = document.querySelector('.showPlaylists');
const bgcBlur = document.querySelector('.bgcBlur');
let selectedId;

playlistBtn.addEventListener('click', function () {
	showPlaylist.classList.remove('hide');
	bgcBlur.classList.remove('hide');
});

document.querySelector('.closePlaylists').addEventListener('click', function () {
	showPlaylist.classList.add('hide');
	bgcBlur.classList.add('hide');
});

document.querySelector('.bgcBlur').addEventListener('click', function () {
	showPlaylist.classList.add('hide');
	bgcBlur.classList.add('hide');
});

export function getPlaylistID() {
	document.querySelectorAll('.Playlist').forEach(item => {
		item.addEventListener('click', () => {
			selectedId = item.id;
			console.log(selectedId);
			highlightOnOff(item);
		});
	});
}

function highlightOnOff(item) {
	document.querySelectorAll('.Playlist').forEach(e => {
		e.classList.remove('highlight');
		item.classList.add('highlight');
	});
}

document.querySelector('.playBtn').addEventListener('click', function () {
	console.log(selectedId);
	console.log(getSongsApi(selectedId))
});
