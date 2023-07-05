import Card from "../Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllPokemons } from "../../Redux/actions";
import { fetchAllPokemons } from "./utils/fetchAllPokemons";
import style from "./CardsContainer.module.css";
import Filters from "../Filters/Filter";
import { onSearch } from "./utils/SearchPokemons/onSearch";

const CardsContainer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllPokemons(dispatch, getAllPokemons); // Cuando se monta el componente pido una peticion a la api y hago dispatch a redux
  }, []);

  //ESTADOS Y VARIABLES DEL PAGINADO
  const allPokemons = useSelector(({ allPokemons }) => allPokemons); //Accedo al estado global de Redux y me lo traigo
  const totalPages = Math.ceil(allPokemons.length / 12); //Divido para saber cuantas pages serian en total | Debo mostrar 12 por pagina
  const [next, setNext] = useState(12); //Estado local para utilizar en el slice | PAGINADO
  const [prev, setPrev] = useState(0); //Estado local para utilizar en el slice | PAGINADO
  const [page, setPage] = useState(1); // Pagina actual en la que me encontraria | PAGINADO
  let pokemonsSliced = allPokemons.slice(prev, next); // Voy trayendo de a 12 pokemones del estado global

  //ESTADOS DE POKEMONS POR BUSQUEDA
  const [pokemonsSearch, setPokemonsSearch] = useState([]); // Estado local para guardar el personaje encontrado en la busqueda
  const [name, setName] = useState(""); // estado para guardar lo que pongo en el input
  const [errorSearch, setErrorSearch] = useState()
  const totalPagesSearched = Math.ceil(pokemonsSearch.length / 12)
  const [nextSearched, setNextSearched] = useState(12); //Estado local para utilizar en el slice | PAGINADO
  const [prevSearched, setPrevSearched] = useState(0); //Estado local para utilizar en el slice | PAGINADO
  const [pageSearched, setPageSearched] = useState(1); // Pagina actual en la que me encontraria | PAGINADO
  const pokemonsSlicedSearch = pokemonsSearch.slice(prevSearched,nextSearched)
   const handleChange = (event) => { //funcion para cuando haya un cambio en el input, se vaya actualizando el estado de name
     setName(event.target.value);
   };

   //FUNCIONES DEL PAGINADO
  const handleNext = () => {
    // Funcion para avanzar a la siguiente pag | PAGINADO
    if(pokemonsSearch.length > 0){
      if (pageSearched < totalPagesSearched) {
        setNextSearched(nextSearched + 12);
        setPrevSearched(prevSearched + 12);
        setPageSearched(pageSearched + 1);
      }
    }else{
      if (page < totalPages) {
        setNext(next + 12);
        setPrev(prev + 12);
        setPage(page + 1);
      }
    }
   
  };
  const handlePrev = () => {
    // Funcion para retroceder a la pagina anterior | PAGINADO
    if(pokemonsSearch.length > 0){
      if (prevSearched > 0) {
        setNextSearched(nextSearched - 12);
        setPrevSearched(prevSearched - 12);
        setPageSearched(pageSearched - 1);
      }
    }else{
      if (prev > 0) {
        setNext(next - 12);
        setPrev(prev - 12);
        setPage(page - 1);
      }
    }
    
  };

  const resetPageFilter = () => {
    //Cuando filtro por types o created vuelvo a la pagina 1
    setNext(12);
    setPrev(0);
    setPage(1);
  };
  
  
  return (
    <div className={style.cardsContainer}>

      {/* INPUT DE BUSQUEDA */}
       <div onChange={handleChange} value={name.toLowerCase()}> 
      <input type="search" />
      <button
        onClick={() => {
          onSearch(name, setPokemonsSearch, setErrorSearch); // Funcion para buscar en la api lo que pongo en el input cuando hago click y guarda en pokemonsSearch si encontro un pokemon
        }}
      >
        Search
      </button>
      <h1>{errorSearch}</h1>
    </div>

     {/* FILTRADOS*/}
      <Filters resetPageFilter={resetPageFilter} />

      {/* BUTTONS DEL PAGINADO */}
      {pokemonsSearch.length < 1 ?  <><button onClick={handlePrev}>Prev</button>
      <h3>
        {page} of {totalPages}
      </h3>
      <button onClick={handleNext}>Next</button></> : <><button onClick={handlePrev}>Prev</button>
      <h3>
        {pageSearched} of {totalPagesSearched}
      </h3>
      <button onClick={handleNext}>Next</button></>}
    

      {/* CARDS RENDERIZANDO */}
      <div className={style.cardsContainer}>
        
        {pokemonsSearch.length < 1 ? pokemonsSliced.map(({ image, name, id, types, attack }) => (
          <Card
            image={image}
            name={name}
            key={id}
            types={types}
            attack={attack}
            id={id}
          />
        )): pokemonsSlicedSearch.map(({ image, name, id, types, attack }) => (
          <Card
            image={image}
            name={name}
            key={id}
            types={types}
            attack={attack}
            id={id}
            pokemonsSearch={pokemonsSearch}
            setPokemonsSearch={setPokemonsSearch}
          />
        ))}
      </div>
    </div>
  );
};

export default CardsContainer;