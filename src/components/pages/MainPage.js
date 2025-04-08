import CharsSlider from "../charsSlider/CharsSlider";
import RandomChar from "../randomChar/RandomChar";
import TopAnime from "../topAnime/TopAnime";

const MainPage = ({getIdSelectChar}) => {

    return (
        <>
            <TopAnime/>
            <CharsSlider/>
            <RandomChar getIdSelectChar={getIdSelectChar}/>
        </>
    )
}

export default MainPage;