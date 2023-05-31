import * as script from './script.js';

const clientId = '148c38e6a9b343db9520e03d3daa2b89';
const params = new URLSearchParams(window.location.search);
 const code = params.get('code');
 let accessToken;

if (!code || window.location.pathname === '/game') {
	redirectToAuthCodeFlow(clientId);
} else {
	accessToken = await getAccessToken(clientId, code);
	const profile = await fetchProfile(accessToken);
	const playlists = await getPlaylist(accessToken);
	const topItems = await getUsersTopItems(accessToken);
	populateUI(profile);
	displayPlaylists(playlists);
	lastTracks(topItems);
}

export async function redirectToAuthCodeFlow(clientId) {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);

	localStorage.setItem('verifier', verifier);

	const params = new URLSearchParams();
	params.append('client_id', clientId);
	params.append('response_type', 'code');
	params.append('redirect_uri', 'http://localhost:5173/callback');
	params.append('scope', 'user-read-private user-top-read playlist-read-private');
	params.append('code_challenge_method', 'S256');
	params.append('code_challenge', challenge);

	document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
async function generateCodeChallenge(codeVerifier) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
	const verifier = localStorage.getItem('verifier');
	const params = new URLSearchParams();
	params.append('client_id', clientId);
	params.append('grant_type', 'authorization_code');
	params.append('code', code);
	params.append('redirect_uri', 'http://localhost:5173/callback');
	params.append('code_verifier', verifier);

	const result = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params,
	});

	const { access_token } = await result.json();
	return access_token;
}

//getting all user playlists
async function getPlaylist(token) {
	const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` },
	});

	return await result.json();
}

//displayling user playlists
function displayPlaylists(playlists) {
	playlists.items.forEach(element => {
		const x = `<div id="${element.id}" class="bar Playlist" > <img src='${element.images[0].url}' height='40px'></img> <div class ='playlistName'>${element.name}</div></div> `;

		document.querySelector('.userPlaylists').insertAdjacentHTML('afterbegin', x);
	});

	script.getPlaylistID();
}

//getting top 5 listened songs in 30days
async function getUsersTopItems(token) {
	let url = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5';
	const result = await fetch(`${url}`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` },
	});

	return await result.json();
}

//displaying prev function
function lastTracks(topItems) {
	if (topItems.items.length === 0) {
		document.querySelector('h2').innerText = "You haven't listened to music for a month :c";
	} else {
		topItems.items.forEach(element => {
			let allArtists = '';
			element.artists.forEach(artist => {
				allArtists += artist.name + ' ';
			});
			const x = `<div class="bar"> 
			<div class="songArtistNames">
			<p class="songName"> ${element.name}</p>
			<p class="artist"> ${allArtists} </p> </div>
			<img src='${element.album.images[2].url}' ></img>
			</div>`;
			document.querySelector('.lastTracks').insertAdjacentHTML('beforeend', x);
		});
	}
}

//getting info about user profile
async function fetchProfile(token) {
	const result = await fetch('https://api.spotify.com/v1/me', {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` },
	});

	return await result.json();
}

//displaying user info
function populateUI(profile) {
	document.getElementById('displayName').innerText = profile.display_name;
	if (profile.images[0]) {
		const profileImage = new Image();
		profileImage.src = profile.images[0].url;
		document.getElementById('avatar').appendChild(profileImage);
		// document.getElementById('imgUrl').innerText = profile.images[0].url;
	}
	// document.getElementById('country').innerText = profile.country;
	// document.getElementById('email').innerText = profile.email;
	// document.getElementById('uri').innerText = profile.uri;
	// document.getElementById('uri').setAttribute('href', profile.external_urls.spotify);
	// document.getElementById('url').innerText = profile.href;
	// document.getElementById('url').setAttribute('href', profile.href);
}


//getting selected playlist items (trakcs)
export async function getSongsApi(playlist_id) {
	const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	return await result.json();
}

