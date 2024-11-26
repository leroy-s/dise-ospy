
import { Programacion } from "../programacion/programacion.module";
import { Tipo } from "../tipo/tipo.module";

export class Rubros{ 
id:number;
nota:number;
programacion:Programacion;
tipos:Tipo;
constructor(id:number=0,
  nota:number=0,
  programacion:Programacion=new Programacion() ,
  tipos:Tipo=new Tipo()
){
this.id=id;
this.nota=nota;
this.programacion=programacion;
this.tipos=tipos;
  }
}
