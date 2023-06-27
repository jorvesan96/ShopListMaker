import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registroForm: FormGroup = new FormGroup({});
  personal_step = false;
  address_step = false;
  step = 0;

  constructor(private router: Router, private formBuilder: FormBuilder,  private authService: AuthService) { }

  ngOnInit() {
  this.registroForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    repetirCorreo: ['', [Validators.required, Validators.email, validarEmailIgual()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repetirContrasena: ['', [Validators.required, Validators.minLength(6), validarContrasenaIgual()]],
    ciudad: ['', Validators.required],
    direccion: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]]
  });
}

  get f() {
    return this.registroForm.controls;
  }

  next(){
    this.step=1;
    document.getElementById("myProgressBar")!.style.width = "50%";
  }

  previous(){
    this.step=0;
    document.getElementById("myProgressBar")!.style.width = "0%";
  }

  enviarRegistro(registroForm: any) {
   this.step=2;
   document.getElementById("myProgressBar")!.style.width = "100%";
          this.authService.createUserWIthEmail(registroForm.value.email, registroForm.value.password)
      .then(() => {
        console.log("Usuario creado:")
        this.createUser();
      })
      .catch(() => {
        console.log("No se ha podido crear el usuario")
      });

      delete registroForm.value.repetirCorreo;
      delete registroForm.value.repetirContrasena;


  }
  createUser() {

    const auth = firebase.auth();
    let userID !: string;
    const db = firebase.firestore();

    auth.onAuthStateChanged((user) => {
      if (user) {
        userID = user.uid;

        const usuariosRef = db.collection('usuarios').doc(userID);
        usuariosRef.set(this.registroForm.value)
          .then(() => {
            console.log("Usuario añadido");
          })
          .catch((error) => {
            console.error("Error al añadir al usuario:", error);
          })
          .catch(() => {
            console.log("No se ha podido añadir al usuario");
          });
      }
    });
  }
}
function validarEmailIgual(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.parent?.get('email');
    const repetirCorreo = control.parent?.get('repetirCorreo');
    if (email?.value !== repetirCorreo?.value) {
      return { emailNoIguales: true };
    }
    return null;
  };
}


function validarContrasenaIgual(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.parent?.get('password');
    const repetirContrasena = control.parent?.get('repetirContrasena');
    if (password?.value !== repetirContrasena?.value) {
      return { contrasenaNoIguales: true };
    }
    return null;
  };

}
