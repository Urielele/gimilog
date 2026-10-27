"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  // Simple version as requested
  const isLoggedIn = false; // TODO: integrate with auth later

  return (
    <nav className="flex items-center justify-between border-b px-6 py-3 bg-white">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg">
          Gimilog
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/search" className="hover:underline">
            Games
          </Link>
          <Link href="/search" className="hover:underline">
            List
          </Link>
          {!isLoggedIn && (
            <>
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <Link href="/register" className="hover:underline">
                Create Account
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="hover:underline"
              >
                Profile
              </button>
              {profileOpen && (
                <div className="absolute mt-8 bg-white border rounded shadow p-2">
                  <Link href="/u/me" className="block px-2 py-1 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link href="/settings" className="block px-2 py-1 hover:bg-gray-100">
                    Settings
                  </Link>
                </div>
              )}
              <Link href="/games/new" className="hover:underline">
                + Log
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search..."
          className="px-3 py-1 border rounded text-sm"
          disabled
        />
        <Link href="/settings" className="text-sm hover:underline">
          Settings
        </Link>
      </div>
    </nav>
  );
}
