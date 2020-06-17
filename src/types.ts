export interface Artist extends MongoObjectId {
  nazwa: string;
  bio: string;
  imageUrl: string;
  albums: Album[];
}
export interface Album extends MongoObjectId {
  label: string;
  year: string;
  imageUrl: string;
  songs: Song[];
}
export interface Song extends MongoObjectId {
  nazwa: string;
  /**
   * ["5.0", "4.0"]
   */
  ratings: string[];
  Comments: Comment[];
}

export interface Comment extends MongoObjectId {
  /**
   * username
   */
  name: string;
  comment: string;
}
interface MongoObjectId {
  _id: {
    $oid: string;
  }
}