import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingHeroSection = () => {
  return (
    <section className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Church sanctuary"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
      <div className="container relative z-10 px-4 mx-auto text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Eternal Redemption Ministry International
          </h1>
          <p className="text-xl mb-8">
            Growing in faith, serving with love, transforming lives through the
            power of God's word
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/20"
              asChild
            >
              <Link href="/contact">Visit Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHeroSection;
