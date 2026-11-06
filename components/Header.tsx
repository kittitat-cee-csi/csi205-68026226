'use client'

import { useEffect, useState } from "react";
import { Badge } from "@/components/tailgrids/core/badge";

export default function Header() {
  const [role, setRole] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const updateCred = () => {
      const cred = localStorage.getItem("credential");
      if (cred) {
        try {
          const parsed = JSON.parse(cred);
          setRole(parsed.role || "");
          setName(parsed.name || "");
          setEmail(parsed.email || "");
        } catch {
          // ignore
        }
      } else {
        setRole("");
        setName("");
        setEmail("");
      }
    };

    updateCred();
    // Also listen to storage events
    window.addEventListener("storage", updateCred);
    const interval = setInterval(updateCred, 1000);
    return () => {
      window.removeEventListener("storage", updateCred);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='mt-4 text-center'>
      {/* CSI 205 Logo */}
      <div className='flex justify-center gap-4'>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-red-700 text-white rotate-15'>C</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-green-600 text-white -rotate-8'>S</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-blue-700 text-white rotate-15'>I</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-cyan-400 text-white -rotate-10'>2</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-yellow-400 text-white rotate-5'>0</Badge>
        <Badge className='text-3xl rounded-lg py-1 px-3 bg-red-700 text-white -rotate-8'>5</Badge>
      </div>

      {/* Course title */}
      <div className='mt-4'>
        <Badge className='text-2xl text-yellow-300 bg-black rounded-lg font-bold px-4 py-2'>
          FRONT END SOFTWARE DEVELOPMENT
        </Badge>
      </div>

      {/* Role, Name, Email Badges */}
      <div className="w-full max-w-3xl mx-auto my-2 gap-2 flex flex-wrap justify-around items-center px-2">
        <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold">
          Role:
          <Badge id="role" className="text-base sm:text-lg font-semibold py-1.5 px-3 rounded-lg bg-red-100 text-red-700 border border-red-300">
            {role || "-"}
          </Badge>
        </div>
        <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold">
          Name:
          <Badge id="name" className="text-base sm:text-lg font-semibold py-1.5 px-3 rounded-lg bg-green-100 text-green-700 border border-green-300">
            {name || "-"}
          </Badge>
        </div>
        <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold">
          Email:
          <Badge id="email" className="text-base sm:text-lg font-semibold py-1.5 px-3 rounded-lg bg-gray-100 text-gray-700 border border-gray-300">
            {email || "-"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
