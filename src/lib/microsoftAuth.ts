import { MS_TENANT_ID } from "@/lib/config";
import { auth } from "@/lib/firebase";
import { getAdditionalUserInfo, getIdToken, OAuthProvider, signInWithPopup } from "firebase/auth";

/**
 * Microsoft sign-in through Firebase, with the same tenant and scope as the legacy portal.
 * Returns what PUT /user/ver needs; the backend owns the users/{uid} record.
 */
export const signInWithMicrosoft = async () => {
  const provider = new OAuthProvider("microsoft.com");
  provider.setCustomParameters({ tenant: MS_TENANT_ID });
  provider.addScope("User.ReadBasic.all");

  const result = await signInWithPopup(auth, provider);
  const additional = getAdditionalUserInfo(result);

  return {
    token: await getIdToken(result.user),
    msProfile: (additional?.profile || {}) as Record<string, any>,
    providerId: additional?.providerId || "microsoft.com",
  };
};
