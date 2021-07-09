import { ChakraProps, chakra } from '@chakra-ui/react';
import React from 'react';

function Wave({ color = 'purple', ...props }: ChakraProps): JSX.Element {
  return (
    <chakra.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 86 10"
      {...props}
    >
      <path
        fill={`var(--chakra-colors-${color}-500)`}
        d="M84.8 0c-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7C63 2.3 61 0 57 0c-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7c-1.8-2-3.8-4.3-7.7-4.3-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7C7.3 2.3 5.3 0 1.4 0 .8 0 .4.4.4 1s.4 1 1 1c3 0 4.5 1.7 6.2 3.7 1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7s4.5 1.7 6.2 3.7c1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3C52.5 3.7 54 2 57 2s4.5 1.7 6.2 3.7C65 7.7 67 10 70.9 10c3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7.6 0 1-.4 1-1s-.4-1-1-1z"
      ></path>
    </chakra.svg>
  );
}

export default Wave;
