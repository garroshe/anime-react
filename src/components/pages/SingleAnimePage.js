import { useEffect, useState } from "react";

import useAnimeServices from "../services/AnimeServices";

const SingleAnimePage = ({charId}) => {
    const [anime, setAnime] = useState({});

    const {getAnimeById} = useAnimeServices();

    useEffect(()=> {
        getAnimeById(charId)
        // .then(setAnime);
    }, []);

    console.log(anime)

    return (
        <div style={{'color': '#BFBFBF'}}></div>
    )
}

export default SingleAnimePage;