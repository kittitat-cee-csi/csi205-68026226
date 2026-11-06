"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";
import sImage from "./kittitat.gif";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    checkLogin(router, "/");
  }, [router]);

  return (
    <div className="mt-4 mx-auto w-11/12 max-w-4xl p-2 flex flex-col md:flex-row border border-gray-300 rounded-xl bg-white shadow-xs">
      {/* Left Column: Image & Personal Details */}
      <div className="w-full md:w-96 shrink-0">
        <div className="flex flex-col border border-gray-300 rounded-md overflow-hidden bg-white">
          <div
            className="bg-black w-full h-80 sm:h-96 bg-center bg-cover"
            style={{ backgroundImage: `url(${sImage.src})` }}
          />
          <div className="text-start p-3 space-y-1">
            <div className="text-base font-bold text-gray-900">
              Hello, I&apos;m กิตติทัต ก้านกิ่ง
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-bold">Student ID: </span>68026226
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-bold">Major: </span>Computer Science and Software Development Innovation (CSI)
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Career Goal & Details */}
      <div className="mt-4 md:mt-0 md:ml-4 w-full text-sm sm:text-base relative flex flex-col justify-between p-2">
        <div className="space-y-3">
          <div>
            <span className="text-base font-bold text-gray-900">Career Goal&nbsp;</span>
          </div>
          <div className="pl-4 sm:pl-8 py-2 text-gray-700 leading-relaxed bg-gray-50/60 rounded-lg border border-gray-100">
            My goal is to become a Full-Stack Developer. I want to develop my skills in both Front-End and Back-End development and build useful, efficient, and user-friendly web applications.
          </div>
          <div className="mt-4 font-medium text-gray-800">
            Nice to meet you!
          </div>
        </div>

        {/* Decorative corner image */}
        <div className="w-32 sm:w-40 self-end mt-4">
          <img
            src="https://i.pinimg.com/564x/c9/2b/e9/c92be949a9a6c5a19a263b2df2ea4732.jpg"
            alt="Decoration"
            className="rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}
