import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import { ListOnScrollProps } from 'react-window';
import { api } from '/@/renderer/api';
import { queryKeys } from '/@/renderer/api/query-keys';
import { Album, GenreListQuery, LibraryItem } from '/@/renderer/api/types';
import { ALBUM_CARD_ROWS } from '/@/renderer/components';
import {
    VirtualGridAutoSizerContainer,
    VirtualInfiniteGrid,
} from '/@/renderer/components/virtual-grid';
import { useListContext } from '/@/renderer/context/list-context';
import { usePlayQueueAdd } from '/@/renderer/features/player';
import { AppRoute } from '/@/renderer/router/routes';
import { useCurrentServer, useListStoreActions, useListStoreByKey } from '/@/renderer/store';
import { CardRow, ListDisplayType } from '/@/renderer/types';

export const GenreListGridView = ({ gridRef, itemCount }: any) => {
    const queryClient = useQueryClient();
    const server = useCurrentServer();
    const handlePlayQueueAdd = usePlayQueueAdd();
    const { pageKey, id } = useListContext();
    const { grid, display, filter } = useListStoreByKey({ key: pageKey });
    const { setGrid } = useListStoreActions();

    const [searchParams, setSearchParams] = useSearchParams();
    const scrollOffset = searchParams.get('scrollOffset');
    const initialScrollOffset = Number(id ? scrollOffset : grid?.scrollOffset) || 0;

    const cardRows = useMemo(() => {
        const rows: CardRow<Album>[] = [ALBUM_CARD_ROWS.name];
        return rows;
    }, []);

    const handleGridScroll = useCallback(
        (e: ListOnScrollProps) => {
            if (id) {
                setSearchParams(
                    (params) => {
                        params.set('scrollOffset', String(e.scrollOffset));
                        return params;
                    },
                    { replace: true },
                );
            } else {
                setGrid({ data: { scrollOffset: e.scrollOffset }, key: pageKey });
            }
        },
        [id, pageKey, setGrid, setSearchParams],
    );

    const fetch = useCallback(
        async ({ skip, take }: { skip: number; take: number }) => {
            if (!server) {
                return [];
            }

            const query: GenreListQuery = {
                ...filter,
                limit: take,
                startIndex: skip,
            };

            const queryKey = queryKeys.albums.list(server?.id || '', query);

            const albums = await queryClient.fetchQuery({
                queryFn: async ({ signal }) => {
                    return api.controller.getGenreList({
                        apiClientProps: {
                            server,
                            signal,
                        },
                        query,
                    });
                },
                queryKey,
            });

            return albums;
        },
        [filter, queryClient, server],
    );

    return (
        <VirtualGridAutoSizerContainer>
            <AutoSizer>
                {({ height, width }: Size) => (
                    <VirtualInfiniteGrid
                        key={`album-list-${server?.id}-${display}`}
                        ref={gridRef}
                        cardRows={cardRows}
                        display={display || ListDisplayType.CARD}
                        fetchFn={fetch}
                        handlePlayQueueAdd={handlePlayQueueAdd}
                        height={height}
                        initialScrollOffset={initialScrollOffset}
                        itemCount={itemCount || 0}
                        itemGap={grid?.itemGap ?? 10}
                        itemSize={grid?.itemSize || 200}
                        itemType={LibraryItem.GENRE}
                        loading={itemCount === undefined || itemCount === null}
                        minimumBatchSize={40}
                        route={{
                            route: AppRoute.LIBRARY_ALBUMS_DETAIL,
                            slugs: [{ idProperty: 'id', slugProperty: 'albumId' }],
                        }}
                        width={width}
                        onScroll={handleGridScroll}
                    />
                )}
            </AutoSizer>
        </VirtualGridAutoSizerContainer>
    );
};
