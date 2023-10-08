interface ImageLinks {
    smallThumbnail?: string;
    thumbnail?: string;
}

export interface BookIdentifier {
    type: string;
    identifier: string;
}

interface VolumeInfo {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers:  BookIdentifier[];
    pageCount: number;
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    imageLinks?: ImageLinks;
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string
}

interface SearchInfo {
    textSnippet?: string
}

export interface ItemSchema {
    kind: string;
    id: string;
    selfLink: string;
    searchInfo?: SearchInfo;
    volumeInfo: VolumeInfo;

}

export interface SearchResponse {
    kind: string;
    totalItems: number;
    items: ItemSchema[];
}