import { Columna } from './Columna';
import { PropiedadSelected } from './PropiedadSelected';

export class Consulta{
    constructor(
        public parametros: Columna[],
        public criterios: PropiedadSelected[]
    ){}
}