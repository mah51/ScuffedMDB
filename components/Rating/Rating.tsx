import { HStack, Text, Box } from '@chakra-ui/react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import React from 'react';

export const Rating = ({
  rating,
  numReviews,
}: {
  rating: number;
  numReviews: number;
}): React.ReactElement => {
  if (numReviews === 0) {
    return (
      <Text whiteSpace="nowrap" ml="10px!important">
        No reviews
      </Text>
    );
  }
  const stars = [];
  const roundedRating = Math.round(rating) / 2;
  for (let i = 0; i < 5; i++) {
    if (i + 0.5 === roundedRating) {
      stars.push(<BsStarHalf key={`${i}-half-star`} />);
    } else if (i < roundedRating) {
      stars.push(<BsStarFill key={`${i}-full-star`} />);
    } else {
      stars.push(<BsStar key={`${i}-empty-star`} />);
    }
  }

  return <HStack direction="row">{stars}</HStack>;
};

export const StarRating = ({ rating } : any) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <Box display="flex">
      {Array(fullStars)
        .fill('')
        .map((_, idx) => (
          <Star key={idx} icon={FaStar} />
        ))}
      {Array(halfStars)
        .fill('')
        .map((_, idx) => (
          <Star key={idx} icon={FaStarHalfAlt} />
        ))}
      {Array(emptyStars)
        .fill('')
        .map((_, idx) => (
          <Star key={idx} icon={FaRegStar} />
        ))}
    </Box>
  );
};


const Star = ({ icon, color = "goldenrod" } : any) => (
  <Box
    as="span"
    display="inline-block"
    border="1px solid"
    borderColor={color}
    borderRadius="3px"
    mx={0.5}
  >
    {React.createElement(icon, { color })}
  </Box>
);