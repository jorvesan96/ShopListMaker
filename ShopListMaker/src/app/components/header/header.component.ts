import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isLogged: boolean = false;

  constructor(private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.isLogged = !!user;
    });

  }

  cerrarSesion() {
    this.afAuth.signOut()
    .then(() => {
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });  }

  }
