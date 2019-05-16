import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TodoListComponent} from './todo-list/todo-list.component';

const routes: Routes = [
  { path: '', component: TodoListComponent, pathMatch: 'full' },
  { path: 'active', component: TodoListComponent, data: { status: 'active' } },
  { path: 'completed', component: TodoListComponent, data: { status: 'completed' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
