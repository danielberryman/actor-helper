import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacialRecognitionComponent } from './facial-recognition/facial-recognition.component';


const routes: Routes = [
  { path: 'faces', component: FacialRecognitionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
