import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

  email : string= '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  forgotPassword(){
    this.authService.forgotPassword(this.email);
    this.email='';
  }
}
