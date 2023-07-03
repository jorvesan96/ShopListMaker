import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AccesoComponent } from './pages/acceso/acceso.component';
import { ListaCompraComponent } from './pages/lista-compra/lista-compra.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './interfaces/product/product.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HttpClientModule } from '@angular/common/http';
import { HistorialComponent } from './pages/historial/historial.component';
import { FiltroService } from 'src/app/services/filtro.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistroComponent,
    PerfilComponent,
    AccesoComponent,
    ListaCompraComponent,
    ProductosComponent,
    HeaderComponent,
    FooterComponent,
    ProductComponent,
    HistorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [FiltroService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Hacer que CryptoJS esté disponible globalmente
    (window as any).CryptoJS = CryptoJS;
  }
 }
