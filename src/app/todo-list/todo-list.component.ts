import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {animateChild, query, transition, trigger, useAnimation} from '@angular/animations';

import {map} from 'rxjs/operators';

import {TodoService} from '../todo.service';
import {TodoModel} from '../todo.model';
import {enterAnimation, leaveAnimation} from './todo.animations';
import {combineLatest} from 'rxjs';


@Component({
  selector: 'aa-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  animations: [
    trigger('todoList', [
      transition(':enter, :leave', [
        query('@*', animateChild())
      ])
    ]),
    trigger('todoItem', [
      transition(':enter', [
        useAnimation(enterAnimation)
      ]),
      transition(':leave', [
        useAnimation(leaveAnimation)
      ])
    ])
  ]
})
export class TodoListComponent implements OnInit {

  public loaded = false;

  public percentageValue = 0;

  public disableAnimation = false;

  private todos: TodoModel[] = [];

  private lastStatus: string;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    combineLatest(
      this.route.data.pipe(map(params => params.status)),
      this.todoService.todos
    )
    .subscribe(([status, todos]) => {
      if (this.lastStatus !== status) {
        this.loaded = false;
        this.percentageValue = 0;
      } else {
        if (this.lastStatus !== status) {
          this.disableAnimation = true;
        }

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

        if (this.lastStatus !== status) {
          setTimeout(() => {
            this.disableAnimation = false;
          }, 0);
        }
      }

      const interval = setInterval(() => {
        if (this.percentageValue >= 100) {
          this.loaded = true;
          clearInterval(interval);

          if (this.lastStatus !== status || !status) {
            this.disableAnimation = true;
          }

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

          if (this.lastStatus !== status || !status) {
            setTimeout(() => {
              this.disableAnimation = false;
            }, 0);
          }

          this.lastStatus = status;
        } else {
          this.percentageValue = this.percentageValue + 20;
        }
      }, 777);
    });
  }

  public hasCompleted(): boolean {
    const completed = this.todos.filter((todo: TodoModel) => {
      return todo.completed === true;
    });

    return completed.length !== 0;
  }

  public setAllTo(completed: any): void {
    this.todoService.setCompletedToAll(completed.checked);
  }

  public remove(id: string): void {
    this.todoService.remove(id);
  }

  public update(todo: TodoModel): void {
    this.todoService.update(todo);
  }

  public trackById(index, item): number {
    return item.id;
  }

}
