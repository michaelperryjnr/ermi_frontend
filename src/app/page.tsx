"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Globe } from "lucide-react";
import {
  BlogPreviewSection,
  CurrentEventSection,
  GalleryPreviewSection,
  LandingHeroSection,
  LatestSermonsSection,
  MinistriesPreviewSection,
  NewsLetterSection,
  UpcomingEventsSection,
} from "@/components/sections";
import { AnimationVariants } from "@/lib";
import Images from "@/assets";

export default function Home() {
  const currentEvent = {
    id: "1",
    title: "Easter Sunday Service",
    date: "2025-04-20T10:00:00",
    endDate: "2025-04-20T12:00:00",
    location: "Main Sanctuary",
    description:
      "Join us as we celebrate the resurrection of our Lord Jesus Christ with a special Easter service featuring worship, communion, and a powerful message of hope.",
    image: "/placeholder.svg?height=1080&width=1920",
  };

  const galleryPreview = [
    {
      id: "1",
      title: "Sunday Service",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "2",
      title: "Youth Retreat",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "3",
      title: "Women's Conference",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "4",
      title: "Men's Breakfast",
      image: "/placeholder.svg?height=400&width=600",
    },
  ];

  const eventsPreview = [
    {
      id: "1",
      title: "Sunday Worship Service",
      date: "2025-03-17T10:00:00",
      location: "Main Sanctuary",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "2",
      title: "Youth Conference 2025",
      date: "2025-03-22T09:00:00",
      location: "Church Auditorium",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "3",
      title: "Women's Fellowship",
      date: "2025-03-29T14:00:00",
      location: "Fellowship Hall",
      image: "/placeholder.svg?height=300&width=500",
    },
  ];

  const blogPreview = [
    {
      id: "1",
      title: "Finding Peace in God's Presence",
      excerpt:
        "In today's fast-paced world, finding moments of peace can seem impossible. Learn how to connect with God amidst the chaos.",
      date: "2025-03-10",
      image: "/placeholder.svg?height=300&width=500",
      author: "Pastor John Doe",
    },
    {
      id: "2",
      title: "The Power of Community in Faith",
      excerpt:
        "Discover why being part of a faith community is essential for spiritual growth and personal development.",
      date: "2025-03-05",
      image: "/placeholder.svg?height=300&width=500",
      author: "Elder Sarah Smith",
    },
    {
      id: "3",
      title: "Raising Godly Children in a Digital Age",
      excerpt:
        "Practical tips for parents navigating the challenges of raising children with strong faith values in today's digital world.",
      date: "2025-02-28",
      image: "/placeholder.svg?height=300&width=500",
      author: "Deacon Michael Johnson",
    },
  ];

  const sermonPreview = [
    {
      id: "1",
      title: "Walking in Faith",
      speaker: "Pastor John Doe",
      date: "2025-03-10",
      scripture: "Hebrews 11:1-6",
      image: Images.videoPlaceholder,
      duration: "45:22",
    },
    {
      id: "2",
      title: "The Power of Prayer",
      speaker: "Pastor Jane Smith",
      date: "2025-03-03",
      scripture: "James 5:13-18",
      image: Images.videoPlaceholder,
      duration: "38:15",
    },
    {
      id: "3",
      title: "Finding Peace in Troubled Times",
      speaker: "Pastor John Doe",
      date: "2025-02-24",
      scripture: "John 14:27",
      image: Images.videoPlaceholder,
      duration: "42:50",
    },
  ];

  const ministries = [
    {
      title: "Main Youth",
      icon: <Users className="h-10 w-10 mb-4 text-primary" />,
    },
    {
      title: "Teen Youth",
      icon: <Users className="h-10 w-10 mb-4 text-primary" />,
    },
    {
      title: "Women's Fellowship",
      icon: <Users className="h-10 w-10 mb-4 text-primary" />,
    },
    {
      title: "Men's Fellowship",
      icon: <Users className="h-10 w-10 mb-4 text-primary" />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <LandingHeroSection />

      {/* Pastor's Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div
              variants={AnimationVariants.item}
              className="relative aspect-square"
            >
              <Image
                src={Images.headPastor}
                alt="Head Pastor"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
            <motion.div variants={AnimationVariants.item} className="space-y-6">
              <h2 className="text-3xl font-bold">Meet Our Head Pastor</h2>
              <p className="text-muted-foreground">
                Rev. Daniel Akrofi Akotiah has been leading our congregation for
                over 10 years, bringing the word of God to life through powerful
                teaching and compassionate leadership. His vision for ERMI is to
                create a community where everyone can experience God's love and
                grow in their faith journey.
              </p>
              <p className="text-muted-foreground">
                With a background in theology and a heart for missions, Pastor
                John has helped establish multiple outreach programs and
                continues to guide our church in making a positive impact in our
                community and beyond.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/about#pastor">Read Full Bio</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Current Event Section */}
      <CurrentEventSection currentEvent={currentEvent} />

      {/* Upcoming Events Preview */}
      <UpcomingEventsSection data={eventsPreview} />

      {/* Latest Sermons Preview */}
      <LatestSermonsSection sermonPreview={sermonPreview} />

      {/* Ministry Sections */}
      <MinistriesPreviewSection ministries={ministries} />

      {/* Gallery Preview */}
      <GalleryPreviewSection galleryPreview={galleryPreview} />

      {/* Blog Preview */}
      <BlogPreviewSection data={blogPreview} />

      {/* Newsletter Subscription */}
      <NewsLetterSection />

      {/* Global Impact */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={AnimationVariants.item} className="space-y-6">
              <h2 className="text-3xl font-bold">Our Global Impact</h2>
              <p className="text-muted-foreground">
                ERMI is committed to spreading the gospel and making a
                difference across the globe. Through our missions and outreach
                programs, we've touched lives in multiple countries, providing
                both spiritual guidance and humanitarian aid.
              </p>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="text-left">
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">
                    Countries Reached
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-primary">50k+</div>
                  <div className="text-sm text-muted-foreground">
                    Lives Impacted
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/missions">
                  <Globe className="mr-2 h-4 w-4" />
                  Our Missions
                </Link>
              </Button>
            </motion.div>
            <motion.div
              variants={AnimationVariants.item}
              className="relative aspect-video"
            >
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Global missions"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
