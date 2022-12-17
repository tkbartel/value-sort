import { ValueTransformer } from '@angular/compiler/src/util';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'value-sort';
  all_values = ["a", "b", "c", "d"];
  left_choice = "a";
  right_choice = "b";

  //TODO: convert al_values to a list of lists
  sorted_lists = [["a"], ["b"], ["c"], ["d"]];

  current_merge: string[] = [];


  //TODO: How do I call shiftLists at component creation?
  left_list = this.sorted_lists[0];
  right_list = this.sorted_lists[1];
  left_index = 0;
  right_index = 0;


  onInit(): void {
    this.shiftLists();
  }
  


  // choices: string[] = [];

  shiftLists(): void {
    this.left_index = 0;
    this.left_list = this.sorted_lists[0];
    this.sorted_lists.shift();
    this.right_index = 0;
    this.right_list = this.sorted_lists[0];
    this.sorted_lists.shift();
    this.sorted_lists.push(this.current_merge.slice())
    this.current_merge = [];
  }

  onSelect(side: string): void {
    // this.choices.push(side);
    // console.log(this.choices);

    if (side == "L") {
      this.current_merge.push(this.left_list[this.left_index])
      this.left_index += 1;
    } else {
      this.current_merge.push(this.right_list[this.right_index])
      this.right_index += 1;
    }
    
    if(this.left_index >= this.left_list.length) {
      console.log("left shift")
      this.current_merge = this.current_merge.concat(this.right_list.slice(this.right_index, this.right_list.length));
      console.log(this.current_merge)
      this.shiftLists();
    } else if (this.right_index >= this.right_list.length) {
      this.current_merge = this.current_merge.concat(this.left_list.slice(this.left_index, this.left_list.length));
      console.log(this.current_merge)
      this.shiftLists();
    }

    if (this.sorted_lists.length == 1) {
      console.log("all done!!!")
    }
  }
}
