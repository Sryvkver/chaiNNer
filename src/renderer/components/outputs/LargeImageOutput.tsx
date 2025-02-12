/* eslint-disable no-nested-ternary */
import { NamedExpression, NamedExpressionField, literal } from '@chainner/navi';
import { ViewOffIcon, WarningIcon } from '@chakra-ui/icons';
import { Box, Center, HStack, Image, Spinner, Text } from '@chakra-ui/react';
import { memo, useEffect } from 'react';
import { useContext, useContextSelector } from 'use-context-selector';
import { isStartingNode } from '../../../common/util';
import { BackendContext } from '../../contexts/BackendContext';
import { GlobalContext, GlobalVolatileContext } from '../../contexts/GlobalNodeState';
import { OutputProps } from './props';

interface LargeImageBroadcastData {
    image: string;
    width: number;
    height: number;
    channels: number;
}

export const LargeImageOutput = memo(
    ({ id, outputId, useOutputData, animated, schemaId }: OutputProps) => {
        const { setManualOutputType } = useContext(GlobalContext);
        const { schemata } = useContext(BackendContext);
        const schema = schemata.get(schemaId);

        const zoom = useContextSelector(GlobalVolatileContext, (c) => c.zoom);

        const { current, last, stale } = useOutputData<LargeImageBroadcastData>(outputId);

        useEffect(() => {
            if (isStartingNode(schema)) {
                if (current) {
                    setManualOutputType(
                        id,
                        outputId,
                        new NamedExpression('Image', [
                            new NamedExpressionField('width', literal(current.width)),
                            new NamedExpressionField('height', literal(current.height)),
                            new NamedExpressionField('channels', literal(current.channels)),
                        ])
                    );
                } else {
                    setManualOutputType(id, outputId, undefined);
                }
            }
        }, [id, schemaId, current, outputId, schema, setManualOutputType]);

        const imgBgColor = 'var(--node-image-preview-bg)';
        const fontColor = 'var(--node-image-preview-color)';

        return (
            <Center
                h="full"
                minH="2rem"
                overflow="hidden"
                verticalAlign="middle"
                w="full"
            >
                <Center
                    h="200px"
                    // overflow="hidden"
                    w="200px"
                >
                    <Box
                        display={stale ? 'block' : 'none'}
                        h="200px"
                        marginRight="-200px"
                        w="200px"
                        zIndex="99"
                    >
                        <HStack
                            alignContent="center"
                            alignItems="center"
                            bgColor={imgBgColor}
                            borderRadius="md"
                            margin={2}
                            opacity={0.75}
                            px={2}
                            py={1}
                            spacing={1}
                            verticalAlign="middle"
                            w="auto"
                            zIndex="99"
                        >
                            <WarningIcon
                                boxSize={3}
                                color={fontColor}
                            />
                            <Text
                                color={fontColor}
                                fontSize="sm"
                                fontWeight={500}
                            >
                                Outdated
                            </Text>
                        </HStack>
                    </Box>
                    <Center
                        bgColor={imgBgColor}
                        borderRadius="md"
                        h="200px"
                        maxH="200px"
                        maxW="200px"
                        minH="200px"
                        minW="200px"
                        overflow="hidden"
                        w="200px"
                    >
                        {last ? (
                            <Center
                                maxH="200px"
                                maxW="200px"
                            >
                                <Image
                                    alt="Image preview failed to load, probably unsupported file type."
                                    backgroundImage={
                                        last.channels === 4
                                            ? 'data:image/webp;base64,UklGRigAAABXRUJQVlA4IBwAAAAwAQCdASoQABAACMCWJaQAA3AA/u11j//aQAAA'
                                            : ''
                                    }
                                    draggable={false}
                                    maxH="200px"
                                    maxW="200px"
                                    src={last.image}
                                    sx={{
                                        imageRendering: zoom > 2 ? 'pixelated' : 'auto',
                                    }}
                                />
                            </Center>
                        ) : animated ? (
                            <Spinner />
                        ) : (
                            <HStack>
                                <ViewOffIcon />
                                <Text
                                    fontSize="sm"
                                    lineHeight="0.5rem"
                                >
                                    Image not available.
                                </Text>
                            </HStack>
                        )}
                    </Center>
                </Center>
            </Center>
        );
    }
);
