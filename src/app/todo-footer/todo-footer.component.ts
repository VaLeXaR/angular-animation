import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {map} from 'rxjs/operators';

import {TodoModel} from '../todo.model';
import {TodoService} from '../todo.service';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'aa-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {

  todos: TodoModel[] = [];
  currentStatus: any;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    combineLatest(
      this.route.data.pipe(map(params => params.status)),
      this.todoService.todos
    ).subscribe(([status, todos]) => {
      this.currentStatus = status || '';
      this.todos = todos;
    });
  }

  getRemainingCount(): number {
    return this.todos.filter((todo: TodoModel) => {
      return todo.completed === false;
    }).length;
  }

  hasCompleted(): boolean {
    return this.todos.filter((todo: TodoModel) => {
      return todo.completed === true;
    }).length !== 0;
  }

  removeCompleted(): void {
    this.todoService.removeCompleted();
  }

}
