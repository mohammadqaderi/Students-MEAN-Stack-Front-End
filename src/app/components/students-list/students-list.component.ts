import { Student } from '../../model/Student';
import { StudentServiceService } from '../../shared/student-service.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit {
  StudentData: any = [];
  dataSource: MatTableDataSource<Student>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['_id', 'student_name', 'student_email', 'section', 'action'];
  constructor(private studentService: StudentServiceService) {
    this.studentService.GetStudents().subscribe(data => {
      this.StudentData = data;
      this.dataSource = new MatTableDataSource<Student>(this.StudentData);
      setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      }, 0);
      });
  }
  deleteStudent(index: number, student){
    if(window.confirm('Are you sure')) {
    const data = this.dataSource.data;
    data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
    this.dataSource.data = data;
    this.studentService.DeleteStudent(student._id).subscribe()
    }
    }

  ngOnInit() {
  }

}
