"use client";
const tokenService = (() => {
    let localstorage : Storage | undefined = typeof window !== "undefined" ? localStorage : undefined
    let token: string | null = localstorage?.getItem("jwtToken") || null;

  return {
    setToken(newToken: string) {
      token = newToken;
      localstorage?.setItem("jwtToken", newToken);
    },
    getToken(): string | null {
      return token;
    },
    clearToken() {
      token = null;
      localstorage?.removeItem("jwtToken");
    },
  };
})();

export default tokenService;
