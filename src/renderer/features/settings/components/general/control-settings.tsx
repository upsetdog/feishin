import { Group } from '@mantine/core';
import { t } from 'i18next';
import isElectron from 'is-electron';
import { Select, Tooltip, NumberInput, Switch, Slider } from '/@/renderer/components';
import { SettingsSection } from '/@/renderer/features/settings/components/settings-section';
import {
    SideQueueType,
    useGeneralSettings,
    useSettingsStoreActions,
} from '/@/renderer/store/settings.store';
import { Play } from '/@/renderer/types';
import { useTranslation } from 'react-i18next';

const localSettings = isElectron() ? window.electron.localSettings : null;

const SIDE_QUEUE_OPTIONS = [
    {
        label: t('setting.sidePlayQueueStyle', {
            context: 'optionAttached',
            postProcess: 'sentenceCase',
        }),
        value: 'sideQueue',
    },
    {
        label: t('setting.sidePlayQueueStyle', {
            context: 'optionDetached',
            postProcess: 'sentenceCase',
        }),
        value: 'sideDrawerQueue',
    },
];

export const ControlSettings = () => {
    const { t } = useTranslation();
    const settings = useGeneralSettings();
    const { setSettings } = useSettingsStoreActions();

    const controlOptions = [
        {
            control: (
                <Switch
                    aria-label="Toggle skip buttons"
                    defaultChecked={settings.skipButtons?.enabled}
                    onChange={(e) =>
                        setSettings({
                            general: {
                                ...settings,
                                skipButtons: {
                                    ...settings.skipButtons,
                                    enabled: e.currentTarget.checked,
                                },
                            },
                        })
                    }
                />
            ),
            description: t('setting.showSkipButtons', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.showSkipButtons', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Group>
                    <Tooltip label={t('common.backward', { postProcess: 'titleCase' })}>
                        <NumberInput
                            defaultValue={settings.skipButtons.skipBackwardSeconds}
                            min={0}
                            width={75}
                            onBlur={(e) =>
                                setSettings({
                                    general: {
                                        ...settings,
                                        skipButtons: {
                                            ...settings.skipButtons,
                                            skipBackwardSeconds: e.currentTarget.value
                                                ? Number(e.currentTarget.value)
                                                : 0,
                                        },
                                    },
                                })
                            }
                        />
                    </Tooltip>
                    <Tooltip label={t('common.forward', { postProcess: 'titleCase' })}>
                        <NumberInput
                            defaultValue={settings.skipButtons.skipForwardSeconds}
                            min={0}
                            width={75}
                            onBlur={(e) =>
                                setSettings({
                                    general: {
                                        ...settings,
                                        skipButtons: {
                                            ...settings.skipButtons,
                                            skipForwardSeconds: e.currentTarget.value
                                                ? Number(e.currentTarget.value)
                                                : 0,
                                        },
                                    },
                                })
                            }
                        />
                    </Tooltip>
                </Group>
            ),
            description: t('setting.skipDuration', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.skipDuration', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Select
                    data={[
                        {
                            label: t('setting.playButtonBehavior', {
                                context: 'optionPlay',
                                postProcess: 'titleCase',
                            }),
                            value: Play.NOW,
                        },
                        {
                            label: t('setting.playButtonBehavior', {
                                context: 'optionAddNext',
                                postProcess: 'titleCase',
                            }),
                            value: Play.NEXT,
                        },
                        {
                            label: t('setting.playButtonBehavior', {
                                context: 'optionAddLast',
                                postProcess: 'titleCase',
                            }),
                            value: Play.LAST,
                        },
                    ]}
                    defaultValue={settings.playButtonBehavior}
                    onChange={(e) =>
                        setSettings({
                            general: {
                                ...settings,
                                playButtonBehavior: e as Play,
                            },
                        })
                    }
                />
            ),
            description: t('setting.playButtonBehavior', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.playButtonBehavior', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Select
                    data={SIDE_QUEUE_OPTIONS}
                    defaultValue={settings.sideQueueType}
                    onChange={(e) => {
                        setSettings({
                            general: {
                                ...settings,
                                sideQueueType: e as SideQueueType,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.sidePlayQueueStyle', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.sidePlayQueueStyle', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.showQueueDrawerButton}
                    onChange={(e) => {
                        setSettings({
                            general: {
                                ...settings,
                                showQueueDrawerButton: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.sidePlayQueueStyle', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.floatingQueueArea', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Slider
                    defaultValue={settings.volumeWheelStep}
                    max={20}
                    min={1}
                    w={100}
                    onChangeEnd={(e) => {
                        setSettings({
                            general: {
                                ...settings,
                                volumeWheelStep: e,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.volumeWheelStep', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.volumeWheelStep', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.resume}
                    onChange={(e) => {
                        localSettings?.set('resume', e.target.checked);
                        setSettings({
                            general: {
                                ...settings,
                                resume: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.savePlayQueue', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: !isElectron(),
            title: t('setting.savePlayQueue', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    aria-label="Go to playlist songs page by default"
                    defaultChecked={settings.defaultFullPlaylist}
                    onChange={(e) =>
                        setSettings({
                            general: {
                                ...settings,
                                defaultFullPlaylist: e.currentTarget.checked,
                            },
                        })
                    }
                />
            ),
            description: t('setting.skipPlaylistPage', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.skipPlaylistPage', { postProcess: 'sentenceCase' }),
        },
    ];

    return <SettingsSection options={controlOptions} />;
};
