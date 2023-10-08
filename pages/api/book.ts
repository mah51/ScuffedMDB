import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { OpenLibResponse, OpenLibSchema } from 'models/api/books/openLibrarySchema';
import dbConnect from 'utils/dbConnect';
import { ItemSchema } from 'models/api/books/googleBooksResponse';
import Book, { BookType } from 'models/book';


const fetchOpenlibData = async (identifier: any): Promise<OpenLibSchema | null> => {
    try {
        if (identifier) {
            const isbn = identifier.identifier;
            const url = `${process.env.NEXT_PUBLIC_APP_URI}/api/book/openlibrary?isbn=${isbn}`
            const openlibResponse = await fetch(url);
            if (openlibResponse.status === 200) {
                const openlibData: OpenLibSchema = await openlibResponse.json();
                return openlibData;
            }
        }
    }
    catch (err) {
        return null;
    }
    return null;
}

export const fetchAllBooks = async (): Promise<BookType[]> => {
    const books = Book.find({})
        .populate(`reviews.user`, `username discord_id image discriminator`)
        .sort({ createdAt: -1 });
    return books;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
    await dbConnect();
    if (req.method === "POST") {
        try {
            const googleData: ItemSchema = JSON.parse(req.body)
            const exists = await Book.findOne({ googleId: googleData.id })
            if (exists) {
                return res.status(400).send({ message: "Book already exists" })
            }

            const identifier = googleData?.volumeInfo?.industryIdentifiers?.find(id => ['ISBN_13', 'ISBN_10'].includes(id.type));
            let newBook: BookType = {
                isbn: identifier?.identifier,
                googleId: googleData?.id,
                googleLink: googleData?.volumeInfo?.previewLink,
                authors: googleData?.volumeInfo?.authors,
                title: googleData?.volumeInfo?.title,
                description: googleData?.volumeInfo?.description,
                pageCount: googleData?.volumeInfo?.pageCount,
                publishedDate: googleData?.volumeInfo?.publishedDate,
                imageUrl: googleData?.volumeInfo?.imageLinks?.thumbnail,
                averageRating: googleData?.volumeInfo?.averageRating,
                ratingsCount: googleData?.volumeInfo?.ratingsCount
            }

            const openlibData: OpenLibSchema | null = await fetchOpenlibData(identifier);
            if (openlibData) {
                newBook = {
                    ...newBook,
                    openlibraryKey: openlibData?.key,
                    openlibraryUrl: openlibData?.url,
                    goodreadsId: openlibData?.identifiers?.goodreads?.[0],
                    amazonId: openlibData?.identifiers?.amazon?.[0],
                    subjects: openlibData?.subjects?.map(subject => subject.name),

                }
            }
            const saveBook = new Book(newBook);
            await saveBook.save();

            return res.status(200).send({ data: saveBook, type: 'addition', category: 'book' })
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal servor error" });
        }
    }
    else if (req.method === `GET`) {
        try {
            const books = await fetchAllBooks();
            return res.status(200).send({ data: books });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    else if (req.method === 'DELETE') {
        const { id } = JSON.parse(req.body);
        const book = await Book.findOne({ _id: id });
        if (!book) {
            return res.status(404).json({ message: "Unable to find by id" });
        }
        const deleted = await Book.deleteOne({ _id: id });
        if (deleted.ok === 1) {
            return res.status(200).json(book);
        }
        return res.status(500);
    }
    else {
        return res.status(405).json({ message: "Method not supported" });
    }
};

export default handler;