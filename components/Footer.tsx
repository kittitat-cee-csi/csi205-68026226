'use client'

import { Badge } from "@/components/tailgrids/core/badge";
import { Facebook, Twitter, Instagram } from "@tailgrids/icons";

export default function Footer() {
    return (
        <div className="mt-4 mb-10 text-center">
            <div>
                <Badge className="text-xl text-black rounded-md">
                    68026226 กิตติทัต ก้านกิ่ง
                </Badge>
            </div>
            <div className="mt-3 flex justify-center gap-8 items-center">
                <Facebook className="text-blue-700" />
                <div className="border-l h-6" />
                <Twitter className="text-black" />
                <div className="border-l h-6" />
                <Instagram className="" />
            </div>
        </div>
    );
}