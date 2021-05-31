import React from "react";
import { Avatar, Flex, Heading, chakra, VStack, Text } from "@chakra-ui/react";

export default function AboutUserSection({ user, reviews }) {
    return (
        <Flex justifyContent="center">
            <Avatar
                mr={10}
                size="2xl"
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
            />
            <VStack textAlign="left" alignItems="flex-start">
                <Heading size="3xl">
                    {user.username}
                    <chakra.span color="gray.500" fontSize="2xl">
                        #{user.discriminator}
                    </chakra.span>
                </Heading>
                <Text fontSize="2xl" color="gray.500" alignSelf="flex-start">
                    {reviews.length === 0
                        ? "No reviews"
                        : reviews.length + " Rating"}
                    {reviews.length > 1 ? "s" : ""}{" "}
                    {reviews.length > 0 &&
                        "·  " +
                            (
                                reviews.reduce((a, c) => a + c.rating, 0) /
                                reviews.length
                            ).toFixed(1) +
                            "    Average Rating"}
                </Text>
            </VStack>
        </Flex>
    );
}
