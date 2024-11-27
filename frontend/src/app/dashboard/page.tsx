import React from 'react'
import ExamCard from '@/components/examCard'
export default function Page() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    <ExamCard />
    <ExamCard />
    <ExamCard />
    <ExamCard />
   </div>
  )
}
