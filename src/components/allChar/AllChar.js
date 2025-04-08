import { useEffect, useState } from 'react';
import useAnimeServices from '../services/AnimeServices';
import { useDebounce } from '../../hooks/debounce.hook';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import heart from '../../resources/img/heart.png';
import favourite from '../../resources/img/favourite.png';
import arrow from '../../resources/img/arrow.png';
import './allChar.scss';

const AllChar = ({getIdSelectChar}) => {
    const [chars, setChars] = useState([]);
    const [originalChars, setOriginalChars] = useState([]);
    const [char, setChar] = useState([]);
    const [term, setTerm] = useState('');
    const [value, setValue] = useState('');
    const [countPage, setCountPage] = useState(2);

    const {getCharacterByName, getCharacterToOffset, loading, error} = useAnimeServices();
    const debounceSearchTerm = useDebounce(term, 500);

    useEffect(()=> {
        if(debounceSearchTerm) {
            getCharacterByName(debounceSearchTerm).then(setChar)
        }
    }, [debounceSearchTerm]);

    useEffect(()=> {
        updateChars();
    }, []);

    const updateChars = (offset) => {
        getCharacterToOffset(offset).then(data => {
            setChars(data);
            setOriginalChars(data);
        });
    }

    useEffect(()=> {
        setChars(filterChars(value, originalChars));
    }, [value]);

    const updateTerm = (e) => {
        setTerm(e.target.value);
    }

    const updateValue = (e) => {
        setValue(e.target.value);
    }

    const addInFavourite = (e) => {
        if(e.target.src === favourite) {
            e.target.src = heart;
        } else {
            e.target.src = favourite;
        }
    }

    const filterChars = (value, data) => {
        let filteredChars = [...data];
        switch(value) {
            case 'popular':
                return filteredChars.sort((a, b) => b.favourites - a.favourites);
            case 'name':
                return filteredChars.sort((a,b) => a.name.full.localeCompare(b.name.full));
            case 'anime':
                return filteredChars.filter(item => item.media?.edges?.[0]?.node?.type === 'ANIME');
            default:
                return chars;
        }
    }

    const nextPage = () => {
        setCountPage(countPage => countPage + 1);
        updateChars(countPage);
    }

    const prevPage = () => {
        if(countPage > 1) {
            setCountPage(countPage => countPage - 1);
        }
        updateChars(countPage);
    }

    const items = chars.map((item) => {
        return (
            <li onClick={()=> getIdSelectChar(item.id)} className='all-char__item' key={item.id}>
                <Link to='/characters/character'><img className='all-char__img' src={item.image.large} alt={item.name.full} /></Link>
                <div className="all-char__info">
                    <div className="all-char__name">{item.name.full}</div>
                    <div className="all-char__favorite">
                        <img onClick={addInFavourite} src={heart} alt="heart" />
                        <div>{item.favourites}</div>
                    </div>
                </div>
            </li>
        )
    });

    const content = char && term.length > 1 && !loading && !error
    ? <View getIdSelectChar={getIdSelectChar} id={char.id} name={char.name} favourites={char.favourites} img={char.img}/> 
    : items;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <>
            <div className="search-container">
                <h2 className="search-title">Персонажі</h2>
                <div className="search-bar">
                    <div className="search-input">
                        <span className="icon">🔍</span>
                        <input onChange={(e) => updateTerm(e)} value={term} type="text" placeholder="Пошук за назвою"/>
                    </div>
                    <select onChange={updateValue} className="btn sort-btn" name="sort" id="sort">
                        <option value=''>Сортування</option>
                        <option value="popular">Популярні</option>
                        <option value="name">За назвою</option>
                    </select>
                    <select onChange={updateValue} className="btn filter-btn" name="filter" id="filter">
                        <option value="">Фільтр</option>
                        <option value="anime">Аніме</option>
                    </select>
                </div>
            </div>
            {spinner}
            {errorMessage}
            <ul className="all-char">
                {content}
            </ul>
            <div className="all-char__navigation">
                <img onClick={prevPage} style={{'transform': 'rotate(180deg)'}} src={arrow} alt="arrow" />
                <div className='all-char__page'>
                    <div tabIndex={0} onClick={(e)=> updateChars(e.target.textContent)}>1</div>
                    <div tabIndex={0} onClick={(e)=> updateChars(e.target.textContent)}>2</div>
                    <div tabIndex={0} onClick={(e)=> updateChars(e.target.textContent)}>3</div>
                    <div tabIndex={0} onClick={(e)=> updateChars(e.target.textContent)}>4</div>
                    <div style={{'cursor': 'not-allowed'}}>...</div>
                    <div tabIndex={0} onClick={(e)=> updateChars(e.target.textContent)}>500</div>
                </div>
                <img onClick={nextPage} src={arrow} alt="arrow" />
            </div>
        </>
    )
}

const View = ({id, name, img, favourites, getIdSelectChar}) => {
    return (
        <li onClick={()=> getIdSelectChar(id)} className='all-char__item' key={id}>
            <Link to="/characters/character"><img className='all-char__img' src={img} alt={name} /></Link>
            <div className="all-char__info">
                <div className="all-char__name">{name}</div>
                <div className="all-char__favorite">
                    <img src={heart} alt="heart" />
                    <div>{favourites}</div>
                </div>
            </div>
        </li>
    )
}

export default AllChar;