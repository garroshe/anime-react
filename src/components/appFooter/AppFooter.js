import { NavLink } from 'react-router-dom';
import github from '../../resources/img/github.png';
import linkedin from '../../resources/img/linkedin.png';
import youtube from '../../resources/img/youtube.png';

import './appFooter.scss';

const AppFooter = () => {

    return (
        <footer className="footer">
            <div className="footer__top">
                <div className='app__logo footer__logo'>ANIME</div>
                <nav className="app__menu footer__menu">
                    <ul>
                        <li><NavLink end style={({isActive}) => ({'color': isActive ? '#a855f7' : '#bfbfbf'})} to="/">Головна</NavLink></li>
                        <li><NavLink style={({isActive}) => ({'color': isActive ? '#a855f7' : '#bfbfbf'})} to="/characters">Персонажі</NavLink></li>
                        <li><NavLink style={({isActive}) => ({'color': isActive ? '#a855f7' : '#bfbfbf'})} to="/anime">Аніме</NavLink></li>
                        <li><NavLink style={({isActive}) => ({'color': isActive ? '#a855f7' : '#bfbfbf'})} to="/manga">Манга</NavLink></li>
                    </ul>
                </nav>
                <ul className="footer__social">
                    <li className='footer__icon linkedin'>
                        <span className='footer__tooltip'>Linkedin</span>
                        <a href="https://shorturl.at/gPoxT"><img className='footer__fab' src={linkedin} alt="linkedin"/></a>
                    </li>
                    <li className='footer__icon github'>
                        <span className='footer__tooltip'>Github</span>
                        <a href="https://github.com/garroshe"><img className='footer__fab' src={github} alt="github"/></a>
                    </li>
                    <li className='footer__icon youtube'>
                        <span className='footer__tooltip'>Youtube</span>
                        <img className='footer__fab' src={youtube} alt="youtube"/>
                    </li>
                </ul>
            </div>
            <div className="footer__bottom">
                <div>© 2025 ANIME. Усі права захищено. </div>
            </div>
        </footer>
    )
}

export default AppFooter;