"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

const MotionLink = motion(Link);

export default function PublishFAB() {
  return (
    <MotionLink
      href="/post/new"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type:"spring", stiffness:300, damping:20, delay:0.3 }}
      whileHover={{ scale: 1.08, boxShadow:"0 8px 32px rgba(255,107,26,0.55)" }}
      whileTap={{ scale: 0.93 }}
      className="md:hidden"
      style={{
        position:"fixed", bottom:88, right:20,
        width:56, height:56, borderRadius:18,
        background:"linear-gradient(135deg,#FF6B1A,#C0392B)",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 20px rgba(255,107,26,0.4)",
        zIndex:40, textDecoration:"none",
      }}
    >
      <PenLine size={22} color="#fff" strokeWidth={2.2} />
    </MotionLink>
  );
}