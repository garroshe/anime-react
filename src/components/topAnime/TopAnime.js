import { useEffect, useState, useContext } from 'react';

import { ThemContext } from '../app/App';

import useAnimeServices from '../services/AnimeServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './topAnime.scss';

const TopAnime = () => {

    const [anime, setAnime] = useState({});

    const {getTopAnime, loading, error} = useAnimeServices();

    const them = useContext(ThemContext);

    useEffect(()=> {
        getTopAnime().then(setAnime);
    }, []);

    const content = !loading && anime ? <View title={anime.title} url={anime.url} img={anime.img}/> : null;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <>
            <h2 style={{'color': them ? '#ffffff' : 'rgb(37, 37, 39)'}} className='anime-header'>Рекомендація дня</h2>
            <div className="anime-block">
                {content}
                {spinner}
                {errorMessage}
            </div>
        </>
    )
}

const View = ({title, url, img}) => {
    return (
        <>
            <img src={img} alt="Anime Poster" className="anime-poster"/>
            <div className="anime-info">
                <h2 className="anime-title">{title}</h2>
                <p className="anime-description">Захоплива історія, що перенесе вас у світ неймовірних пригод.Пригоди, які змінять ваше уявлення про дружбу та відвагу. Досліджуйте загадковий світ разом із харизматичними героями.</p>
                <button className="read-more-btn"><a href={url}>Дізнатися більше</a></button>
            </div>
        </>
    )
}

export default TopAnime;