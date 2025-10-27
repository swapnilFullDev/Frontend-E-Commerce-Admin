import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AuthAction from "./auth.actions";
import { AuthService } from "../../core/services/auth.service";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { User } from "./auth.models";

@Injectable()
export class AuthEffect {
    constructor(private actions$:Actions, private authService:AuthService){}

      login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.login),
      mergeMap((credentials) =>
        this.authService.loginUser(credentials).pipe(
          map((response:any) => AuthAction.loginSuccess({ token: response.token })),
          catchError(error => of(AuthAction.loginFail({ error: error.message })))
        )
      )
    )
  );

//   loadUser$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(AuthAction.loginSuccess, AuthAction.loadUser),
//       switchMap(() =>
//         this.authService.getUserDetails().pipe(
//           map((user:User) => AuthAction.loadUserSuccess({ user })),
//           catchError(error => of(AuthAction.loadUserFailure({ error: error.message })))
//         )
//       )
//     )
//   );
}
