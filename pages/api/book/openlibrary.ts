import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { OpenLibResponse } from 'models/api/books/openLibrarySchema';


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
    if (req.method === "GET") {
        try {
            const query = req.query;
            let isbnKey = ''
            if (query?.isbn) {
                isbnKey = `ISBN:${query?.isbn}`;
            }
            else {
                return res.status(400).send({ "message": "missing required fields [isbn]" })
            }

            const url = encodeURI(`${process.env.OPEN_LIBRARY_API_URL}/books?bibkeys=${isbnKey}&jscmd=data&format=json`);
            console.debug('openlib url:', url);
            const options = {
                method: 'GET'
              };
            const response = await fetch(url, options);
            if (response.status === 200) {
                const data : OpenLibResponse = await response.json();
                return res.status(200).send(data[isbnKey]);
            }
            return res.status(404).send({message: "Book not found"});
        } catch (err) {
            return res.status(500).send(err);
        }
    }
    else {
        return res.status(405).json({ message: "Method not supported" });
    }
};

export default handler;