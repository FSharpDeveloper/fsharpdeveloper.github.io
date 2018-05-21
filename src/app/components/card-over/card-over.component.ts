import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseService } from '../../services/firebase.service';
import { filter, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-card-over',
  styleUrls: ['./card-over.component.scss'],
  templateUrl: './card-over.component.html',
})
export class CardOverComponent implements OnInit {
  siteName = '[#|>FsharpDev]';
  email = '';
  isAuthenticated = false;
  routes = [{
    icon: 'home',
    route: '.',
    title: 'Home',
  }, {
    icon: 'library_books',
    route: 'articles',
    title: 'Articles',
  }, {
    icon: 'color_lens',
    route: '.',
    title: 'Style Guide',
  }, {
    icon: 'view_quilt',
    route: '.',
    title: 'Layouts',
  }, {
    icon: 'picture_in_picture',
    route: '.',
    title: 'Components & Addons',
  }, ];
  usermenu = [{
    icon: 'swap_horiz',
    route: 'login',
    title: 'Login',
  }, {
    icon: 'tune',
    route: 'profile',
    title: 'Account settings',
  }, {
    icon: 'exit_to_app',
    route: 'logout',
    title: 'Sign out',
  }, ];

  constructor(public media: TdMediaService,
    private _iconRegistry: MatIconRegistry,
    private _domSanitizer: DomSanitizer,
    private snack$: MatSnackBar,
    private toastr$: ToastrService,
    private fSrv: FirebaseService) {

    this.fSrv.auth$.authState
      .pipe(
        filter(user => !!user && !user.isAnonymous),
        take(1)
      ).subscribe(user => {
        if (user) {
          this.email = user.email;
          this.isAuthenticated = true;
          this.fSrv.getPermission(user);
          this.fSrv.monitorRefresh(user);
          this.fSrv.receiveMessages(payload => {
            this.toastr$.info(`href:${payload.notification.title}`);
              // .show(payload.notification.title, payload.notification.description);
          });
        }
      });

  }

  ngOnInit() {
    this._iconRegistry.addSvgIconInNamespace('assets', 'fsharp',
    this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/fsharp.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'fsharp_logo',
    this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/fsharp_logo.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'fsharp128',
    this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/fsharp128.png'));

    this.fSrv.getPermissionAndSubscribeToTopics(['fsharpdev-io', 'fsharp-org', 'fsharp-tweets']);
    this.fSrv.receiveMessages((payload) => {
      this.toastr$ // .info(`href:${payload.notification.title}`);
        .show(payload.notification.title, payload.notification.description);
    });
  }
}
