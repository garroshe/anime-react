import { useEffect, useState, useContext } from 'react';
import useAnimeServices from '../services/AnimeServices';

import { ThemContext } from '../app/App';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charsSlider.scss';

const CharsSlider = (props) => {
    const [chars, setChars] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { getTopCharacter, loading, error } = useAnimeServices();

    const them = useContext(ThemContext);

    const updateChar = () => {
        getTopCharacter(250).then(loadMoreChars);
    }

    useEffect(() => {
        updateChar();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % chars.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [chars.length]);

    const loadMoreChars = (newCharList) => {
        setChars([...newCharList]);
    }

    const extendedImages = [...chars, chars[0]];

    const items = chars.map((item, index) => (
        <li onClick={()=> props.getIdSelectAnime(item.id)} key={index} tabIndex={0} className="char__item">
            <img src={item.img} alt={item.name} />
            <a href={item.url}><div className="char__name">{item.name}</div></a>
            <div className='char__serial'>TV Серіал</div>
        </li>
    ));

    const content = !loading && !error ? items : null;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="char__list">
            <h2 style={{'color': them ? '#ffffff' : 'rgb(37, 37, 39)'}} className='char__list-title'>Популярні аніме</h2>
            <div className="char__overflow">
                <ul style={{ transform: `translateX(-${(currentIndex * 100) / extendedImages.length}%)` }} className="char__grid">
                    {content}
                    {spinner}
                    {errorMessage}
                </ul>
            </div>
        </div>
    );
}

export default CharsSlider;