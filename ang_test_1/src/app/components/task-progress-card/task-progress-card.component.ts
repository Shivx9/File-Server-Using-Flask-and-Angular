import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-progress-card',
  templateUrl: './task-progress-card.component.html',
  styleUrls: ['./task-progress-card.component.css']
})
export class TaskProgressCardComponent {
  
  @Input() task!:{'name':string,'id':string}
  @Output() onTaskCancel = new EventEmitter<string>
  isHoverTarget = false



  cancelTask(){
    this.onTaskCancel.emit(this.task.id)
  }

}
