import { fetchAuthSession } from "aws-amplify/auth";

import { configureAmplifyAuth, isAuthEnabled } from "@/lib/auth-config";

export async function getIdToken(): Promise<string | null> {
  if (!isAuthEnabled()) {
    return null;
  }

  configureAmplifyAuth();

  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}
