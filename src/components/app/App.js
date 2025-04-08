import { useState, createContext, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppHeader from "../appHeader/AppHeader";
import AppFooter from "../appFooter/AppFooter";
import SingleComic from "../pages/SingleComic";

import Spinner from "../spinner/Spinner";

export const ThemContext = createContext();

const MainPage = lazy(()=> import('../pages/MainPage'));
const CharactersPage = lazy(()=> import('../pages/CharactersPage'));
const AnimePage = lazy(()=> import('../pages/AnimePage'));
const SingleAnimePage = lazy(()=> import('../pages/SingleAnimePage'));



const App = () => {
    const [them, setThem] = useState(false);
    const [charId, setCharId] = useState(null);

    return (
        <Router>
            <div style={{ background: them ? '#0A0A0A' : '#f2f2f3' }} className="wrapper">
                <div className="app">
                    <Suspense fallback={<Spinner/>}>
                        <AppHeader getThem={setThem} />
                        <main>
                            <ThemContext.Provider value={ them }>
                                <Routes>
                                    <Route path="/" element={<MainPage getIdSelectChar={setCharId} them={them} />} />
                                    <Route path="/characters" element={<CharactersPage getIdSelectChar={setCharId} charId={charId} />} />
                                    <Route path="/characters/character" element={<SingleComic charId={charId} />} />
                                    <Route path="/anime" element={<AnimePage getIdSelectChar={setCharId} />} />
                                    <Route path="/anime/singleanime" element={<SingleAnimePage charId={charId} />} />
                                </Routes>
                            </ThemContext.Provider>
                        </main>
                        <AppFooter />
                    </Suspense>
                </div>
            </div>
        </Router>
    );
};

export default App;
