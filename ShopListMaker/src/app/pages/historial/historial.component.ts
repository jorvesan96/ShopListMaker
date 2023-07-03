import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];

  constructor(private location: Location) {}

  ngOnInit() {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      db.collection('usuarios').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const data: any = doc.data();
          this.historial = data?.historial;
        }
      }).catch((error) => {
        console.error('Error al obtener el historial:', error);
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
