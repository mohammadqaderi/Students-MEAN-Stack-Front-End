import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { StudentServiceService } from '../../shared/student-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  constructor(
    private studentService: StudentServiceService,
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone
  ) {}
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('chipList') chipList;
  @ViewChild('resetStudentForm') myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  studentForm: FormGroup;
  subjectArray: Subject[] = [];
  SectionArray: any = ['A', 'B', 'C', 'D', 'E'];
  ngOnInit() {
    this.submitBookForm();
  }
  submitBookForm() {
    this.studentForm = this.fb.group({
      student_name: ['', [Validators.required]],
      student_email: ['', [Validators.required]],
      section: ['', [Validators.required]],
      subjects: [this.subjectArray],
      dob: ['', [Validators.required]],
      gender: ['Male']
    });
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }
  formatDate(e) {
    let convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.studentForm.get('dob').setValue(convertDate, {
      onlyself: true
    });
  }
  public handleError = (controlName: string, errorName: string) => {
    return this.studentForm.controls[controlName].hasError(errorName);
  };
  submitStudentForm() {
    if (this.studentForm.valid) {
      this.studentService.AddStudent(this.studentForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/students-list'));
      });
    }
  }
}
