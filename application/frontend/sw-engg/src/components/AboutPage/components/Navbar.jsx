import {
    Avatar,
    Box,
    Container,
    Flex,
    IconButton,
    Stack,
    StackDivider,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import {FaHamburger} from "react-icons/fa";
import {Link} from "react-scroll";


export const Navbar = ({me}) => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
            <Stack minH={"10vh"} w={"full"} align={"center"} justify={"center"}>
                <Container maxW={"container.xl"}>
                    <Flex justify={"space-between"}>
                        <Avatar
                            size={"md"}
                            src={me.image}
                            border={"1px"}
                            borderColor={useColorModeValue("blue.400", "gray.700")}
                        />
                        {isMobile ? (
                            <Box>

                                <IconButton
                                    aria-label="Open menu"
                                    icon={<FaHamburger/>}
                                    variant={"ghost"}
                                    onClick={isOpen ? onClose : onOpen}
                                />
                            </Box>
                        ) : (
                            <DesktopOptions/>
                        )}
                    </Flex>
                </Container>
            </Stack>
            <BottomSheet isOpen={isOpen} onClose={onClose}/>
        </>
    );
};

const DesktopOptions = () => {
    const bgColor = useColorModeValue("blue.50", "gray.700");
    const hoverColor = useColorModeValue("blue.100", "gray.600");
    const textColor = useColorModeValue("blue.700", "gray.100");

    return (
        <Stack direction={"row"} spacing={4} align={"center"}>
            {options.map((option) => (
                <Flex
                    align={"center"}
                    key={option.name}
                    as={Link}
                    to={option.href}
                    smooth={true}
                    cursor={"pointer"}
                    bg={bgColor}
                    px={4}
                    py={1}
                    rounded={"md"}
                    _hover={{
                        bg: hoverColor,
                    }}
                    transition={"all 0.2s ease-in-out"}
                >
                    <Text
                        fontWeight={"bold"}
                        color={textColor}
                    >
                        {option.name}
                    </Text>
                </Flex>
            ))}

        </Stack>
    );
};

const BottomSheet = ({
                         isOpen,
                         onClose,
                     }) => {
    const borderColor = useColorModeValue("blue.400", "gray.700");

    return (
        <div
            style={{
                height: isOpen ? 500 : 0,
                opacity: isOpen ? 1 : 0,
            }}
        >
            <Stack p={8} divider={<StackDivider/>} spacing={4} zIndex={-1}>
                {options.map((option) => (
                    <Box
                        w={"full"}
                        key={option.name}
                        h={"full"}
                        as={Link}
                        to={isOpen ? option.href : ""}
                        offset={-500}
                        smooth={true}
                        cursor={isOpen ? "pointer" : "default"}
                        onClick={onClose}
                        borderColor={borderColor}
                    >
                        {option.name}
                    </Box>
                ))}
            </Stack>
        </div>
    );
};

const options = [
    {
        name: "Home",
        href: "home",
    },

    {
        name: "Education",
        href: "education",
    },
    {
        name: "Experience",
        href: "experience",
    },
    {
        name: "Projects",
        href: "projects",
    },
    {
        name: "Skills",
        href: "skills",
    },

];

export default Navbar;