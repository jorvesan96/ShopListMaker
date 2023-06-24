import { Component } from '@angular/core';

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
    // Aquí puedes implementar la lógica para guardar los datos del perfil

    this.editMode = false;
    this.perfil.password = '';
  }
}
