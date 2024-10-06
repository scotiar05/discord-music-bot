class Queue {
    constructor() {
        this.songs = [];
        this.currentSong = null;
    }

    add(song) {
        this.songs.push(song);
    }

    next() {
        if (this.songs.length > 0) {
            this.currentSong = this.songs.shift();
            return this.currentSong;
        }
        return null;
    }

    clear() {
        this.songs = [];
        this.currentSong = null;
    }

    isEmpty() {
        return this.songs.length === 0 && this.currentSong === null;
    }

    getQueue() {
        return this.songs;
    }

    getCurrentSong() {
        return this.currentSong;
    }
}

module.exports = Queue;
