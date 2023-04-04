import { ValueTransformer } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'value-sort';

  // Sub-lists in which all elements are sorted.
  sorted_lists: string[][] = [];

  // The sorted list resulting from merging the left and right lists.
  current_merge: string[] = [];

  // Left and right lists which are currently being merged.
  left_list: string[] = [];
  right_list: string[] = [];
  left_index: number = 0;
  right_index: number =  0;
  finished: boolean = false;

  constructor(private http: HttpClient) {
    // Load the values and create single-element arrays for each.
    this.http.get("assets/values.csv", {responseType: 'text'})
    .subscribe(
      data => {
        console.log(data)
        let all_values = data.split("\n").slice();
        this.shuffleArray(all_values);
        this.sorted_lists = all_values.map(x => [x]);
        this.shiftLists();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Shuffles the given array in-place.
   * 
   * @param arr - array to be shuffled.
   */
  shuffleArray(arr: string[]): void {
    for (let i = arr.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = arr[j];
      arr[j] = arr[i];
      arr[i] = tmp;
    }
  }

  /**
   * Prepare to merge the next two lists of values.
   */
  shiftLists(): void {
    if(this.sorted_lists.length == 1) {
      this.finished = true;
    } else {
      this.left_index = 0;
      this.left_list = this.sorted_lists[0];
      this.sorted_lists.shift();
      this.right_index = 0;
      this.right_list = this.sorted_lists[0];
      this.sorted_lists.shift();
      this.current_merge = [];
    }
  }

  /**
   * Handles the event of a value being selected by first enacting a step of the merge sort and then choosing the next
   * pair of elements to compare.
   * 
   * @parm side - "L" or "R", for whether the left or right-hand value was chosen.
   */
  onSelect(side: string): void {
    // Append the chosen value to the in-progress merge list.
    if (side == "L") {
      this.current_merge.push(this.left_list[this.left_index])
      this.left_index += 1;
    } else {
      this.current_merge.push(this.right_list[this.right_index])
      this.right_index += 1;
    }
    
    // If either left or right arrays are finished, append the remaining values to the merge list in order and choose
    // the next two lists to merge.
    if(this.left_index >= this.left_list.length) {
      this.current_merge = this.current_merge.concat(this.right_list.slice(this.right_index, this.right_list.length));
      this.sorted_lists.push(this.current_merge.slice())
      this.shiftLists();
    } else if (this.right_index >= this.right_list.length) {
      this.current_merge = this.current_merge.concat(this.left_list.slice(this.left_index, this.left_list.length));
      this.sorted_lists.push(this.current_merge.slice())
      this.shiftLists();
    }
  }
}
