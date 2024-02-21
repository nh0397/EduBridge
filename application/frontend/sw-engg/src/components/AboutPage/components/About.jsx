import {Box, Flex, Heading, Stack, Text, useColorModeValue,} from "@chakra-ui/react";


export const About = ({me}) => {
    return (
        <Flex
            id="about"
            minH={"60vh"}
            w={"full"}
            bgGradient={useColorModeValue(
                "linear(to-b, white, blue.200, white)",
                "linear(to-b, black, blue.800, black)"
            )}
            align={"center"}
            justify={"center"}
        >
            <Stack
                direction={{base: "column", md: "row"}}
                spacing={{base: 12, md: 6}}
                w={"full"}
                p={{base: 8, md: 16}}
            >
                <Box>
                    <Heading
                        fontWeight={"normal"}
                        as={"h1"}
                        size={{base: "3xl", md: "4xl"}}
                        color={useColorModeValue("gray.800", "gray.100")}
                    >
                        I make things{" "}
                        <Text
                            as={"span"}
                            color={useColorModeValue("blue.600", "blue.300")}
                        >
                            for the web
                        </Text>
                    </Heading>
                </Box>
                <Box>
                    <Flex w={"full"} h={"full"}>
                        <Box>
                            <Heading as={"h2"} fontSize={"3xl"}>
                                About
                            </Heading>
                            <Text fontSize={"lg"} mt={4}>
                                {me.about}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Stack>
        </Flex>
    );
};

export default About;