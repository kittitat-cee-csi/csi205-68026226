"use client";

import { Backdrop } from "@/components/tailgrids/core/overlay";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/tailgrids/core/dialog";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const users = [
  { email: "admin@company.com", password: "pass", name: "นายยิงน้อย มากมาย", role: "admin", other: "..." },
  { email: "user@company.com", password: "pass", name: "นางหนูดี มีมาก", role: "user", other: "..." },
  { email: "manager@company.com", password: "pass", name: "นายภักดี มีสุข", role: "manager", other: "..." }
];

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const cred = localStorage.getItem("credential");
    if (cred) {
      try {
        const parsed = JSON.parse(cred);
        if (parsed.token) {
          const r = localStorage.getItem("returnPath") || localStorage.getItem("returnpath") || "/";
          router.replace(r);
        }
      } catch {}
    }
  }, [router]);

  const handleLogin = () => {
    const userEl = document.getElementById("user") as HTMLInputElement;
    const passEl = document.getElementById("pass") as HTMLInputElement;
    const o = userEl ? userEl.value.trim() : "";
    const s = passEl ? passEl.value.trim() : "";

    if (o === "") {
      userEl?.focus();
      alert("Error: User is require");
      return;
    }
    if (s === "") {
      passEl?.focus();
      alert("Error: Password is require");
      return;
    }

    const t = o.includes("@") ? o : `${o}@company.com`;

    new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() <= 0.8) {
          const i = users.find((e) => e.email === t && e.password === s);
          if (i !== undefined) {
            resolve({
              token: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
              name: i.name,
              role: i.role,
              email: i.email,
            });
          } else {
            reject("user not found");
          }
        } else {
          reject("connecting refused");
        }
      }, 1000 + 2000 * Math.random());
    })
      .then((res) => {
        localStorage.setItem("credential", JSON.stringify(res));
        const r = localStorage.getItem("returnPath") || localStorage.getItem("returnpath") || "/";
        router.replace(r);
        localStorage.removeItem("returnPath");
        localStorage.removeItem("returnpath");
        router.refresh();
      })
      .catch((e) => {
        if (userEl) userEl.value = "";
        if (passEl) passEl.value = "";
        userEl?.focus();
        alert(`Error: ${e}`);
      });
  };

  const handleQuick = (role: string) => {
    const userEl = document.getElementById("user") as HTMLInputElement;
    const passEl = document.getElementById("pass") as HTMLInputElement;
    if (userEl) userEl.value = role;
    if (passEl) passEl.value = "pass";
  };

  return (
    <Backdrop isOpen={true}>
      <Dialog showCloseButton={false} className="w-11/12 max-w-md text-center bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Who are you?
          </DialogTitle>
        </DialogHeader>

        {/* Quick select pills */}
        <div className="flex justify-center gap-2 my-2">
          {["user", "admin", "manager"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleQuick(r)}
              className="px-2.5 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-medium cursor-pointer transition"
            >
              {r}
            </button>
          ))}
        </div>

        <DialogBody className="flex flex-col items-center justify-center gap-3 py-3">
          {/* User Input with @company.com Addon */}
          <div className="flex w-full items-center rounded-lg border border-gray-300 bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-blue-400">
            <div className="px-3 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="16" x="2" y="4" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
              </svg>
            </div>
            <input
              id="user"
              type="text"
              defaultValue="user"
              placeholder="user | admin |manager"
              className="flex-1 py-2.5 px-2 text-base font-semibold border-none outline-none text-gray-800"
            />
            <div className="px-3 text-sm font-semibold text-gray-500 bg-gray-50 py-2.5 border-l border-gray-200 select-none">
              @company.com
            </div>
          </div>

          {/* Password Input */}
          <div className="flex w-full items-center rounded-lg border border-gray-300 bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-blue-400">
            <div className="px-3 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49M14.084 14.158a3 3 0 0 1-4.242-4.242M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143M2 2l20 20" />
              </svg>
            </div>
            <input
              id="pass"
              type="password"
              defaultValue="pass"
              placeholder="password"
              className="flex-1 py-2.5 px-2 text-base font-semibold border-none outline-none text-gray-800"
            />
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-end pt-2">
          <DialogClose
            appearance="outline"
            className="p-2 px-6 border border-gray-400 rounded-lg hover:bg-gray-100 font-semibold cursor-pointer active:scale-95 transition"
            onClick={handleLogin}
          >
            Login
          </DialogClose>
        </DialogFooter>
      </Dialog>
    </Backdrop>
  );
}
