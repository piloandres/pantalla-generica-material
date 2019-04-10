import { Columna } from './Columna';

export class Consulta{
    constructor(
        public parametros: Columna[],
        public queryUrl: string
    ){}
}