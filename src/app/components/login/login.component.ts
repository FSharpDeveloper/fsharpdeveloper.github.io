import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { TdLoadingService } from '@covalent/core/loading';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  username: string;
  password: string;

  constructor(private _router: Router,
            @Inject('LoadingSvc')  private _loadingService: TdLoadingService,
            private fSrv$: FirebaseService) {}

  login(): void {
    this._loadingService.register();
    this.fSrv$.auth$.auth.signInWithEmailAndPassword(this.username, this.password)
    .then(() =>
    setTimeout(() => {
      this._router.navigate(['/']);
      this._loadingService.resolve();
    }, 2000));
  }
}
