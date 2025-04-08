import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import useAnimeServices from "../services/AnimeServices";

import { useDebounce } from "../../hooks/debounce.hook";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import next from '../../resources/img/next.png';

import './allAnime.scss';

const AllAnime = ({getIdSelectChar}) => {

    const [term, setTerm] = useState('');
    const [anime, setAnime] = useState([]);
    const [oneAnime, setOneAnime] = useState([]);
    const [value, setValue] = useState('');
    const [toggle, setToggle] = useState(false);
    const [page,setPage] = useState(2);
    const [filters, setFilters] = useState({
        episodes: { from: "", to: "" },
        scores: { from: "", to: "" },
        rating: { from: "", to: "" },
        type: { tv: false, movie: false, ova: false },
    });

    const debounceSearchTerm = useDebounce(term, 500);
    const {loading, error, getAnimeToOffset, getAnimeByName} = useAnimeServices();

    useEffect(()=> {
        if(debounceSearchTerm) {
            getAnimeByName(debounceSearchTerm).then(setOneAnime);
        }
    }, [debounceSearchTerm]);

    useEffect(()=> {
        updateAnime();
    }, [])

    useEffect(()=> {
        setAnime(filterAnime(value, anime));
    }, [value]);

    const updateTerm = (e) => {
        setTerm(e.target.value);    
    }

    const updateValue = (e) => {
        setValue(e.target.value);
    }

    const updateAnime = () => {
        getAnimeToOffset().then((newAnime) => {
            setAnime((prevAnime => [...prevAnime, ...newAnime]));
        });
    }

    const filterAnime = (value, data) => {
        let filteredAnime = [...data];
        switch(value) {
            case 'popular':
                return filteredAnime.sort((a,b) => b.popularity - a.popularity);
            case 'name':
                return filteredAnime.sort((a, b) => {
                    const titleA = a.title.english || '';
                    const titleB = b.title.english || '';
                    return titleA.localeCompare(titleB);
                });
            case 'episodes':
                return filteredAnime.sort((a,b) => b.episodes - a.episodes);
            default: return anime;
        }
    }

    const handleApplyFilters = (filters) => {
        let filteredAnime = [...anime];
        filteredAnime = filteredAnime.filter(item => item.episodes > filters.episodes.from && item.episodes < filters.episodes.to);
        // filteredAnime = filteredAnime.filter(item => item.popularity > filters.scores.from && item.popularity < filters.scores.to);

        return filteredAnime;
    }

    const handleChange = (category, key, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: { ...prev[category], [key]: value }
        }));
    };

    const handleCheckbox = (key) => {
        setFilters(prev => ({
            ...prev,
            type: { ...prev.type, [key]: !prev.type[key] }
        }));
    };

    const resetFilters = () => {
        setFilters({
            episodes: { from: "", to: "" },
            scores: { from: "", to: "" },
            rating: { from: "", to: "" },
            type: { tv: false, movie: false, ova: false },
        });
        updateAnime();
    };

    const applyFilters = () => {
        setAnime(handleApplyFilters(filters));
    };

    const items = anime.map(item => {
        return (
            <li key={item.id}>
                <Link to='/anime/singleanime'><img src={item.coverImage.large} alt={item.title.english} /></Link>
                <div style={{'height': '60px', 'background': ' #1c1c1c', 'padding': '5px 0 0 5px'}}>
                    <div className="all-anime__title">{item.title.english ? item.title.english : item.title.romaji}</div>
                    <div className="all-anime__format">{item.format}</div>
                </div>
            </li>
        )
    });

    const oneAnimeItems = oneAnime.map(item => {
        return (
            <li onClick={() => getIdSelectChar(item.id)} key={item.id}>
                <img src={item.coverImage.large} alt={item.title.english} />
                <div style={{'height': '60px', 'background': ' #1c1c1c', 'padding': '5px 0 0 5px'}}>
                    <div className="all-anime__title">{item.title.english ? item.title.english : item.title.romaji}</div>
                    <div className="all-anime__format">{item.format}</div>
                </div>
            </li>
        )
    });

    const spinner = loading && !error ? <Spinner/> : null;
    const errorMessage = error && !loading ? <ErrorMessage/> : null;
    const content = oneAnime && term.length > 1 && !loading && !error
    ? <View oneAnimeItems={oneAnimeItems}/> 
    : items;

    return (
        <div className="all-anime__wrapper">
            <div className="all-anime__container">
                <div className="search-container">
                    <h2 className="search-title">Аніме</h2>
                    <div className="search-bar">
                        <div className="search-input">
                            <span className="icon">🔍</span>
                            <input onChange={(e) => updateTerm(e)} value={term} type="text" placeholder="Пошук за назвою"/>
                        </div>
                        <select onChange={(e) => updateValue(e)} className="btn sort-btn" name="sort" id="sort">
                            <option value=''>Сортування за</option>
                            <option value="popular">Популярністю</option>
                            <option value="name">Назвою</option>
                            <option value="episodes">Кількістю епізодів</option>
                        </select>
                    </div>
                </div>
                {spinner}
                {errorMessage}
                <ul className="all-anime__grid">
                    {content}
                </ul>
            </div>
            {!toggle ? <Filter handleCheckbox={handleCheckbox} applyFilters={applyFilters} resetFilters={resetFilters} handleChange={handleChange} filters={filters} next={next} setToggle={setToggle}/> : <Genre setToggle={setToggle} next={next}/>}
        </div>
    )
}

