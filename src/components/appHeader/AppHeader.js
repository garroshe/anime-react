import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import moon from '../../resources/img/moon.png';
import sun from '../../resources/img/sun.png';

import './appHeader.scss';

const AppHeader = (props) => {

    const {getThem} = props;

    const [theme, setThem] = useState(true);

    useEffect(()=> {
        getThem(theme);
    }, [theme]);

    return (
        <header className="app__header">
            <div className='app__logo'>ANIME</div>
            <nav className="app__menu">
                <ul>
                    <li><NavLink style={({isActive}) => ({'color': isActive ? '#a855f7' : 'inherit'})} end to="/">Головна</NavLink></li>
                    <li><NavLink style={({isActive}) => ({'color': isActive ? '#a855f7' : 'inherit'})} to="/characters">Персонажі</NavLink></li>
                    <li><NavLink style={({isActive}) => ({'color': isActive ? '#a855f7' : 'inherit'})} to="/anime">Аніме</NavLink></li>
                    <li><NavLink style={({isActive}) => ({'color': isActive ? '#a855f7' : 'inherit'})} to="/manga">Манга</NavLink></li>
                </ul>
            </nav>
            <img onClick={() => setThem(theme => !theme)} src={theme ? moon : sun} alt="theme" />
        </header>
    )
}

export default AppHeader;