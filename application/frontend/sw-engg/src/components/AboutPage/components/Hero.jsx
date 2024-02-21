import {Avatar, Box, Heading, Icon, Stack, Text, useColorModeValue,} from "@chakra-ui/react";


export const Hero = ({me}) => {
    return (
        <Stack
            id={"home"}
            w={"full"}
            h={"90vh"}
            spacing={0}
            justifyContent={"center"}
            alignItems={"center"}
            bg={useColorModeValue("white", "black")}
            zIndex={1}
            p={{
                base: 4,
                md: 12,
            }}
        >
            <Stack
                h={"full"}
                w={"full"}
                bg={useColorModeValue("blue.100", "gray.900")}
                rounded={"3xl"}
                border={"1px"}
                borderColor={useColorModeValue("gray.200", "gray.700")}
                p={{
                    base: 4,
                    md: 12,
                }}
                justify={"center"}
            >
                <Avatar size={"xl"} src={me.image} border={"2px"}/>
                <Heading
                    fontWeight={"normal"}
                    as={"h1"}
                    size={"3xl"}
                    color={useColorModeValue("blue.700", "gray.100")}
                >
                    Hi, I'm {me.name}
                </Heading>
                <Text fontSize={"2xl"}>{me.subtitle}</Text>
                <Text fontSize={"xl"}>{me.tagline}</Text>
                <Box mt={8}/>
                <Stack
                    direction={"row"}
                    spacing={0}
                    wrap={"wrap"}
                    rowGap={2}
                    columnGap={2}
                >
                    {me.social.map((social) => (
                        <Social
                            key={social.name}
                            name={social.name}
                            icon={social.icon}
                            url={social.uri}
                            hover={social.hover}
                        />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
};

const Social = ({
                    name,
                    icon,
                    url,
                    hover,
                }) => {
    return (
        <Stack
            direction={"row"}
            as={"a"}
            href={url}
            target={"_blank"}
            align={"center"}
            bg={useColorModeValue("white", "gray.800")}
            px={4}
            py={1}
            rounded={"full"}
            textDecoration={"none"}
            _hover={{
                bg: hover.bg,
                color: hover.color,
            }}
        >
            <Icon as={icon}/>
            <Text fontWeight={"bold"} fontSize={"lg"}>
                {name}
            </Text>
        </Stack>
    );
};

export default Hero;