import {Box, Flex, Heading, Stack} from "@chakra-ui/react";


export const Education = ({me}) => {
    return (
        <Flex
            id={"education"}
            minH={"50vh"}
            w={"full"}
            align={"center"}
            justify={"center"}
            direction={"column"}
            p={{
                base: 8,
                md: 16,
            }}
        >
            <Box w={"full"}>
                <Heading as={"h2"} fontSize={"3xl"}>
                    Education
                </Heading>
                <Stack direction={"column"} spacing={4} mt={8}>
                    {me.education.map((education) => (
                        <SingleEducation key={education.school} {...education} />
                    ))}
                </Stack>
            </Box>
        </Flex>
    );
};

const SingleEducation = ({
                             degree,
                             major,
                             school,
                             graduation,
                         }
) => {
    return (
        <Stack direction={"column"}>
            <Heading as={"h3"} fontSize={"2xl"}>
                {school}
            </Heading>
            <Heading as={"h4"} fontSize={"xl"} fontWeight={"normal"}>
                {degree} in {major}
            </Heading>
            <Heading as={"h5"} fontSize={"md"} fontWeight={"normal"}>
                {graduation}
            </Heading>
        </Stack>
    );
};

export default Education;