import { useRouter } from "next/navigation";

export type RouterType = ReturnType<typeof useRouter>;

export const checklogin = (router: any, returnPath: string) => {
  if (typeof window === "undefined") return;

  const credential = localStorage.getItem("credential");
  if (credential !== null) {
    try {
      const { token, email, name, role } = JSON.parse(credential);
      if (
        token !== undefined &&
        email !== undefined &&
        name !== undefined &&
        role !== undefined
      ) {
        // Authenticated
        return;
      } else {
        localStorage.setItem("returnPath", returnPath);
        localStorage.setItem("returnpath", returnPath);
        router.replace("/login");
        router.refresh();
      }
    } catch {
      localStorage.setItem("returnPath", returnPath);
      localStorage.setItem("returnpath", returnPath);
      router.replace("/login");
      router.refresh();
    }
  } else {
    localStorage.setItem("returnPath", returnPath);
    localStorage.setItem("returnpath", returnPath);
    router.replace("/login");
    router.refresh();
  }
};

export const checkLogin = checklogin;

export const doLogout = (router: any, returnPath: string = "/") => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("credential");
  router.replace("/login");
  router.refresh();
};
