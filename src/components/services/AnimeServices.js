import { useHttp } from "../../hooks/http.hook"

const useAnimeServices = () => {

    const _API_BASE = 'https://api.jikan.moe/v4/';

    const {request, loading, error, clearError} = useHttp();
    //use
    const getCharacter =  async () => {
        const res = await request(`${_API_BASE}random/characters`);
        return _transformData(res.data)
    }
    //use
    const getTopCharacter = async (offset) => {
        const res = await request(`${_API_BASE}anime/${offset}/recommendations`);
        return res.data.map(_transformTopCharData);
    }
    //use
    const getCharacterById = async (id) => {
        const res = await request(`${_API_BASE}characters/${id}/full`);
        return _transformDataById(res.data);
    }
    //use
    const getTopAnime = async () => {
        const res = await request(`${_API_BASE}recommendations/anime`);
        return _transformDataTopAnime(res.data[0].entry[0]);
    }

    const getCharacterByName = async (name) => {
        const query = `
            query ($search: String) {
                Character(search: $search) {
                    id
                    name {
                        full
                        native
                    }
                    image {
                        large
                    }
                    favourites
                }
            }
        `;

        const variables = { search: name };
        const response = await request('https://graphql.anilist.co', 'POST', JSON.stringify({ query, variables }));
        return _transformCharacterByName(response.data.Character);
    };

    const getCharacterToOffset = async (page = 1, perPage = 48) => {
        const query = `
            query ($page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    characters {
                        id
                        name {
                            full
                        }
                        image {
                            large
                        }
                        favourites
                        media {
                            edges {
                                node {
                                    type
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = {page, perPage};
        const response = await request('https://graphql.anilist.co', 'POST', JSON.stringify({ query, variables }));
        return response.data.Page.characters;
    }

    const getAnimeToOffset = async (page = 1, perPage = 48) => {
        const query = `
            query ($page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    media(type: ANIME) {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            large
                        }
                        format
                        popularity
                        episodes
                        genres
                    }
                }
            }
        `;

        const variables = {page, perPage};
        const response = await request('https://graphql.anilist.co', 'POST', JSON.stringify({ query, variables }));
        return response.data.Page.media;
    }

    const getAnimeByName = async (name) => {
        const query = `
            query ($search: String) {
                Page(perPage: 10) {
                    media(search: $search, type: ANIME) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                        }
                        description
                        episodes
                        averageScore
                    }
                }
            }
        `;

        const variables = {search: name};
        const response = await request('https://graphql.anilist.co', 'POST', JSON.stringify({ query, variables }));
        return response.data.Page.media;
    }

    const getAnimeById = async (id) => {
        const query = `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    coverImage {
                        large
                    }
                    description
                    episodes
                    averageScore
                    popularity
                    bannerImage
                    duration
                    status
                    season
                    seasonYear
                    format
                    genres
                    averageScore
                }
            }
        `;

        const variables = {id};
        const response = await request('https://graphql.anilist.co', 'POST', JSON.stringify({ query, variables }));
        return response.data.Media;
    }

    const _transformData = (char) => {
        return {
            id: char.mal_id,
            name: char.name,
            about: char.about ? `${char.about.slice(0, 150)}...` : 'Про цього персонажа поки що нічого не відомо, але хто знає, що приховує майбутнє?',
            img: char.images.webp.image_url,
            url: char.url,
        }
    }

    const _transformTopCharData = (data) => {
        return {
            img: data.entry.images.webp.image_url,
            id: data.entry.mal_id,
            name: `${data.entry.title.slice(0, 15)}...`,
            url: data.entry.url
        }
    }

    const _transformDataById = (char) => {
        return {
            name: char.name,
            img: char.images.webp.image_url,
            anime: char.anime,
            about: char.about ? `${char.about.slice(0, 200)}...` : 'По цьому персонажу немає опису',
            url: char.url,
        }
    }

    //New -->
    const _transformDataTopAnime = (anime) => {
        return {
            id: anime.mal_id,
            title: anime.title,
            img: anime.images.webp.image_url,
            url: anime.url,

        }
    }

    const _transformCharacterByName = (data) => {
        return {
            id: data.id,
            name: data.name.full,
            img: data.image.large,
            favourites: data.favourites,
        }
    }

    return {getCharacter, 
            clearError, 
            loading, 
            error, 
            getTopCharacter, 
            getCharacterById, 
            getTopAnime,
            getCharacterByName, 
            getCharacterToOffset,
            getAnimeToOffset,
            getAnimeByName,
            getAnimeById
    }
}

export default useAnimeServices;