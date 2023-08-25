import { NextApiRequest, NextApiResponse } from 'next';

interface YelpLocation {
    address?: string;
    city?: string;
    zip_code?: number
    country?: string;
    state?: string;
}

export interface YelpMatchResponse {
    id?: string;
    alias?: string;
    name?: string;
    location?: YelpLocation;
    phone?: string;
}

export interface YelpMatchResponses {
    businesses: YelpMatchResponse[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) : Promise<void | NextApiResponse<any>> {
    if(req.method === "GET"){
      const query = req.query;
      
      // Check if necessary query parameters are present
      if (!query.name || !query.address || !query.city || !query.state || !query.country) {
        res.status(400).json({message: "Required query parameters are missing"});
        return;
      }

      try {
        const url = encodeURI(`${process.env.YELP_API_URL}/matches?name=${query.name}&address1=${query.address}&city=${query.city}&state=${query.state}&country=${query.country}&limit=3&match_threshold=default`);
        const options = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
          }
        };
        const response = await fetch(url, options);
        const data : YelpMatchResponses = await response.json();
        if(response.status === 200 && data.businesses.length > 0){
          res.status(response.status).json(data.businesses[0]);
        }
        else {
          return res.status(204).json({"message": "No content"});
        }
      }
      catch(err) {
        return res.status(500).send(err);
      }
    }
    else {
      return res.status(405).json({message: "Method not supported"});
    }
}
