export interface Facultad {
  id: number;
  nombre: string;
  facultad: string; // Añadido
  campus: string;   // Añadido
}

export interface EscuelaProfesional {
  id: number;
  nombre: string;
  carrera: string;
  facultades: Facultad; // Cambiado de 'string' a 'Facultad'
}

export interface IPersona {
  id?: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  dni: string;
  telefono?: string;
  especialidad?: string; // Añadido para tutores
}

export interface IPersonaCreate {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  dni: string;
  telefono: string;
  direccion: string;
  nacionalidad: string;
  sexo: string;
}

export interface IPersonaData {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  dni: string;
  telefono: string;
}

export interface ITutor {
  id?: number;
  personas: IPersona;
  escuelaProfesional: EscuelaProfesional;
}

export interface IEscuela {
  id: number;
  nombre: string;
}

export interface IUsuarioTemp {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  dni: string;
  rol: string;
  escuela?: string;
  semestre?: string;
  especialidad?: string;
}

export interface IRegistro {
  nombre: string;
  apellido: string;
  correo: string;
  dni: string;
  rol: string;
}

export interface IPracticanteData {
  id?: number;
  personas: IPersona;
  escuelaProfesional: EscuelaProfesional;
  semestre: string;
}

export interface ILinea {
  id: number;
  nombre: string;
  estado: string;
  nota_max: string;
}

export interface IPracticanteCreate {
  username: string;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  dni: string;
  telefono: string;
  direccion: string;
  sexo: string;
  nacionalidad: string;
  codigo: string;
  añoEstudio: string;
  escuelaId: number;
  lineaId: number;
}

export interface IPracticante {
  id?: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  dni: string;
  telefono: string;
  direccion: string;
  sexo: string;
  nacionalidad: string;
  codigo: string;
  añoEstudio: string;
  escuelaId: number;
  lineaId: number;
  username?: string; // Ahora es opcional
}
