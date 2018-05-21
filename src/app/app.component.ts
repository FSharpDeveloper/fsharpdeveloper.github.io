import {Component} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { TdMediaService } from '@covalent/core';
import { FirebaseService } from './services/firebase.service';

import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = '[#|>FsharpDev]';
  routes = [ { icon: '', title: 'test'} ];
  usermenu =  [ { icon: '', title: 'test', link: 'login'} ];
  constructor(public media: TdMediaService,
              private _iconRegistry: MatIconRegistry,
              private _domSanitizer: DomSanitizer,
            private snack$: MatSnackBar,
            private fSrv: FirebaseService) {

              this.fSrv.auth$.authState
                .pipe(
                  filter(user => !!user && !user.isAnonymous),
                  take(1)
                ).subscribe(user => {
                  if (user) {
                    this.fSrv.getPermission(user);
                    this.fSrv.monitorRefresh(user);
                    this.fSrv.receiveMessages(payload => {
                      this.snack$.open(payload.notification.title);
                    });
                  }
              });
            // this.fSrv.signInAnonymously()
            //   .then(data => console.log(data))
            //   .catch(error => console.log(error));

    this._iconRegistry.addSvgIconInNamespace('assets', 'fsharp',
    this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/fsharp.svg'));

    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux',
    this
      ._domSanitizer
        .bypassSecurityTrustResourceUrl(
          'https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/teradata-ux.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      this._domSanitizer
        .bypassSecurityTrustResourceUrl(
          'https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark',
      this._domSanitizer
        .bypassSecurityTrustResourceUrl(
          'https://raw.githubusercontent.com/Teradata/covalent-quickstart/develop/src/assets/icons/covalent-mark.svg'));

  }
}
