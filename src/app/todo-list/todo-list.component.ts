import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {map} from 'rxjs/operators';

import {TodoService} from '../todo.service';
import {TodoModel} from '../todo.model';
import {combineLatest} from 'rxjs';


@Component({
  selector: 'aa-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {

  disableAnimation = true;
  todos: TodoModel[] = [];

  private lastStatus: string;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    combineLatest(
      this.route.data.pipe(map(params => params.status)),
      this.todoService.todos
    ).subscribe(([status, todos]) => {
      if (this.lastStatus !== status) {
        this.disableAnimation = true;
      }
      this.lastStatus = status;

      if (status === 'completed') {
        this.todos = todos.filter((todo: TodoModel) => {
          return todo.completed === true;
        });
      } else if (status === 'active') {
        this.todos = todos.filter((todo: TodoModel) => {
          return todo.completed === false;
        });
      } else {
        this.todos = todos;
      }
    });
  }

  hasCompleted(): boolean {
    const completed = this.todos.filter((todo: TodoModel) => {
      return todo.completed === true;
    });

    return completed.length !== 0;
  }

  setAllTo(completed: any): void {
    this.todoService.setCompletedToAll(completed.checked);
  }

  remove(id: string): void {
    this.todoService.remove(id);
  }

  update(todo: TodoModel): void {
    this.todoService.update(todo);
  }

  trackById(index, item): number {
    return item.id;
  }
}
