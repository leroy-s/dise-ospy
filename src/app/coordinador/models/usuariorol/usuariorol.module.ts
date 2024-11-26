import { Roles } from "../rol/roles.module";
import { Usuario } from "../usuario/usuario.module";

export class UsuarioRol { 
  id:number;
  usuarios:Usuario;
  roles:Roles;
  constructor(id:number=0,usuarios:Usuario=new Usuario(),roles:Roles=new Roles()){
    this.id=id;
    this.usuarios=usuarios;
    this.roles=roles;
  }
}
