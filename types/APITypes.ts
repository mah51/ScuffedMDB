export interface MovieEndpointBodyType {
  id: string;
}

export interface ReviewEndpointBodyType {
  restaurantID?: string;
  movieID?: string;
  comment?: string;
  rating: number;
}
