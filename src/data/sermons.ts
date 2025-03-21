import type { Sermon } from "@/types";

const allSermons: Sermon[] = [
  {
    id: "1",
    title: "Finding Peace in Troubled Times",
    speaker: "Pastor John Smith",
    date: "2023-03-15",
    scripture: "John 14:27",
    duration: "45:30",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1250,
  },
  {
    id: "2",
    title: "The Power of Faith",
    speaker: "Pastor Sarah Johnson",
    date: "2023-03-08",
    scripture: "Hebrews 11:1-6",
    duration: "38:15",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 980,
  },
  {
    id: "3",
    title: "Living with Purpose",
    speaker: "Pastor Michael Williams",
    date: "2023-03-01",
    scripture: "Ephesians 2:10",
    duration: "42:50",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1560,
  },
  {
    id: "4",
    title: "Overcoming Challenges",
    speaker: "Pastor David Thompson",
    date: "2023-02-22",
    scripture: "James 1:2-4",
    duration: "40:10",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 870,
  },
  {
    id: "5",
    title: "The Heart of Worship",
    speaker: "Pastor Rebecca Lee",
    date: "2023-02-15",
    scripture: "Psalm 95:1-7",
    duration: "36:25",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1120,
  },
  {
    id: "6",
    title: "Walking in Faith",
    speaker: "Pastor John Smith",
    date: "2023-02-08",
    scripture: "Hebrews 11:6",
    duration: "41:15",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 950,
  },
  {
    id: "7",
    title: "The Good Shepherd",
    speaker: "Pastor Sarah Johnson",
    date: "2023-02-01",
    scripture: "John 10:1-18",
    duration: "39:45",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1050,
  },
  {
    id: "8",
    title: "Fruits of the Spirit",
    speaker: "Pastor Michael Williams",
    date: "2023-01-25",
    scripture: "Galatians 5:22-23",
    duration: "44:20",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1320,
  },
  {
    id: "9",
    title: "The Prodigal Son",
    speaker: "Pastor David Thompson",
    date: "2023-01-18",
    scripture: "Luke 15:11-32",
    duration: "47:30",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1480,
  },
  {
    id: "10",
    title: "Armor of God",
    speaker: "Pastor Rebecca Lee",
    date: "2023-01-11",
    scripture: "Ephesians 6:10-18",
    duration: "38:50",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 890,
  },
  {
    id: "11",
    title: "Faith Over Fear",
    speaker: "Pastor John Smith",
    date: "2023-01-04",
    scripture: "Isaiah 41:10",
    duration: "42:15",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1210,
  },
  {
    id: "12",
    title: "Love Your Neighbor",
    speaker: "Pastor Sarah Johnson",
    date: "2022-12-28",
    scripture: "Mark 12:31",
    duration: "37:40",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 980,
  },
  {
    id: "13",
    title: "The Lord's Prayer",
    speaker: "Pastor Michael Williams",
    date: "2022-12-21",
    scripture: "Matthew 6:9-13",
    duration: "40:55",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1150,
  },
  {
    id: "14",
    title: "Forgiveness",
    speaker: "Pastor David Thompson",
    date: "2022-12-14",
    scripture: "Matthew 18:21-22",
    duration: "43:20",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 1020,
  },
  {
    id: "15",
    title: "Joy in Trials",
    speaker: "Pastor Rebecca Lee",
    date: "2022-12-07",
    scripture: "James 1:2-4",
    duration: "39:10",
    videoUrl: "https://youtu.be/Oiu6kUQcrMk?si=BVFec00FcAcvtMGL",
    image: "/placeholder.svg?height=400&width=600",
    views: 940,
  },
];

// This is a mock function that would be replaced with actual data fetching in a real app
export async function getSermonById(id: string): Promise<Sermon | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - in a real app, this would come from an API or database
  const sermons: Sermon[] = allSermons.slice(0, 4);
  const sermon = sermons.find((s) => s.id === id);
  return sermon || null;
}

// This is a mock function that would be replaced with actual data fetching in a real app
export async function getRelatedSermons(
  currentId: string,
  limit = 3
): Promise<Sermon[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - in a real app, this would come from an API or database
  const sermons: Sermon[] = allSermons.slice(0, 4);

  // Filter out the current sermon and limit the results
  return sermons.filter((sermon) => sermon.id !== currentId).slice(0, limit);
}

export async function getAllSermons({
  search,
  speaker,
  scripture,
  sort = "newest",
  page = 1,
  limit = 12,
}: {
  search?: string;
  speaker?: string;
  scripture?: string;
  sort?: "newest" | "oldest" | "popular";
  page?: number;
  limit?: number;
}) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a larger set of mock sermons

  // Apply filters
  let filteredSermons = [...allSermons];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredSermons = filteredSermons.filter(
      (sermon) =>
        sermon.title.toLowerCase().includes(searchLower) ||
        sermon.speaker.toLowerCase().includes(searchLower) ||
        sermon.scripture.toLowerCase().includes(searchLower)
    );
  }

  if (speaker) {
    filteredSermons = filteredSermons.filter(
      (sermon) => sermon.speaker === speaker
    );
  }

  if (scripture) {
    filteredSermons = filteredSermons.filter(
      (sermon) => sermon.scripture === scripture
    );
  }

  // Apply sorting
  if (sort === "newest") {
    filteredSermons.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else if (sort === "oldest") {
    filteredSermons.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else if (sort === "popular") {
    filteredSermons.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  // Calculate pagination
  const totalSermons = filteredSermons.length;
  const totalPages = Math.ceil(totalSermons / limit);
  const offset = (page - 1) * limit;
  const paginatedSermons = filteredSermons.slice(offset, offset + limit);

  return {
    data: paginatedSermons,
    totalPages,
    currentPage: page,
  };
}
