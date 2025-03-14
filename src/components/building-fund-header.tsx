"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BuildingFundHeader() {
  const goalAmount = 500000
  const currentAmount = 350000
  const progressPercentage = (currentAmount / goalAmount) * 100

  return (
    <div className="bg-secondary/10 border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Building Fund Progress</span>
              <span className="text-muted-foreground">
                ${currentAmount.toLocaleString()} of ${goalAmount.toLocaleString()}
              </span>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
              <Progress value={progressPercentage} className="h-2" />
            </motion.div>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href="/donate">Contribute Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

