import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

interface YelpLocation {
  address?: string;
  city?: string;
  zip_code?: number
  country?: string;
  state?: string;
  display_address?: string[];
}

export interface YelpMatchResponse {
  id?: string;
  alias?: string;
  name?: string;
  location?: YelpLocation;
  phone?: string;
  display_phone?: string;
  image_url?: string;
  is_closed?: boolean
  url?: string;
  review_count?: number;
  rating?: number;
  categories?: any[];
  price?: string;
  photos?: any;
  hours?: any;
}

export interface YelpMatchResponses {
  businesses: YelpMatchResponse[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void | NextApiResponse<any>> {
  const session = await getSession({ req });
  if (!session?.user) {
    return res
      .status(401)
      .json({ message: 'Please log in to view this content' });
  }
  if (req.method === "GET") {
    const query = req.query;

    // Check if necessary query parameters are present
    if (query.state && query.state.length > 0) {
      await useMatchesEndpoint(query, res);
    }
    else {
      await useSearchEndpoint(query, res);
    }
  }
  else {
    return res.status(405).json({ message: "Method not supported" });
  }
}

const useMatchesEndpoint = async (query: any, res: NextApiResponse) => {
  if (!query.name || !query.address || !query.city || !query.state || !query.country) {
    res.status(400).json({ message: "Required query parameters are missing" });
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
    const data: YelpMatchResponses = await response.json();
    if (response.status === 200 && data.businesses.length > 0) {
      const alias = data.businesses[0].alias;
      const detailSearchUrl = `${process.env.YELP_API_URL}/${alias}`;
      const detailResponse = await fetch(detailSearchUrl, options);
      const yelpDetail: YelpMatchResponse = await detailResponse.json();
      return res.status(detailResponse.status).json(yelpDetail);
    }
    else {
      return res.status(204).end();
    }
  }
  catch (err) {
    return res.status(500).json({message: 'Internal server error'});
  }
}

const useSearchEndpoint = async (query: any, res: NextApiResponse) => {
  if (!query.name || !query.address || !query.city || !query.country) {
    res.status(400).json({ message: "Required query parameters are missing" });
    return;
  }

  try {
    const url = encodeURI(`${process.env.YELP_API_URL}/search?location=${query.address}&term=${query.name}&categories=restaurant&sort_by=best_match&limit=5`);
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`
      }
    };
    let response = await fetch(url, options);
    let data: YelpMatchResponses = await response.json();
    if (response.status != 200 || data?.businesses?.length < 1) {
      const urlWithCountryCity = encodeURI(`${process.env.YELP_API_URL}/search?location=${query.city + ', ' + query.country}&term=${query.name}&categories=restaurant&sort_by=best_match&limit=5`);
      response = await fetch(urlWithCountryCity, options);
      data = await response.json();
    }
    if (response.status === 200 && data.businesses.length > 0) {
      const alias = data.businesses[0].alias;
      const detailSearchUrl = `${process.env.YELP_API_URL}/${alias}`;
      const detailResponse = await fetch(detailSearchUrl, options);
      const yelpDetail: YelpMatchResponse = await detailResponse.json();
      return res.status(detailResponse.status).json(yelpDetail);
    }
    else {
      return res.status(204).end();
    }
  }
  catch (err) {
    return res.status(500).json({message: 'Internal server error'});
  }
}