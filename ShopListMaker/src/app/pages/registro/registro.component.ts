import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  educationalDetails!: FormGroup;
  personal_step = false;
  address_step = false;
  education_step = false;
  step = 0;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.personalDetails = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['',Validators.required]
    });
    this.addressDetails = this.formBuilder.group({
        city: ['', Validators.required],
        address: ['', Validators.required],
        pincode: ['',Validators.required]
    });
    this.educationalDetails = this.formBuilder.group({
        highest_qualification: ['', Validators.required],
        university: ['', Validators.required],
        total_marks: ['',Validators.required]
    });
}
  get personal() { return this.personalDetails.controls; }
  get education() { return this.educationalDetails.controls; }
  get address() { return this.addressDetails.controls; }

  next(){
    if(this.step==0){
          this.personal_step = true;
          if (this.personalDetails.invalid) { return  }
          this.step++
    }
    document.getElementById("myProgressBar")!.style.width = "50%";

  }

  previous(){
    this.step--
    if(this.step==0){
      this.personal_step = true;
    }
    document.getElementById("myProgressBar")!.style.width = "0%";
  }
  submit(){
    document.getElementById("myProgressBar")!.style.width = "100%";
    if(this.step==1){
      this.step=2;
      this.education_step = true;
      if (this.educationalDetails.invalid) { return }
    }

  }

}
