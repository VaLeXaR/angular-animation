import {Injectable} from '@angular/core';

import {TodoModel} from './todo.model';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class TodoService {

  private pTodos: BehaviorSubject<TodoModel[]> = new BehaviorSubject<TodoModel[]>([]);
  todos: Observable<TodoModel[]> = this.pTodos.asObservable();

  constructor() {
    const persistedTodos = JSON.parse(localStorage.getItem('todos')) || [];

    const TODOS = persistedTodos.map((todo) => {
      const ret = new TodoModel(todo.title);
      ret.completed = todo.completed;
      ret.id = todo.id;
      return ret;
    });

    this.pTodos.next(TODOS);
  }

  removeCompleted(): void {
    const todos = this.pTodos.getValue();
    const remainingTodos = todos.filter((todo: TodoModel) => {
      return todo.completed === false;
    });
    this.pTodos.next(remainingTodos);
    this.persist();
  }

  setCompletedToAll(completed: boolean): void {
    const todos = this.pTodos.getValue();
    todos.forEach((todo) => todo.completed = completed);
    this.pTodos.next(todos);
    this.persist();
  }

  add(title): void {
    const todos = this.pTodos.getValue();
    todos.push(new TodoModel(title));
    this.pTodos.next(todos);
    this.persist();
  }

  remove(id): void {
    const todos = this.pTodos.getValue();
    const newTodo = todos.filter((t: TodoModel) => {
      return t.id !== id;
    });
    this.pTodos.next(newTodo);
    this.persist();
  }

  update(newTodo: TodoModel): void {
    let newTodos = this.pTodos.getValue();
    newTodos = newTodos.map((todo: TodoModel) => {
      if (newTodo.id === todo.id) {
        return newTodo;
      }

      return todo;
    });

    this.pTodos.next(newTodos);
    this.persist();
  }

  private persist(): void {
    const todos = this.pTodos.getValue();
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}
