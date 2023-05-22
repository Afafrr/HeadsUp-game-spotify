const playlistBtn = document.querySelector('.playlistBtn');
const showPlaylist = document.querySelector('.showPlaylists');
const bgcBlur = document.querySelector('.bgcBlur');

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
			let selectedId = item.id;
			console.log(selectedId);
			unhighlight();
			item.classList.add('highlight')
		});
	});
}

function unhighlight() {
	document.querySelectorAll('.Playlist').forEach(item => {
	item.classList.remove('highlight')
	});
}
