import { CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useEffect } from 'react';
import { transparentize } from '@chakra-ui/theme-tools';
interface Props {
  message: string;
  title: string;
  storageName: string;
  color: string;
}

export default function AlertBanner({
  message,
  title,
  color,
  storageName,
}: Props): ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const bg = useColorModeValue(
    transparentize(`${color}.700`, 0.2),
    transparentize(`${color}.300`, 0.1)
  );

  useEffect(() => {
    const cookie = window.localStorage.getItem(storageName);

    if (!cookie) {
      setIsOpen(true);
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
      alignItems={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      //@ts-ignore
      bg={bg}
      px="3"
      py={{ base: isOpen ? 4 : 0, md: '0' }}
      color={useColorModeValue(`${color}.800`, `${color}.300`)}
    >
      <Text
        visibility={isOpen ? 'visible' : 'hidden'}
        width={{ base: '92%', md: 'auto' }}
        fontWeight="extrabold"
      >
        {title}
      </Text>

      <Text
        ml={{ base: 0, md: 3 }}
        visibility={isOpen ? 'visible' : 'hidden'}
        fontWeight="semibold"
      >
        {message}
      </Text>
      <CloseButton
        mb={'0.3rem'}
        mt={'0.2rem'}
        alignSelf="flex-end"
        display={isOpen ? 'inline-block' : 'none'}
        position={{ base: 'absolute', md: 'static' }}
        top={2}
        onClick={handleDismiss}
        ml={5}
      />
    </Flex>
  );
}
