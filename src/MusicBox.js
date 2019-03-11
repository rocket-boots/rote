
class MusicBox {
	constructor(playlist) {
		this.audio = null;
		this.playlist = [ ...playlist ];
	}

	addToPlaylist(songPath) {
		this.playlist.push(songPath);
	}

	play(i = 0) {
		this.audio = new Audio(this.playlist[i]);
		this.audio.play();
	}
}

module.exports = MusicBox;
