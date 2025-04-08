import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import useAnimeServices from '../services/AnimeServices';
import './singleComic.scss';

const SingleComic = ({charId}) => {
    const [char, setChar] = useState({});

    const {getCharacterById, error, loading} = useAnimeServices();

    useEffect(() => {
        getCharacterById(!charId ? '101175' : charId).then(setChar);
    }, [charId]);

    const {name, img, about, anime=[]} = char;

    const items = anime.map((item, i) => {
        return (
            <li className='single-comic__item' key={i}>
                <a href={item.anime.url}><h3>{item.anime.title}</h3></a>
            </li>
        )
    })

    const list = items.length === 0 ? <li className='single-comic__item'>Аніме з цим персонажем немає, але все може змінитися!</li> : items;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !error && !loading ? <View list={list} name={name} img={img} about={about} /> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

const View = ({name, img, about, list}) => {
    return (
        <div className="single-comic">
            <img src={img} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{about}</p>
                <h2 style={{"margin": '20px 0'}} className='single-comic__name'>Аніме з цим персонажем:</h2>
                <ul>
                    {list}
                </ul>
            </div>
            <Link to="/characters" className="single-comic__back">Назад до всіх</Link>
        </div>
    )
}

export default SingleComic;