import { Component } from '@angular/core';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  perfil = {
    email: '',
    password: '',
    location: ''
  };

  editMode = false;

  activarEdicion() {
    this.editMode = true;
  }

  guardarPerfil() {
      const encryptedPassword = this.encryptPassword(this.perfil.password);
      this.editMode = false;
      this.perfil.password = encryptedPassword;
  }

  encryptPassword(password: string): string {
    const encryptedPassword = SHA256(password).toString();
    return encryptedPassword;
  }
}
