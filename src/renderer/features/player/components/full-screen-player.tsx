import { useLayoutEffect, useRef } from 'react';
import { Divider, Group } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { Variants, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RiArrowDownSLine, RiSettings3Line } from 'react-icons/ri';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import {
    Button,
    NumberInput,
    Option,
    Popover,
    Select,
    Slider,
    Switch,
} from '/@/renderer/components';
import {
    useCurrentSong,
    useFullScreenPlayerStore,
    useFullScreenPlayerStoreActions,
    useLyricsSettings,
    useSettingsStore,
    useSettingsStoreActions,
    useWindowSettings,
} from '/@/renderer/store';
import { useFastAverageColor } from '../../../hooks/use-fast-average-color';
import { FullScreenPlayerImage } from '/@/renderer/features/player/components/full-screen-player-image';
import { FullScreenPlayerQueue } from '/@/renderer/features/player/components/full-screen-player-queue';
import { TableConfigDropdown } from '/@/renderer/components/virtual-table';
import { Platform } from '/@/renderer/types';

const Container = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    display: flex;
    justify-content: center;
    padding: 2rem;

    @media screen and (width <= 768px) {
        padding: 2rem 2rem 1rem;
    }
`;

const ResponsiveContainer = styled.div`
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 2rem 2rem;
    width: 100%;
    max-width: 2560px;
    margin-top: 5rem;

    @media screen and (width <= 768px) {
        grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
        grid-template-columns: minmax(0, 1fr);
        margin-top: 0;
    }
`;

const BackgroundImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: var(--bg-header-overlay);
`;

const Controls = () => {
    const { t } = useTranslation();
    const { dynamicBackground, expanded, opacity, useImageAspectRatio } =
        useFullScreenPlayerStore();
    const { setStore } = useFullScreenPlayerStoreActions();
    const { setSettings } = useSettingsStoreActions();
    const lyricConfig = useLyricsSettings();

    const handleToggleFullScreenPlayer = () => {
        setStore({ expanded: !expanded });
    };

    const handleLyricsSettings = (property: string, value: any) => {
        setSettings({
            lyrics: {
                ...useSettingsStore.getState().lyrics,
                [property]: value,
            },
        });
    };

    useHotkeys([['Escape', handleToggleFullScreenPlayer]]);

    return (
        <Group
            p="1rem"
            pos="absolute"
            spacing="sm"
            sx={{
                left: 0,
                top: 10,
            }}
        >
            <Button
                compact
                size="sm"
                tooltip={{ label: t('common.minimize', { postProcess: 'titleCase' }) }}
                variant="subtle"
                onClick={handleToggleFullScreenPlayer}
            >
                <RiArrowDownSLine size="2rem" />
            </Button>
            <Popover position="bottom-start">
                <Popover.Target>
                    <Button
                        compact
                        size="sm"
                        tooltip={{ label: t('common.configure', { postProcess: 'titleCase' }) }}
                        variant="subtle"
                    >
                        <RiSettings3Line size="1.5rem" />
                    </Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.dynamicBackground', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Switch
                                defaultChecked={dynamicBackground}
                                onChange={(e) =>
                                    setStore({
                                        dynamicBackground: e.target.checked,
                                    })
                                }
                            />
                        </Option.Control>
                    </Option>
                    {dynamicBackground && (
                        <Option>
                            <Option.Label>
                                {t('page.fullscreenPlayer.config.opacity', {
                                    postProcess: 'sentenceCase',
                                })}
                            </Option.Label>
                            <Option.Control>
                                <Slider
                                    defaultValue={opacity}
                                    label={(e) => `${e} %`}
                                    max={100}
                                    min={1}
                                    w="100%"
                                    onChangeEnd={(e) => setStore({ opacity: Number(e) })}
                                />
                            </Option.Control>
                        </Option>
                    )}
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.useImageAspectRatio', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Switch
                                checked={useImageAspectRatio}
                                onChange={(e) =>
                                    setStore({
                                        useImageAspectRatio: e.target.checked,
                                    })
                                }
                            />
                        </Option.Control>
                    </Option>
                    <Divider my="sm" />
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.followCurrentLyric', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Switch
                                checked={lyricConfig.follow}
                                onChange={(e) =>
                                    handleLyricsSettings('follow', e.currentTarget.checked)
                                }
                            />
                        </Option.Control>
                    </Option>
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.showLyricProvider', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Switch
                                checked={lyricConfig.showProvider}
                                onChange={(e) =>
                                    handleLyricsSettings('showProvider', e.currentTarget.checked)
                                }
                            />
                        </Option.Control>
                    </Option>
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.showLyricMatch', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Switch
                                checked={lyricConfig.showMatch}
                                onChange={(e) =>
                                    handleLyricsSettings('showMatch', e.currentTarget.checked)
                                }
                            />
                        </Option.Control>
                    </Option>
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.lyric', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Group
                                noWrap
                                w="100%"
                            >
                                <Slider
                                    defaultValue={lyricConfig.fontSize}
                                    label={(e) =>
                                        `${t('page.fullscreenPlayer.config.synchronized', {
                                            postProcess: 'titleCase',
                                        })}: ${e}px`
                                    }
                                    max={72}
                                    min={8}
                                    w="100%"
                                    onChangeEnd={(e) => handleLyricsSettings('fontSize', Number(e))}
                                />
                                <Slider
                                    defaultValue={lyricConfig.fontSize}
                                    label={(e) =>
                                        `${t('page.fullscreenPlayer.config.unsynchronized', {
                                            postProcess: 'sentenceCase',
                                        })}: ${e}px`
                                    }
                                    max={72}
                                    min={8}
                                    w="100%"
                                    onChangeEnd={(e) =>
                                        handleLyricsSettings('fontSizeUnsync', Number(e))
                                    }
                                />
                            </Group>
                        </Option.Control>
                    </Option>
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.lyricGap', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Group
                                noWrap
                                w="100%"
                            >
                                <Slider
                                    defaultValue={lyricConfig.gap}
                                    label={(e) => `Synchronized: ${e}px`}
                                    max={50}
                                    min={0}
                                    w="100%"
                                    onChangeEnd={(e) => handleLyricsSettings('gap', Number(e))}
                                />
                                <Slider
                                    defaultValue={lyricConfig.gap}
                                    label={(e) => `Unsynchronized: ${e}px`}
                                    max={50}
                                    min={0}
                                    w="100%"
                                    onChangeEnd={(e) =>
                                        handleLyricsSettings('gapUnsync', Number(e))
                                    }
                                />
                            </Group>
                        </Option.Control>
                    </Option>
                    <Option>
                        <Option.Label>
                            {t('page.fullscreenPlayer.config.lyricAlignment', {
                                postProcess: 'sentenceCase',
                            })}
                        </Option.Label>
                        <Option.Control>
                            <Select
                                data={[
                                    {
                                        label: t('common.left', {
                                            postProcess: 'titleCase',
                                        }),
                                        value: 'left',
                                    },
                                    {
                                        label: t('common.center', {
                                            postProcess: 'titleCase',
                                        }),
                                        value: 'center',
                                    },
                                    {
                                        label: t('common.right', {
                                            postProcess: 'titleCase',
                                        }),
                                        value: 'right',
                                    },
                                ]}
                                value={lyricConfig.alignment}
                                onChange={(e) => handleLyricsSettings('alignment', e)}
                            />
                        </Option.Control>
                    </Option>
                    <Option>
                        <Option.Label>Lyrics offset (ms)</Option.Label>
                        <Option.Control>
                            <NumberInput
                                defaultValue={lyricConfig.delayMs}
                                hideControls={false}
                                step={10}
                                onBlur={(e) =>
                                    handleLyricsSettings('delayMs', Number(e.currentTarget.value))
                                }
                            />
                        </Option.Control>
                    </Option>
                    <Divider my="sm" />
                    <TableConfigDropdown type="fullScreen" />
                </Popover.Dropdown>
            </Popover>
        </Group>
    );
};

