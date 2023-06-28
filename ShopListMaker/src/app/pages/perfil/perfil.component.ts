import { Component } from '@angular/core';
import { SHA256 } from 'crypto-js';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/services/usuario';
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';

interface UsuarioData {
  ciudad: string;
  direccion: string;
  postalCode: number;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    const user = firebase.auth().currentUser;
    if (user) {
      this.usuario.email = user.email || '';
      this.retrieveUserData(user.uid);
    }
  }

  usuario: Usuario = {
    email: '',
    password: '',
    ciudad: '',
    direccion: '',
    postalCode: 0
  };

  editMode = false;

  activarEdicion() {
    this.editMode = true;
  }

  guardarPerfil() {

      const user = firebase.auth().currentUser;
      const encryptedPassword = this.encryptPassword(this.usuario.password);
      this.editMode = false;
      this.usuario.password = encryptedPassword;

      if(user){
        this.firestore.collection('usuarios').doc(user.uid).update(this.usuario)
        .then(() => {
          console.log('Perfil actualizado correctamente.');
        })
        .catch(error => {
          console.error('Error al actualizar el perfil:', error);
        });
          user.updatePassword(this.usuario.password)
            .then(() => {
              console.log("Contraseña actualizada correctamente");
              user.updateEmail(this.usuario.email)
                .then(() => {

                  console.log("Información de inicio de sesión actualizada correctamente");
                })
                .catch(function(error) {
                  console.error("Error al actualizar el correo electrónico:", error);
                });
            })
            .catch(function(error) {
              console.error("Error al actualizar la contraseña:", error);
            });
      }else {
        console.error('No se ha encontrado ningún usuario autenticado.');
      }

  }

  encryptPassword(password: string): string {
    const encryptedPassword = SHA256(password).toString();
    return encryptedPassword;
  }

  retrieveUserData(userId: string) {
    this.firestore.collection('usuarios').doc(userId).get()
      .toPromise()
      .then((snapshot) => {
        if (snapshot && snapshot.exists) {
          const data = snapshot.data() as UsuarioData;
          if (data) {
            this.usuario.ciudad = data.ciudad || '';
            this.usuario.direccion = data.direccion || '';
            this.usuario.postalCode = data.postalCode || 0;
          }
          this.encryptPassword(this.usuario.password);
        }
      })
      .catch(error => {
        console.error('Error al recuperar los datos del usuario:', error);
      });
  }
}
