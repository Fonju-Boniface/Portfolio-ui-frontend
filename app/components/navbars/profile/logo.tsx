"use client";

import React from "react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      passHref
      className=" w-[100%] flex justify-start align-center gap-1 pt-2"
    >
      Home
    </Link>
  );
};

export default Logo;
