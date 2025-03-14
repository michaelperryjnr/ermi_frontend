import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { AnimationVariants } from "@/lib";
import { Ministry } from "@/types";

interface MinistriesPreviewSectionProps {
  ministries: Ministry[];
}

const MinistriesPreviewSection = ({
  ministries,
}: MinistriesPreviewSectionProps) => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={AnimationVariants.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={AnimationVariants.item}
            className="text-3xl font-bold mb-4"
          >
            Our Ministries
          </motion.h2>
          <motion.p
            variants={AnimationVariants.item}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Join us in our various ministries where you can grow, serve, and
            connect with others in the body of Christ
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={AnimationVariants.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {ministries.map((ministry, index) => (
            <motion.div key={index} variants={AnimationVariants.item}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  {ministry.icon}
                  <h3 className="text-xl font-bold mb-2">{ministry.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    Join our vibrant {ministry.title.toLowerCase()} community
                  </p>
                  <Button variant="outline" asChild>
                    <Link
                      href={`/departments/${ministry.title
                        .toLowerCase()
                        .replace("'s", "s")
                        .replace(" ", "-")}`}
                    >
                      Learn More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MinistriesPreviewSection;
