import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AuthActions from './auth.actions';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
// import { fromPromise } from 'rxjs/observable/fromPromise';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable()
export class AuthEffects {
    
    @Effect()
    authSignup = this.actions$.ofType(AuthActions.TRY_SIGNUP)
        .pipe(
            map((action:AuthActions.TrySignup) => {
                return action.payload;
            }),
            switchMap((authData: {username: string, password: string}) => {
              return from(firebase.auth().createUserWithEmailAndPassword(authData.username, authData.password));  
              //return fromPromise(firebase.auth().createUserWithEmailAndPassword(authData.username, authData.password));
                //return '';
            }),
            switchMap(() => {
              return from(firebase.auth().currentUser.getIdToken());
                // return fromPromise(firebase.auth().currentUser.getIdToken());
            }),
            mergeMap((token: string) => {
                return [
                  {
                    type: AuthActions.SIGNUP
                  },
                  {
                    type: AuthActions.SET_TOKEN,
                    payload: token
                  }
                ];
              })

        );
    
        @Effect()
        authLogout = this.actions$.ofType(AuthActions.TRY_SIGNIN)
            .pipe(
                map((action:AuthActions.TrySignin) => {
                    return action.payload;
                }),
                switchMap((authData: {username: string, password: string}) => {
                    return from(firebase.auth().signInWithEmailAndPassword(authData.username, authData.password));
                }),
                switchMap(() => {
                    return from(firebase.auth().currentUser.getIdToken());
                }),
                mergeMap((token: string) => {
                    this.router.navigate(['/']);
                    return [
                      {
                        type: AuthActions.SIGNIN
                      },
                      {
                        type: AuthActions.SET_TOKEN,
                        payload: token
                      }
                    ];
                  })
    
            );
    
    constructor(private actions$: Actions, private router: Router) {}
}