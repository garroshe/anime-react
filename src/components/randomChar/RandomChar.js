import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ThemContext } from '../app/App';

import useAnimeServices from '../services/AnimeServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import child from '../../resources/img/child.webp';

const RandomChar = (props) => {
    const [char, setChar] = useState({});
    const {getCharacter, clearError, loading, error} = useAnimeServices();

    const them = useContext(ThemContext);

    const updateChar = () => {
        clearError();
        getCharacter().then(setChar)
    }

    useEffect(()=> {
        updateChar();
    }, []);

    const spinner = loading ? <Spinner/> : null;
    const content = (!loading && !error) ? <View getIdSelectChar={props.getIdSelectChar} char={char}/>: null;
    const errorMessage = error ? <ErrorMessage/>: null;
    return (
        <>
            <h2 style={{'color': them ? '#ffffff' : 'rgb(37, 37, 39)'}} className='randomchar__header'>Випадковий персонаж</h2>
            <div className="randomchar">
                {spinner}  
                {content}
                {errorMessage} 
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Випадковий персонаж на сьогодні!<br/>
                        Хочете познайомитися з ним ближче?
                    </p>
                    <p className="randomchar__title">
                        Або виберіть інший
                    </p>
                    <button onClick={updateChar} className="button button__main">
                        <div className="inner">спробуйте ще раз</div>
                    </button>
                    <img src={child} alt="child" className="randomchar__decoration"/>
                </div>
            </div>
        </>
    )
}

const View = (props) => {
    const {img, about, name, url, id} = props.char;

    return (
        <div className="randomchar__block">
            <img src={img} alt={name} className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {about}
                </p>
                <div className="randomchar__btns">
                    <Link to="/characters/character" onClick={()=> props.getIdSelectChar(id)} className="button button__main">
                        <div className="inner">домашня сторінка</div>
                    </Link>
                    <a href={url} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

View.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string,
    about: PropTypes.string
}

export default RandomChar;