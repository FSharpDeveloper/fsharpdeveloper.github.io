import {
  Injectable,
  OnInit
} from '@angular/core';
import {
  AngularFireAuth
} from 'angularfire2/auth';
import {
  AngularFirestore
} from 'angularfire2/firestore';
import {
  messaging as AfMessaging, User, app
} from 'firebase';
import {
  Subject
} from 'rxjs';
import {
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit {
  private messaging = AfMessaging();
  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor(public auth$: AngularFireAuth,
    private afs$: AngularFirestore,
    private http$: HttpClient) {}

  ngOnInit(): void {
  }

  signInAnonymously() {
    return this.auth$.auth.signInAnonymously();
  }

  signInAnonymouslyAndRetrieveData() {
    return this.auth$.auth.signInAnonymouslyAndRetrieveData();
  }

  getPermission(user) {
    this.messaging
      .requestPermission()
      .then(() => this.getToken())
      .then(token => {
        this.saveToken(user, token);
        this.subscribeToTopic('fsharpnews', token);
        return token;
      })
      .then(token => console.log('Premission Granted, token: ', token))
      .catch(error => console.log(error));
  }

  getPermissionAndSubscribeToTopics(topics: Array<string>) {
    this.messaging
    .requestPermission()
    .then(() => this.getToken())
    .then(token => {
      topics.forEach(topic => this.subscribeToTopic(topic, token));
      return token;
    });
  }
  monitorRefresh(user) {
    this.messaging.onTokenRefresh(() => this.handleTokenRefresh(user));
  }

  receiveMessages(callback ? ) {
    this.messaging.onMessage(p => callback(p) || this.handleNotification(p));
  }

  //#region tokens handling
  getToken() {
    return this.messaging.getToken();
  }

  saveToken(user, token) {
    const currentTokens = user.fcmTokens || {};
    if (!currentTokens[token]) {
      const userRef = this.afs$.collection('/users').doc(user.uid);
      const tokens = { ...currentTokens,
        [token]: true
      };
      userRef.update({
        fcmTokens: tokens
      });
    }
  }

  subscribeToTopic(topic, token) {
    const rootUrl = 'https://us-central1-fsharpdev-3874b.cloudfunctions.net';
    topic = `/topics/${topic}`;
    this.http$
      .post(
        `${rootUrl}/topics/subscribe`, {
          token: token,
          topic: topic
        }
      )
      .subscribe(r => console.log(r));
  }

  handlePermissionError(error) {
    console.log('token permission occured: ', error);
  }

  handleTokenRefresh(user) {
    this.messaging.onTokenRefresh(() => {
      this.getToken()
        .then(token => this.saveToken(user, token));
    });
  }
  //#endregion

  //#region handling Notifications
  handleNotification(payload) {
    console.log('Notification received: ', payload);
    this.messageSource.next(payload);
  }

  handleTopicNotification(payload) {
    console.log('Notification received for Topic: ', payload);
    this.messageSource.next(payload);
  }
  //#endregion
}
