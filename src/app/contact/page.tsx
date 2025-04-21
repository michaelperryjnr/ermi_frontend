"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const data: Array<InfoCardProps> = [
  {
    title: "Community Support",
    info: "Our support team is available around the clock to address any concerns or queries you may have.",
  },
  {
    title: "Feedback and Suggestions",
    info: "We value your feedback and are continuously working to improve our services. Your input is crucial in shaping the future of ERMI",
  },
  {
    title: "Media Inquiries",
    info: "For media-related questions or press-inquiries, please contact us at media@ermi.org",
  },
];

const ContactPage = () => {
  return (
    <div className="px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-center h-[80vh] gap-6 px-4 py-4">
        <div>
          <h1 className="font-semibold text-6xl text-left text-primary mb-10">
            Contact Us
          </h1>
          <p className="text-muted-foreground">
            Email, call or complete the form to get in touch with us
            <br />
            Our response team are available 24/7 <br />
            We look forward to hearing from you
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="mailto:support@ermi.org">Email us</Link>
            <Link href="tel:+233 542358195">+233 (054) 235 - 8195</Link>
          </div>
          <div className="flex flex-row gap-4 justify-between mt-10">
            {data.map((d, idx) => {
              return <InfoCard key={idx} title={d.title} info={d.info} />;
            })}
          </div>
        </div>
        <div className="w-full px-10">
          <motion.div
            className="text-left rounded-xl bg-background/80 backdrop-blur-sm border-2 px-4 py-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              You can reach us at anytime
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2">
                <Input
                  type="text"
                  placeholder="First Name"
                  className="py-2 rounded-xl"
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  className="py-2 rounded-xl"
                />
              </div>
              <Input
                type="email"
                placeholder="Your email "
                className="py-2 rounded-xl"
              />
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="py-2 rounded-xl"
                />
              </div>
              <Textarea placeholder="How can we help?" className="min-h-20" />
            </div>
            <div className="mt-4">
              <Button className="bg-primary hover:bg-primary/90 w-full">
                Submit
              </Button>
              <p className="text-base text-muted-foreground mt-4 text-center">
                By contacting us, you agree to our{" "}
                <Link
                  href="/terms-of-service"
                  className="font-semibold text-secondary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-secondary"
                >
                  Privacy Policy.
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  info: string;
  link?: string;
}

const InfoCard = ({ title, info, link }: InfoCardProps) => {
  return (
    <div className="flex flex-col items-left justify-center gap-4 py-3">
      <h1 className="text-left font-semibold">{title}</h1>
      <p className="text-muted-foreground">{info}</p>
    </div>
  );
};
export default ContactPage;
