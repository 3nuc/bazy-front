import axios from 'axios';

const baseURL = 'http://localhost:8080/mongo_dzialajacy2/webresources/api/'
const api = axios.create({ baseURL })

export const artist = {
  create(body: { nazwa: string, bio: string, imageUrl: string }) {
    return api.post('addArtistWithBody', body);
  },
  getOne(artistId?: string) {
    return api.get(`artists/${artistId}`)
  },
  getAll() {
    return api.get(`all`)
  },
  update(artistId: string, body: {nazwa: string, imageUrl: string, bio: string}) {
    return api.put(`editArtist/${artistId}`)
  },
  remove(artistId: string) {
    return api.delete(`removeArtist/${artistId}`)
  }
}
export const album = {
  create(body: {artistId: string, name: string, year: number, labelUrl: string}) {
    return api.post('addAlbumWithBody', body);
  },
  get(artistId: string) {
    return api.get(`getAlbums/${artistId}`)
  },
  remove(albumId: string) {
    return api.delete(`removeAlbum/${albumId}`)
  }
}

export const song = {
  create(artistId: string, albumId: string, name: string) {
    return api.post(`addSong/${artistId}/${albumId}/${name}`)
  }
}
export const rating = {
  create(albumId: string, songId: string, rating: number) {
    return api.post(`addRating2/${albumId}/${songId}/${rating}`);
  }
  
}

export const comment = {
  create(albumId: string, songId: string, username: string, text: string) {
    return api.post(`addComment2/${albumId}/${songId}/${username}/${text}`)
  }
}

export default {
  artist,album,rating,comment,song
}