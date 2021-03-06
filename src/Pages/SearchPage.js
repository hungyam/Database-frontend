import {
    Box, Button, color, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay,
    Flex,
    Heading, HStack,
    Input,
    InputGroup,
    InputLeftAddon, Link, ListItem, Spacer, Table, TableContainer, Tag, Tbody, Td,
    Text, Th, Thead, Tr, UnorderedList,
    useColorModeValue, useDisclosure, useToast,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {FaLink} from "react-icons/fa";
import copy from "copy-to-clipboard"
import axios from "axios";

export default function SearchPage() {
    //Color Settings
    const borderColor = useColorModeValue('gray.200', 'gray.600')
    const bgColor = useColorModeValue('whiteAlpha.800', 'gray.800')
    const tipBgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
    const tipBorderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400')

    const [value_1, setValue_1] = useState('')
    const [value_2, setValue_2] = useState('')
    const [value_3, setValue_3] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [speciesList, setSpeciesList] = useState([])
    const [systemList, setSystemList] = useState([])
    const toast = useToast()

    const navigate = useNavigate()

    const Submit = () => {
        let type
        let keyword = null
        if (value_1 === '' && value_2 === '' && value_3 === '') {
            type = 'all'
        }else if (value_1 !== '') {
            type = 'species'
            keyword = value_1
        }else if (value_2 !== '') {
            type = 'system'
            keyword = value_2
        }else if (value_3 !== '') {
            type = 'gene'
            keyword = value_3
        }
        let url = '../table?type=' + type
        if (keyword != null) {
            url += ('&keyword=' + keyword)
        }
        navigate(url)
    }

    const loadData = () => {
        axios.get('http://localhost:8000/species')
            .then(response => {
                setSpeciesList(response.data.species)
            })
            .catch(() => {
                console.log('ERROR!')
            })
        axios.get('http://localhost:8000/system')
            .then(response => {
                setSystemList(response.data.system)
            })
            .catch(() => {
                console.log('ERROR!')
            })
    }

    const downloadAllData = () => {
        axios({
            url: 'http://localhost:8000/download',
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');

            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Data.csv');
            document.body.appendChild(fileLink);

            fileLink.click();
            fileLink.remove()
        });
    }

    useEffect(() => {
        loadData()
    },[])

    return (
        <Box position='absolute'
             w='100%'
             p='3'
        >
            <Box borderWidth='1px'
                 borderStyle='solid'
                 borderColor={borderColor}
                 p='5'
                 bgColor={bgColor}
                 borderRadius='md'
            >
                <Flex alignItems='flex-start'>
                    <Heading fontSize='30'
                             fontWeight='600'
                    >
                        Search
                    </Heading>
                    <Spacer/>
                    <Button onClick={downloadAllData} colorScheme='blue' mr='6' mt='6' size='sm'>
                        Download all data
                    </Button>
                </Flex>
                <Box mx='6' mb='5'>
                    <Text mb='2'
                          fontSize='lg'
                    >
                        Keyword
                    </Text>
                    <HStack mb='5'
                            spacing='5'
                    >
                        <InputGroup variant='filled'>
                            <InputLeftAddon children='Species:' />
                            <Input value={value_1}
                                   isDisabled={value_2 !== '' || value_3 !== ''}
                                   onChange={(e) => setValue_1(e.target.value)}/>
                        </InputGroup>
                        <InputGroup variant='filled'>
                            <InputLeftAddon children='System:' />
                            <Input value={value_2}
                                   isDisabled={value_1 !== '' || value_3 !== ''}
                                   onChange={(e) => setValue_2(e.target.value)}/>
                        </InputGroup>
                        <InputGroup variant='filled'>
                            <InputLeftAddon children='Gene/Protein:' />
                            <Input value={value_3}
                                   isDisabled={value_1 !== '' || value_2 !== ''}
                                   onChange={(e) => setValue_3(e.target.value)}/>
                        </InputGroup>
                    </HStack>
                    <Flex justifyContent='flex-end'>
                        <Button mr='3'
                                onClick={Submit}
                                colorScheme='teal'
                        >
                            Submit
                        </Button>
                        <Button variant='outline'
                                mr='4'
                                onClick={() => {
                                    setValue_1('')
                                    setValue_2('')
                                    setValue_3('')
                                }}
                                colorScheme='teal'
                        >
                            Clear
                        </Button>
                    </Flex>
                </Box>
                <Box m='6'
                     p='4'
                     borderColor={tipBorderColor}
                     borderLeftWidth='6px'
                     borderStyle='solid'
                     bgColor={tipBgColor}
                >
                    <Heading fontSize='18'>
                        Search Field
                    </Heading>
                    <UnorderedList mt='2'
                                   spacing='2'
                    >
                        <ListItem>
                            <Tag mr='3px'
                                 colorScheme='blue'
                                 fontSize='16'
                            >
                                Species
                            </Tag>
                            Use full species name is required (e.g. " Mycobacterium tuberculosis ").
                            <Link color='purple.600'
                                  ml='5'
                                  fontWeight='600'
                                  onClick={onOpen}
                            >
                                <FaLink style={{'display': "inline-block"}}/>
                                Click here for a full list of all bacterial species in the database
                            </Link>
                            <Drawer
                                isOpen={isOpen}
                                placement='right'
                                onClose={onClose}
                            >
                                <DrawerOverlay />
                                <DrawerContent>
                                    <DrawerCloseButton />
                                    <DrawerHeader>Click for copy</DrawerHeader>

                                    <DrawerBody>
                                        <TableContainer>
                                            <Table variant='simple'
                                                   size='sm'
                                            >
                                                <Thead>
                                                    <Tr>
                                                        <Th>Species</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {speciesList.map((curr, index) => (
                                                        <Tr key={index.toString()} _hover={{
                                                            bgColor: 'gray.400'
                                                        }}>
                                                            <Td cursor="pointer"
                                                                onClick={() => {
                                                                    if (copy(curr)) {
                                                                        toast({
                                                                            title: 'Copy Success',
                                                                            description: "Copy " + curr +" to your clipboard!",
                                                                            status: 'success',
                                                                            position: 'bottom',
                                                                            duration: 1000,
                                                                            isClosable: false,
                                                                        })
                                                                    }
                                                                }}
                                                            >
                                                                {curr}
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </DrawerBody>

                                </DrawerContent>
                            </Drawer>
                        </ListItem>
                        <ListItem>
                            <Tag mr='3px'
                                 colorScheme='purple'
                                 fontSize='16'
                            >
                                System
                            </Tag>
                        </ListItem>
                        <ListItem>
                            <Tag mr='3px'
                                 colorScheme='red'
                                 fontSize='16'
                            >
                                Gene/Protein
                            </Tag>
                            For example, " mazE " or " Rv1494 ".
                        </ListItem>

                    </UnorderedList>
                </Box>
            </Box>
        </Box>
    );
}
