import spinner from '../../resources/img/spinners.gif';

const Spinner = () => {
    return (
        <img style={{display: 'block', margin: '0 auto', background: 'none', width: '250px'}} src={spinner} alt="Loading..." />
    )
}

export default Spinner;