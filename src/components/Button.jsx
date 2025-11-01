import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}
