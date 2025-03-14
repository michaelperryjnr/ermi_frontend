import type { Event } from "@/types";

export const events: Event[] = [
  {
    id: "1",
    title: "Sunday Worship Service",
    date: "2025-03-16",
    startTime: "10:00",
    endTime: "12:00",
    location: "Main Sanctuary",
    description:
      "Join us for our weekly worship service with praise, prayer, and a powerful message from God's Word.",
    department: "General",
    color: "#4f46e5", // Indigo
    recurring: true,
    recurringConfig: {
      type: "weekly",
      endDate: "always",
      weekDays: ["sun"],
      interval: 1,
    },
    rsvpCount: {
      yes: 42,
      maybe: 15,
      no: 3,
    },
    attendees: [
      {
        id: "1",
        name: "John D.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        name: "Sarah M.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "3",
        name: "David W.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "16",
        name: "Rachel K.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "17",
        name: "Mark L.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "18",
        name: "Jessica P.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "2",
    title: "Youth Bible Study",
    date: "2025-03-19",
    startTime: "18:30",
    endTime: "20:00",
    location: "Youth Center",
    description:
      "A time of Bible study, discussion, and fellowship for young adults.",
    department: "Main Youth",
    color: "#10b981", // Emerald
    recurring: true,
    recurringConfig: {
      type: "weekly",
      endDate: "always",
      weekDays: ["wed"],
      interval: 1,
    },
    rsvpCount: {
      yes: 18,
      maybe: 7,
      no: 2,
    },
    attendees: [
      {
        id: "4",
        name: "Emma L.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "5",
        name: "Michael P.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "3",
    title: "Women's Prayer Meeting",
    date: "2025-03-20",
    startTime: "19:00",
    endTime: "20:30",
    location: "Fellowship Hall",
    description: "A time of prayer and fellowship for women.",
    department: "Women's Fellowship",
    color: "#ec4899", // Pink
    recurring: true,
    recurringConfig: {
      type: "weekly",
      endDate: "always",
      weekDays: ["thu"],
      interval: 1,
    },
    rsvpCount: {
      yes: 24,
      maybe: 5,
      no: 1,
    },
    attendees: [
      {
        id: "6",
        name: "Lisa R.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "7",
        name: "Karen T.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "4",
    title: "Men's Breakfast",
    date: "2025-03-22",
    startTime: "08:00",
    endTime: "10:00",
    location: "Fellowship Hall",
    description: "Join us for breakfast, fellowship, and a short devotional.",
    department: "Men's Fellowship",
    color: "#f59e0b", // Amber
    recurring: false,
    recurringConfig: {
      type: "monthly",
      endDate: "always",
      interval: 1,
    },
    rsvpCount: {
      yes: 16,
      maybe: 8,
      no: 2,
    },
    attendees: [
      {
        id: "8",
        name: "Robert J.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "9",
        name: "Thomas B.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "5",
    title: "Easter Sunday Service",
    date: "2025-04-20",
    startTime: "10:00",
    endTime: "12:00",
    location: "Main Sanctuary",
    description:
      "Join us as we celebrate the resurrection of our Lord Jesus Christ with a special Easter service.",
    department: "General",
    color: "#4f46e5", // Indigo
    featured: true,
    image: "/placeholder.svg?height=1080&width=1920",
    recurring: false,
    rsvpCount: {
      yes: 78,
      maybe: 23,
      no: 5,
    },
    attendees: [
      {
        id: "10",
        name: "Mary S.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "11",
        name: "James C.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "6",
    title: "Community Outreach",
    date: "2025-03-29",
    startTime: "09:00",
    endTime: "13:00",
    location: "Downtown Community Center",
    description:
      "Join us as we serve our community by distributing food and supplies to those in need.",
    department: "General",
    color: "#0ea5e9", // Sky
    recurring: false,
    rsvpCount: {
      yes: 32,
      maybe: 14,
      no: 3,
    },
    attendees: [
      {
        id: "12",
        name: "Patricia H.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "13",
        name: "Richard M.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "7",
    title: "Teen Game Night",
    date: "2025-03-28",
    startTime: "18:00",
    endTime: "21:00",
    location: "Youth Center",
    description:
      "A fun night of games, snacks, and fellowship for our teenagers.",
    department: "Teen Youth",
    color: "#8b5cf6", // Violet
    recurring: false,
    rsvpCount: {
      yes: 22,
      maybe: 8,
      no: 1,
    },
    attendees: [
      {
        id: "14",
        name: "Jason K.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "15",
        name: "Sophia L.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "8",
    title: "Prayer & Worship Night",
    date: "2025-03-25",
    startTime: "19:00",
    endTime: "21:00",
    location: "Main Sanctuary",
    description: "A special evening of extended prayer and worship.",
    department: "General",
    color: "#4f46e5", // Indigo
    recurring: true,
    recurringConfig: {
      type: "monthly",
      endDate: "2025-12-31",
      interval: 1,
    },
    rsvpCount: {
      yes: 35,
      maybe: 12,
      no: 4,
    },
    attendees: [
      {
        id: "19",
        name: "Daniel F.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "20",
        name: "Hannah G.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "9",
    title: "Children's Ministry Training",
    date: "2025-04-05",
    startTime: "09:00",
    endTime: "12:00",
    location: "Children's Wing",
    description: "Training session for all children's ministry volunteers.",
    department: "Children's Ministry",
    color: "#f97316", // Orange
    recurring: false,
    rsvpCount: {
      yes: 15,
      maybe: 3,
      no: 2,
    },
    attendees: [
      {
        id: "21",
        name: "Laura B.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "22",
        name: "Steven C.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "10",
    title: "Senior Adults Luncheon",
    date: "2025-03-18",
    startTime: "12:00",
    endTime: "14:00",
    location: "Fellowship Hall",
    description:
      "Monthly luncheon for our senior adult members with special guest speaker.",
    department: "Senior Adults",
    color: "#06b6d4", // Cyan
    recurring: false,
    recurringConfig: {
      type: "monthly",
      endDate: "always",
      interval: 1,
    },
    rsvpCount: {
      yes: 28,
      maybe: 5,
      no: 3,
    },
    attendees: [
      {
        id: "23",
        name: "Margaret W.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "24",
        name: "Harold J.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "11",
    title: "Bible Study Group",
    date: "2025-03-17", // Start date (Monday)
    startTime: "14:00", // 2:00 PM
    endTime: "15:30",
    location: "Church Library",
    description:
      "Join our Bible study group that meets multiple times during the week.",
    department: "General",
    color: "#0ea5e9", // Sky
    recurring: true,
    recurringConfig: {
      type: "custom",
      endDate: "2025-06-30",
      weekDays: ["mon", "tue", "fri"], // Happens on Monday, Tuesday, and Friday
      times: ["14:00", "19:00", "09:00"], // Monday at 2pm, Tuesday at 7pm, Friday at 9am
    },
    rsvpCount: {
      yes: 18,
      maybe: 5,
      no: 2,
    },
    attendees: [
      {
        id: "25",
        name: "Jennifer L.",
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "26",
        name: "Andrew M.",
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
];
