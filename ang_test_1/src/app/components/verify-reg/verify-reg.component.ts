import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalTitlePrefix } from 'src/app/Globals';
import { MyApiEndpointService } from 'src/app/services/my-api-endpoint.service';

@Component({
  selector: 'app-verify-reg',
  templateUrl: './verify-reg.component.html',
  styleUrls: ['./verify-reg.component.css']
})
export class VerifyRegComponent implements AfterViewInit{

  isProcessing=true
  wasSuccessful=true

  constructor(private api:MyApiEndpointService, private title:Title){
    title.setTitle('Verify Account' + GlobalTitlePrefix)
  }

  
  ngAfterViewInit(): void {
    const currentURL = new URL(window.location.href);
    const params = new URLSearchParams(currentURL.search);
  
    this.api.verifyReg(params.get('token'))
      .then((res) => {
        if (res) {
          console.log('yes');
          this.isProcessing = false;
          this.wasSuccessful = true;
        } else {
          this.isProcessing = false;
          this.wasSuccessful = false;
          console.log('no');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        this.isProcessing = false;
        this.wasSuccessful = false;
      });
  }
  
}
