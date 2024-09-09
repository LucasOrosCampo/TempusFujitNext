"use client";

import React, { ChangeEvent, useState } from "react";

export default function Page() {
  let [login, setLogin] = useState<string>("");
  let [password, setPwd] = useState<string>("");

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-6">
          <h1>Login</h1>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              username
            </label>
            <input
              id="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={login}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLogin(e.target.value)
              }
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPwd(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex">
            <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-500">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
