"use client";

import React, { useState, useEffect } from "react";
import { app } from "../../../firebase";
import { getAuth, User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const db = getDatabase(app);
        const userRef = ref(db, `users/${currentUser.uid}`);
        
        // Check if the user already exists in the database
        const snapshot = await get(child(ref(db), `users/${currentUser.uid}`));
        if (!snapshot.exists()) {
          // Add user to the database if they don't already exist
          await set(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            imageUrl: currentUser.photoURL,
            role: "user", // Default role is "user"
          });
        }

        // Get the user's role for redirection
        const userData = snapshot.exists() ? snapshot.val() : { role: "user" };
        if (userData.role === "admin") {
          router.push("/pages/locked_123_dashboard_portfolio_page_237");
        } else {
          router.push("/");
        }

        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Clean up on unmount
  }, [router]);

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error signing in with Google:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <Button
        onClick={signInWithGoogle}
        className="bg-primary px-4 text-primary-foreground flex items-center space-x-2"
      >
        Sign In with Google
      </Button>
    </div>
  );
};

export default Login;
