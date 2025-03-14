"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Users,
  Globe,
  Calendar,
  MapPin,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { NewsLetterSection } from "@/components/sections";

// Animation variants
const AnimationVariants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

export default function AboutPage() {
  // Leadership team data
  const leadershipTeam = [
    {
      id: "1",
      name: "Pastor John Smith",
      role: "Senior Pastor",
      bio: "Pastor John has been leading Eternal Redemption Ministry for over 15 years with a passion for teaching God's word and shepherding His people.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Executive Pastor",
      bio: "Sarah oversees the day-to-day operations of the ministry and helps implement the vision through strategic planning and leadership development.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "3",
      name: "Michael Williams",
      role: "Worship Pastor",
      bio: "Michael leads our worship ministry with a heart for creating an atmosphere where people can encounter God's presence through music and praise.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "4",
      name: "Rebecca Davis",
      role: "Children's Pastor",
      bio: "Rebecca has a passion for teaching children about Jesus in creative and engaging ways, helping them build a strong foundation of faith.",
      image: "/placeholder.svg?height=400&width=400",
    },
  ];

  // Core values data
  const coreValues = [
    {
      title: "Faith",
      description:
        "We believe in the power of faith to transform lives and communities. Our foundation is built on unwavering trust in God's word and promises.",
      icon: <BookOpen className="h-10 w-10 text-primary" />,
    },
    {
      title: "Community",
      description:
        "We are committed to building a loving community where everyone feels welcomed, valued, and supported in their spiritual journey.",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      title: "Compassion",
      description:
        "We demonstrate God's love through acts of kindness, generosity, and service to those in need both locally and globally.",
      icon: <Heart className="h-10 w-10 text-primary" />,
    },
    {
      title: "Excellence",
      description:
        "We pursue excellence in all we do, honoring God by giving our best in every area of ministry and service.",
      icon: <ChevronRight className="h-10 w-10 text-primary" />,
    },
  ];

  // Ministry history milestones
  const milestones = [
    {
      year: "1995",
      title: "Ministry Founded",
      description:
        "Eternal Redemption Ministry International was established with a small group of 25 dedicated believers.",
    },
    {
      year: "2000",
      title: "First Building",
      description:
        "Purchased our first church building to accommodate the growing congregation of over 200 members.",
    },
    {
      year: "2005",
      title: "Community Outreach",
      description:
        "Launched our first major community outreach program, serving over 1,000 families in need.",
    },
    {
      year: "2010",
      title: "Global Missions",
      description:
        "Began our international missions work with projects in Africa, Asia, and South America.",
    },
    {
      year: "2015",
      title: "New Campus",
      description:
        "Moved to our current campus with expanded facilities for worship, education, and community service.",
    },
    {
      year: "2020",
      title: "Digital Ministry",
      description:
        "Expanded our reach through online services and digital resources, connecting with people worldwide.",
    },
    {
      year: "2025",
      title: "Looking Forward",
      description:
        "Continuing to grow and expand our impact with new initiatives and programs to reach more people with God's love.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About Our Ministry
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Discover the heart, vision, and journey of Eternal Redemption
              Ministry International.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={AnimationVariants.item} className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground">
                Eternal Redemption Ministry International began in 1995 with a
                small group of believers who shared a vision for a church that
                would impact the community and the world with the love of
                Christ. What started as a living room gathering has grown into a
                thriving ministry reaching thousands.
              </p>
              <p className="text-muted-foreground">
                Through the years, we've remained committed to our founding
                principles of authentic worship, biblical teaching,
                compassionate outreach, and global missions. Our journey has
                been marked by God's faithfulness and the dedication of
                countless individuals who have contributed to our growth and
                impact.
              </p>
              <p className="text-muted-foreground">
                Today, Eternal Redemption Ministry International continues to
                evolve and expand, but our core mission remains unchanged: to
                lead people into a growing relationship with Jesus Christ and
                equip them to make a difference in their world.
              </p>
            </motion.div>
            <motion.div
              variants={AnimationVariants.item}
              className="relative h-[500px]"
            >
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Church History"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Vision & Mission Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={AnimationVariants.item}
              className="text-3xl font-bold mb-6"
            >
              Our Vision & Mission
            </motion.h2>
            <motion.div variants={AnimationVariants.item} className="space-y-8">
              <div className="bg-card p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-4">Vision</h3>
                <p className="text-muted-foreground">
                  To be a transformative community of faith that empowers people
                  to know God, find freedom, discover purpose, and make a
                  difference in their world.
                </p>
              </div>

              <div className="bg-card p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-4">Mission</h3>
                <p className="text-muted-foreground">
                  We exist to lead people into a growing relationship with Jesus
                  Christ by creating environments where people are encouraged
                  and equipped to pursue intimacy with God, community with
                  insiders, and influence with outsiders.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={AnimationVariants.item}
                className="bg-card p-6 rounded-lg shadow-md text-center"
              >
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-background" id="leadership">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={AnimationVariants.item}
              className="text-3xl font-bold mb-4"
            >
              Our Leadership Team
            </motion.h2>
            <motion.p
              variants={AnimationVariants.item}
              className="text-muted-foreground"
            >
              Meet the dedicated individuals who guide our ministry with wisdom,
              passion, and a commitment to serving God and His people.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {leadershipTeam.map((leader) => (
              <motion.div key={leader.id} variants={AnimationVariants.item}>
                <Card className="overflow-hidden h-full">
                  <div className="relative h-80">
                    <Image
                      src={leader.image || "/placeholder.svg"}
                      alt={leader.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                    <p className="text-primary font-medium mb-3">
                      {leader.role}
                    </p>
                    <p className="text-muted-foreground">{leader.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our History Timeline Section */}
      <section className="py-20 bg-muted/30" id="history">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={AnimationVariants.item}
              className="text-3xl font-bold mb-4"
            >
              Our Journey Through the Years
            </motion.h2>
            <motion.p
              variants={AnimationVariants.item}
              className="text-muted-foreground"
            >
              Explore the key milestones that have shaped Eternal Redemption
              Ministry International into what it is today.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={AnimationVariants.item}
                className={`relative z-10 flex items-center mb-12 ${
                  index % 2 === 0
                    ? "justify-start md:justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? "md:pr-8" : "md:pl-8 md:ml-auto"
                  }`}
                >
                  <div className="bg-card p-6 rounded-lg shadow-md">
                    <div className="bg-primary/10 inline-block px-3 py-1 rounded-full text-primary font-bold mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="py-20 bg-background" id="beliefs">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={AnimationVariants.item}
              className="text-3xl font-bold mb-4"
            >
              What We Believe
            </motion.h2>
            <motion.p
              variants={AnimationVariants.item}
              className="text-muted-foreground"
            >
              Our beliefs are rooted in the Bible and centered on Jesus Christ.
              Here are the core tenets of our faith.
            </motion.p>
          </motion.div>

          <Tabs defaultValue="scripture" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="scripture">Scripture</TabsTrigger>
              <TabsTrigger value="god">God</TabsTrigger>
              <TabsTrigger value="salvation">Salvation</TabsTrigger>
              <TabsTrigger value="church">Church</TabsTrigger>
            </TabsList>

            <TabsContent
              value="scripture"
              className="bg-card p-8 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">The Bible</h3>
              <p className="text-muted-foreground mb-4">
                We believe the Bible is the inspired, infallible Word of God. It
                is our ultimate authority for faith and practice, providing
                guidance for every aspect of life.
              </p>
              <p className="text-muted-foreground">
                Scripture is God-breathed and useful for teaching, rebuking,
                correcting, and training in righteousness, so that the servant
                of God may be thoroughly equipped for every good work.
              </p>
            </TabsContent>

            <TabsContent
              value="god"
              className="bg-card p-8 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">The Trinity</h3>
              <p className="text-muted-foreground mb-4">
                We believe in one God who exists eternally in three persons:
                Father, Son, and Holy Spirit. Each person of the Trinity is
                fully God, sharing the same divine attributes while fulfilling
                distinct roles.
              </p>
              <p className="text-muted-foreground">
                God the Father is the creator and sustainer of all things. Jesus
                Christ, God's only Son, lived a sinless life, died for our sins,
                and rose again. The Holy Spirit empowers believers and guides
                them in truth.
              </p>
            </TabsContent>

            <TabsContent
              value="salvation"
              className="bg-card p-8 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">Salvation</h3>
              <p className="text-muted-foreground mb-4">
                We believe salvation is a gift of God received through faith in
                Jesus Christ. It cannot be earned through good works but is
                freely given by God's grace to all who believe.
              </p>
              <p className="text-muted-foreground">
                Through Christ's death and resurrection, we can be forgiven of
                our sins, reconciled to God, and transformed by His Spirit.
                Salvation brings new life now and the promise of eternal life
                with God.
              </p>
            </TabsContent>

            <TabsContent
              value="church"
              className="bg-card p-8 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-4">The Church</h3>
              <p className="text-muted-foreground mb-4">
                We believe the church is the body of Christ, a community of
                believers united by their faith in Jesus. The church exists to
                worship God, nurture believers, and share the gospel with the
                world.
              </p>
              <p className="text-muted-foreground">
                As members of Christ's body, we are called to love one another,
                use our spiritual gifts to serve, and fulfill the Great
                Commission by making disciples of all nations.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={AnimationVariants.item} className="space-y-6">
              <h2 className="text-3xl font-bold">Join Our Community</h2>
              <p className="text-white/90 text-lg">
                We'd love to have you join us for worship and fellowship. Our
                doors are open to everyone seeking to grow in their faith and
                connect with others.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Sunday Services</p>
                    <p className="text-white/80">9:00 AM & 11:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-white/80">
                      123 Faith Avenue, Cityville, ST 12345
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" variant="secondary">
                  Plan Your Visit
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
            <motion.div
              variants={AnimationVariants.item}
              className="relative h-[400px]"
            >
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="Church Community"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={AnimationVariants.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div
              variants={AnimationVariants.item}
              className="relative h-[400px]"
            >
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="Global Impact"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
            <motion.div variants={AnimationVariants.item} className="space-y-6">
              <h2 className="text-3xl font-bold">Our Global Impact</h2>
              <p className="text-muted-foreground">
                Eternal Redemption Ministry International is committed to making
                a difference not just in our local community, but around the
                world. Through our missions and outreach programs, we've touched
                lives in multiple countries.
              </p>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    15+
                  </div>
                  <div className="text-muted-foreground">Countries Reached</div>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    50k+
                  </div>
                  <div className="text-muted-foreground">Lives Impacted</div>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    25+
                  </div>
                  <div className="text-muted-foreground">Mission Trips</div>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    100+
                  </div>
                  <div className="text-muted-foreground">
                    Missionaries Supported
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/missions">
                  <Globe className="mr-2 h-4 w-4" />
                  Learn About Our Missions
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsLetterSection />
    </div>
  );
}
