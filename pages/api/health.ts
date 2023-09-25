import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    if (request.method === "GET") {
        response.status(200).json({
            status: "OK"
        });
        return;
    }
    return response.status(405).json({ message: "Method not supported" });
}