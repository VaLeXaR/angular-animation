import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {TodoModel} from '../todo.model';

@Component({
  selector: 'aa-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('stateAnimation', [
      state('incomplete', style({
        color: 'black',
        'text-decoration': 'none'
      })),
      state('complete', style({
        color: '#d9d9d9',
        'text-decoration': 'line-through'
      })),
      transition('incomplete => complete', [
        style({
          'text-decoration': 'line-through'
        }),
        animate('0.2s')
      ]),
      transition('complete => incomplete', [
        style({
          'text-decoration': 'none'
        }),
        animate('0.2s')
      ])
    ])
  ]
})
export class TodoItemComponent {

  @Input() todo: TodoModel;

  @Output() itemModified = new EventEmitter();

  @Output() itemRemoved = new EventEmitter();

  editing = false;

  @HostBinding('@stateAnimation') get state() {
    return this.todo.completed ? 'complete' : 'incomplete';
  }

  edit() {
    this.editing = true;
  }

  cancelEditing() {
    this.editing = false;
  }

  stopEditing(editedTitle) {
    if (this.editing) {
      this.editing = false;
      this.todo.setTitle(editedTitle.value);
      if (this.todo.title.length === 0) {
        this.remove();
      } else {
        this.update();
      }
    }
  }

  toggleCompletion() {
    this.todo.completed = !this.todo.completed;
    this.update();
  }

  remove() {
    this.itemRemoved.emit(this.todo.id);
  }

  update() {
    this.itemModified.emit(this.todo);
  }
}