const containerVariants: Variants = {
    closed: (custom) => {
        const { windowBarStyle } = custom;
        return {
            height:
                windowBarStyle === Platform.WINDOWS || windowBarStyle === Platform.MACOS
                    ? 'calc(100vh - 120px)'
                    : 'calc(100vh - 90px)',
            position: 'absolute',
            top: '100vh',
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
            width: '100vw',
            y: -100,
        };
    },
    open: (custom) => {
        const { dynamicBackground, background, windowBarStyle } = custom;
        return {
            background: dynamicBackground ? background : 'var(--main-bg)',
            height:
                windowBarStyle === Platform.WINDOWS || windowBarStyle === Platform.MACOS
                    ? 'calc(100vh - 120px)'
                    : 'calc(100vh - 90px)',
            left: 0,
            position: 'absolute',
            top: 0,
            transition: {
                background: {
                    duration: 0.5,
                    ease: 'easeInOut',
                },
                delay: 0.1,
                duration: 0.5,
                ease: 'easeInOut',
            },
            width: '100vw',
            y: 0,
        };
    },
};

export const FullScreenPlayer = () => {
    const { dynamicBackground } = useFullScreenPlayerStore();
    const { setStore } = useFullScreenPlayerStoreActions();
    const { windowBarStyle } = useWindowSettings();

    const location = useLocation();
    const isOpenedRef = useRef<boolean | null>(null);

    useLayoutEffect(() => {
        if (isOpenedRef.current !== null) {
            setStore({ expanded: false });
        }

        isOpenedRef.current = true;
    }, [location, setStore]);

    const currentSong = useCurrentSong();
    const { color: background } = useFastAverageColor({
        algorithm: 'dominant',
        src: currentSong?.imageUrl,
        srcLoaded: true,
    });

    return (
        <Container
            animate="open"
            custom={{ background, dynamicBackground, windowBarStyle }}
            exit="closed"
            initial="closed"
            transition={{ duration: 2 }}
            variants={containerVariants}
        >
            <Controls />
            {dynamicBackground && <BackgroundImageOverlay />}
            <ResponsiveContainer>
                <FullScreenPlayerImage />
                <FullScreenPlayerQueue />
            </ResponsiveContainer>
        </Container>
    );
};
