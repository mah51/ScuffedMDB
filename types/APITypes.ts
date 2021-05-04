export interface MovieEndpointBodyType {
  id: string;
}

export interface ReviewEndpointBodyType {
  movieID: string;
  comment?: string;
  rating: number;
}
