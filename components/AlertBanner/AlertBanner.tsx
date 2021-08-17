import { CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useEffect } from 'react';

interface Props {
  message: string;
  title: string;
  storageName: string;
  type: 'error' | 'success';
}

const colors = {
  error: { bg: { light: 'red.500', dark: 'red.200' } },
  success: {
    bg: {
      light: 'green.400',
      dark: 'green.200',
    },
  },
};

export default function AlertBanner({
  message,
  title,
  type,
  storageName,
}: Props): ReactElement {
  const [isOpen, setIsOpen] = React.useState(true);
  const color = useColorModeValue('white', 'gray.800');
  const bg = useColorModeValue(
    `${colors[type].bg.light}`,
    `${colors[type].bg.dark}`
  );
  useEffect(() => {
    const cookie = window.localStorage.getItem(storageName);

    if (cookie) {
      setIsOpen(false);
    }
  }, [storageName]);

  const handleDismiss = () => {
    setIsOpen(false);
    window.localStorage.setItem(storageName, 'true');
  };

  return (
    <Flex
      height={isOpen ? '' : '0%'}
      justifyContent="center"
      alignItems="center"
      bg={bg}
      color={color}
    >
      <Text visibility={isOpen ? 'visible' : 'hidden'} fontWeight="extrabold">
        {title}
      </Text>

      <Text
        ml={3}
        visibility={isOpen ? 'visible' : 'hidden'}
        fontWeight="semibold"
      >
        {message}
      </Text>
      <CloseButton
        mb={'0.3rem'}
        mt={'0.2rem'}
        display={isOpen ? 'inline-block' : 'none'}
        onClick={handleDismiss}
        ml={5}
      />
    </Flex>
  );
}
