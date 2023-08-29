import { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) : Promise<void | NextApiResponse<any>> {
    if(req.method === "GET"){

      const mock = {
        "id": "69M0GQ4PPEO12-vlq37_gg",
        "alias": "ronin-sushi-royal-oak",
        "name": "Ronin Sushi",
        "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/gWbfTosaFRkBG1bC9k2yIw/o.jpg",
        "is_claimed": true,
        "is_closed": false,
        "url": "https://www.yelp.com/biz/ronin-sushi-royal-oak?adjust_creative=9bRBCyXjy_KDNyshDpG3ew&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=9bRBCyXjy_KDNyshDpG3ew",
        "phone": "+12485460888",
        "display_phone": "(248) 546-0888",
        "review_count": 752,
        "categories": [
          {
            "alias": "japanese",
            "title": "Japanese"
          },
          {
            "alias": "sushi",
            "title": "Sushi Bars"
          },
          {
            "alias": "cocktailbars",
            "title": "Cocktail Bars"
          }
        ],
        "rating": 4,
        "location": {
          "address1": "326 W 4th St",
          "address2": "",
          "address3": "",
          "city": "Royal Oak",
          "zip_code": "48067",
          "country": "US",
          "state": "MI",
          "display_address": [
            "326 W 4th St",
            "Royal Oak, MI 48067"
          ],
          "cross_streets": ""
        },
        "coordinates": {
          "latitude": 42.487325,
          "longitude": -83.14757399999999
        },
        "photos": [
          "https://s3-media4.fl.yelpcdn.com/bphoto/gWbfTosaFRkBG1bC9k2yIw/o.jpg",
          "https://s3-media4.fl.yelpcdn.com/bphoto/9odAwrMV0U_2sLBetuhcJg/o.jpg",
          "https://s3-media1.fl.yelpcdn.com/bphoto/TszIjgwDGIv--il4j2ojvw/o.jpg"
        ],
        "price": "$$$",
        "hours": [
          {
            "open": [
              {
                "is_overnight": false,
                "start": "1700",
                "end": "2300",
                "day": 0
              },
              {
                "is_overnight": false,
                "start": "1700",
                "end": "2300",
                "day": 1
              },
              {
                "is_overnight": false,
                "start": "1700",
                "end": "2300",
                "day": 2
              },
              {
                "is_overnight": false,
                "start": "1700",
                "end": "2300",
                "day": 3
              },
              {
                "is_overnight": false,
                "start": "1600",
                "end": "0000",
                "day": 4
              },
              {
                "is_overnight": false,
                "start": "1600",
                "end": "0000",
                "day": 5
              },
              {
                "is_overnight": false,
                "start": "1600",
                "end": "2200",
                "day": 6
              }
            ],
            "hours_type": "REGULAR",
            "is_open_now": true
          }
        ],
        "transactions": [
          "delivery"
        ]
      };
      return res.status(200).json(mock)

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
          const alias = data.businesses[0].alias;
          const detailSearchUrl = `${process.env.YELP_API_URL}/${alias}`;
          const detailResponse = await fetch(detailSearchUrl, options);
          const yelpDetail : YelpMatchResponse = await detailResponse.json();
          res.status(detailResponse.status).json(yelpDetail);
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
