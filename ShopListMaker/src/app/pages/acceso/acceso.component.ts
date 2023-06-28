import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.css']
})
export class AccesoComponent {


  constructor(private router: Router, private authService: AuthService) { }


  correo: string | undefined;
  canLogin: boolean = true;

  loginForm = new FormGroup({
    correo: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    contraseña: new FormControl('', Validators.compose([
      Validators.minLength(5),
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ])),
  });

  get f() {
    return this.loginForm.controls;
  }

  encryptPassword(password: string): string {
    const encryptedPassword = SHA256(password).toString();
    return encryptedPassword;
  }

  login(loginForm: any): any {

    const usuario = {
      Correo: loginForm.value.correo,
      Contraseña: loginForm.value.contraseña
    }

    this.authService.signInWithEmail(usuario.Correo, this.encryptPassword(usuario.Contraseña))
      .then(() => {
        console.log("Autenticado con exito")
        this.router.navigate(["/"]);
      })
      .catch((error) => {
        this.canLogin = false;
        console.log("Fallo al autenticar")
        return false;
      });
  }
}
