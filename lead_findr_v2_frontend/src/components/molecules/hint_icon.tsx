"use client";

import { useState } from "react";

export default function HintIcon({ content }: { content: string }) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block">
            <span
                className="cursor-pointer text-yellow-600"
                onClick={() => setShow(!show)}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                💡
            </span>
            {show && (
                <div className="absolute z-50 bg-white text-gray-800 text-xs border border-gray-300 rounded-md px-2 py-1 w-64 shadow-md left-5 top-1">
                    {content}
                </div>
            )}
        </div>
    );
}
