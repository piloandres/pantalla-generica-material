import { Propiedad } from './Propiedad';
import { PropiedadGlobal } from './PropiedadGlobal';

export class Documento{
    idDocumento: string;
    taxonomia: string;
    propiedades: PropiedadGlobal;
    mimeType: string;
}