import {ChangeDetectionStrategy, Component, ElementRef, ViewChild} from '@angular/core';

import {TodoService} from '../todo.service';

@Component({
  selector: 'aa-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoHeaderComponent {

  @ViewChild('newTodo') newTodoEl: ElementRef;

  constructor(
    private todoService: TodoService
  ) { }

  addTodo(title: string): void {
    this.todoService.add(title);
    this.newTodoEl.nativeElement.value = '';
  }
}
