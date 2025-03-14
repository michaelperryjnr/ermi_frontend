"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Images from "../assets";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, Sun, Moon, User, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useMobile } from "@/hooks/use-mobile";
import AnnouncementBar from "./announcement-bar";
import BuildingFundHeader from "./building-fund-header";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: "Home", href: "/" },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Departments",
      children: [
        { title: "Main Youth", href: "/departments/main-youth" },
        { title: "Teen Youth", href: "/departments/teen-youth" },
        { title: "Women's Fellowship", href: "/departments/womens-fellowship" },
        { title: "Men's Fellowship", href: "/departments/mens-fellowship" },
      ],
    },
    {
      title: "Resources",
      children: [
        { title: "Devotionals", href: "/devotionals" },
        { title: "Sermons", href: "/sermons" },
        { title: "Bible", href: "/bible" },
        {
          title: "Events",
          href: "/events",
        },
        { title: "Calendar", href: "/calendar" },
        {
          title: "Gallery",
          href: "/gallery",
        },
      ],
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ];

  return (
    <>
      <div className="relative">
        <AnnouncementBar />
        <BuildingFundHeader />
      </div>
      <header
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl"
          >
            <Image
              src={Images.logo}
              alt="Eternal Redemption Ministry International"
              width={60}
              height={60}
            />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {child.title}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="bg-foreground rounded-full"
              size="icon"
              asChild
            >
              <Link href="/pay">
                <Coins className="h-5 w-5 text-background" />
                <span className="sr-only">Donate</span>
              </Link>
            </Button>

            {/* Mobile Menu Trigger */}
            {isMobile && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navItems.map((item, index) => (
                      <div key={index}>
                        {item.children ? (
                          <div className="space-y-3">
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="pl-4 border-l space-y-2">
                              {item.children.map((child, childIndex) => (
                                <Link
                                  key={childIndex}
                                  href={child.href}
                                  className="block py-1 text-muted-foreground hover:text-foreground"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {child.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="block py-2 text-lg font-medium hover:text-primary"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
