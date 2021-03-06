import { Response } from '../types';

export type Scope =
  | 'user-read-playback-state'
  | 'user-modify-playback-state'
  | 'user-read-currently-playing'
  | 'user-read-private'
  | 'user-read-email'
  | 'user-follow-modify'
  | 'user-follow-read'
  | 'user-library-modify'
  | 'user-library-read'
  | 'streaming'
  | 'app-remote-control'
  | 'user-read-playback-position'
  | 'user-top-read'
  | 'user-read-recently-played'
  | 'playlist-modify-private'
  | 'playlist-read-collaborative'
  | 'playlist-read-private'
  | 'playlist-modify-public'
  | 'ugc-image-upload';

export interface BaseAuthorizationUrlParameters {
  client_id: string;
  redirect_uri: string;
  state?: string;
  scope?: Scope[];
}

export interface AuthorizationCodeUrlParameters
  extends BaseAuthorizationUrlParameters {
  show_dialog?: boolean;
  response_type: 'code';
}

export type CreateAuthorizationCodeUrlParameters = Omit<
  AuthorizationCodeUrlParameters,
  'response_type'
>;

export interface AuthorizationCodeWithPkceUrlParameters
  extends BaseAuthorizationUrlParameters {
  response_type: 'code';
  code_challenge_method: 'S256';
  code_challenge: string;
}

export type CreateAuthorizationCodeWithPkceUrlParameters = Omit<
  AuthorizationCodeWithPkceUrlParameters,
  'response_type' | 'code_challenge_method'
>;

export interface ImplicitGrantUrlParameters
  extends BaseAuthorizationUrlParameters {
  show_dialog?: boolean;
  response_type: 'token';
}

export type CreateImplicitGrantUrlParameters = Omit<
  ImplicitGrantUrlParameters,
  'response_type'
>;

export type CreateAuthorizationUrlParameters =
  | AuthorizationCodeUrlParameters
  | ImplicitGrantUrlParameters
  | AuthorizationCodeWithPkceUrlParameters;

export interface RefreshAccessTokenParameters {
  refresh_token: string;
}

export interface AccessToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export type RefreshAccessTokenResponse = Promise<Response<AccessToken>>;

export interface AuthorizationCodeParameters {
  code: string;
  redirect_uri: string;
}

export interface AuthorizationCodeWithPkceParameters
  extends AuthorizationCodeParameters {
  client_id: string;
  code_verifier: string;
}

export interface RefreshableAccessToken extends AccessToken {
  refresh_token: string;
}

export type AuthorizationCodeResponse = Promise<
  Response<RefreshableAccessToken>
>;

export type ClientCredentialsResponse = Promise<
  Response<Omit<AccessToken, 'scope'>>
>;
