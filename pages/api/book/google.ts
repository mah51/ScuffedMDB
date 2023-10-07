import { SearchResponse } from 'models/api/books/googleBooksResponse';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
    if (req.method === "GET") {
        try {
            const query = req.query;
            let search = ''
            if (query?.key) {
                search = search.concat(query.key);
            }
            else {
                return res.status(400).send({ "message": "missing required fields [key]" })
            }

            if (query?.title){
                search = search.concat("+intitle:", query.title);
            }
            if (query?.author) {
                search = search.concat("+inauthor:", query.author);
            }

            const url = encodeURI(`${process.env.GOOGLE_BOOKS_API_URL}/volumes?q=${search}&key=${process.env.GOOGLE_API_KEY}`);
            const options = {
                method: 'GET'
              };
            const response = await fetch(url, options); 
            const data : SearchResponse = await response.json();
            return res.status(200).send(data);
        } catch (err) {
            return res.status(500).send(err);
        }
    }
    else {
        return res.status(405).json({ message: "Method not supported" });
    }
};

export default handler;