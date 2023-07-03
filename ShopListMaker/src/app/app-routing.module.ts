import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AccesoComponent } from './pages/acceso/acceso.component';
import { ListaCompraComponent } from './pages/lista-compra/lista-compra.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { RegistroComponent } from './pages/registro/registro.component';

const routes: Routes = [{path: "acceso", component:AccesoComponent},
{path: "lista-compra", component:ListaCompraComponent},
{path: "perfil", component:PerfilComponent},
{path: "historial", component:HistorialComponent},
{path: "productos", component:ProductosComponent},
{path: "registro", component:RegistroComponent},
{path: '', component: HomeComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
