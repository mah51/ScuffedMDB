export interface OpenLibResponse {
    [k: string] : OpenLibSchema
}

export interface OpenLibSchema {
    url?: string,
    key?: string,
    title: string,
    authors: Author[],
    identifiers: Identifier,
    publishers: Publisher[],
    publish_date: string,
    subjects?: Subject[],
    subject_places?: Subject[],
    subject_people?: Subject[],
    excerpts?: Excerpt[],
    links?: Link[]

}


interface Author {
    url: string,
    name: string
}

interface Identifier {
    isbn_10?: string[],
    isbn_13?: string[],
    oclc?: string[],
    openlibrary?: string[],
    amazon?: string[],
    google?: string[],
    project_gutenberg?: string[],
    goodreads?: string[],
    librarything?: string[]
}

interface Publisher {
    name: string
}

interface Subject {
    name: string,
    url: string
}

interface Excerpt {
    text: string,
    comment: string
}

interface Link {
    title: string,
    url: string
}

interface Cover {
    small: string,
    medium: string,
    large: string
}