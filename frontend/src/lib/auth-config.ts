import { Amplify } from "aws-amplify";

let configured = false;

export function isAuthEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_AUTH_DISABLED === "true") {
    return false;
  }
  return Boolean(
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID &&
      process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID,
  );
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function configureAmplifyAuth(): void {
  if (!isAuthEnabled() || configured) {
    return;
  }

  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
  const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const appUrl = getAppUrl();

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: domain
          ? {
              oauth: {
                domain,
                scopes: ["openid", "email", "profile"],
                redirectSignIn: [`${appUrl}/auth/callback`],
                redirectSignOut: [`${appUrl}/`],
                responseType: "code",
              },
            }
          : undefined,
      },
    },
  });

  configured = true;
}

export function hasHostedUi(): boolean {
  return isAuthEnabled() && Boolean(process.env.NEXT_PUBLIC_COGNITO_DOMAIN);
}
