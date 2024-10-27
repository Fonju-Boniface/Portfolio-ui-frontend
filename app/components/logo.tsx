"use client"
import Image from "next/image";
import React from 'react'

const Logo = () => {
  return (
    <Image
          src="/horn1.png" // Replace with your image path
          alt="main logo"
          width={45} // 12rem = 192px
          height={45}
          // className=" object-cover"
        />
  )
}

export default Logo