const View = ({oneAnimeItems}) => {
    return (
        <ul className="all-anime__grid">
            {oneAnimeItems}
        </ul>
    )
}

const Filter = ({next, setToggle, handleChange, filters, resetFilters, applyFilters, handleCheckbox}) => {
    return (
        <div className="all-anime__filter">
            <div onClick={()=> setToggle(true)} className="all-anime__zhanr">
                <div className="all-anime__filter-select">Жанри</div>
                <div className="all-anime__filter-value">будь-які <img src={next} alt="next" /></div>
            </div>
            <div className="all-anime__filter-title">Кількість епізодів</div>
            <div className="all-anime__filter-inputs">
                <input
                    type="number"
                    placeholder="Від"
                    value={filters.episodes.from}
                    onChange={(e) => handleChange("episodes", "from", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="До"
                    value={filters.episodes.to}
                    onChange={(e) => handleChange("episodes", "to", e.target.value)}
                />
            </div>

            <div className="all-anime__filter-title">Кількість оцінок</div>
            <div className="all-anime__filter-inputs">
                <input
                    type="number"
                    placeholder="Від"
                    value={filters.scores.from}
                    onChange={(e) => handleChange("scores", "from", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="До"
                    value={filters.scores.to}
                    onChange={(e) => handleChange("scores", "to", e.target.value)}
                />
            </div>

            <div className="all-anime__filter-title">Рейтинг</div>
            <div className="all-anime__filter-inputs">
                <input
                    type="number"
                    placeholder="Від"
                    value={filters.rating.from}
                    onChange={(e) => handleChange("rating", "from", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="До"
                    value={filters.rating.to}
                    onChange={(e) => handleChange("rating", "to", e.target.value)}
                />
            </div>

            <div className="all-anime__filter-title">Тип</div>
            <div className="all-anime__filter-inputs">
                <label htmlFor="tv">
                    TV серіали
                    <input
                        type="checkbox"
                        id="tv"
                        checked={filters.type.tv}
                        onChange={() => handleCheckbox("tv")}
                    />
                </label>
                <label htmlFor="movie">
                    Фільми
                    <input
                        type="checkbox"
                        id="movie"
                        checked={filters.type.movie}
                        onChange={() => handleCheckbox("movie")}
                    />
                </label>
                <label htmlFor="ova">
                    OVA
                    <input
                        type="checkbox"
                        id="ova"
                        checked={filters.type.ova}
                        onChange={() => handleCheckbox("ova")}
                    />
                </label>
            </div>

            <div className="all-anime__filter-btns">
                <button className="all-anime__filter-reset" onClick={resetFilters}>
                    Скинути
                </button>
                <button className="all-anime__filter-save" onClick={applyFilters}>
                    Застосувати
                </button>
            </div>
        </div>
    )
}

const Genre = ({next, setToggle}) => {
    return (
        <div style={{'paddingTop': '20px'}} className="all-anime__filter">
            <div style={{'display': 'flex', 'gap': '5px', 'margin': '0 0 10px 0', 'cursor': 'pointer'}} onClick={()=> setToggle(false)}>
                <img style={{'transform': 'rotate(180deg)'}} src={next} alt="next" />
                <div style={{'color': '#BFBFBF', 'fontSize': '14px', 'fontWeight': '700'}}>Назад до жанрів</div>
            </div>
            <hr />
            <div style={{'color': '#EBEBF580', 'fontSize': '14px', 'lineHeight': '20px', 'margin': '10px 0'}}>Фільтр за жанрами</div>
            <hr />
            <div className="all-anime__filter-genre">
                <label htmlFor="action">Екшен<input type="checkbox" id="action"/></label>
                <label htmlFor="adventure">Пригоди <input type="checkbox" id="adventure"/></label>
                <label htmlFor="drama">Драма <input type="checkbox" id="drama"/></label>
                <label htmlFor="sci-fi">Фантастика <input type="checkbox" id="sci-fi"/></label>
            </div>
        </div>
    )
}

export default AllAnime;