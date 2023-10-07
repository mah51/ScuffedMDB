interface ImageLinks {
    smallThumbnail?: String;
    thumbnail?: String;
}

export interface BookIdentifier {
    type: String;
    identifier: String;
}

interface VolumeInfo {
    title: String;
    subtitle: String;
    authors: String[];
    publisher: String;
    publishedDate: String;
    description: String;
    industryIdentifiers:  BookIdentifier[];
    pageCount: Number;
    categories: String[];
    averageRating: Number;
    ratingsCount: Number;
    imageLinks?: ImageLinks;
    language: String;
    previewLink: String;
    infoLink: String;
    canonicalVolumeLink: String
}

interface SearchInfo {
    textSnippet?: String
}

export interface ItemSchema {
    kind: String;
    id: String;
    selfLink: String;
    searchInfo?: SearchInfo;
    volumeInfo: VolumeInfo;

}

export interface SearchResponse {
    kind: String;
    totalItems: Number;
    items: ItemSchema[];
}