/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com', 'res.cloudinary.com'], // Allow Firebase Storage domain
    },
  };
  
  export default nextConfig;
  