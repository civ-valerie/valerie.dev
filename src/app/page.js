import { Suspense } from 'react'
import Link from 'next/link'

import { ScrollArea } from '@/components/scroll-area'
import { ScreenLoadingSpinner } from '@/components/screen-loading-spinner'
import { WritingList } from '@/components/writing-list'
import { FloatingHeader } from '@/components/floating-header'
import { PageTitle } from '@/components/page-title'
import { Button } from '@/components/ui/button.jsx'
import { getAllPosts } from '@/lib/contentful'
import { getSortedPosts, getItemsByYear } from '@/lib/utils'

async function fetchData() {
  const allPosts = await getAllPosts()
  console.log("all my posts allPosts",allPosts)
  const sortedPosts = getSortedPosts(allPosts)
  const items = getItemsByYear(sortedPosts)
  return { items }
}

export default async function Home() {
  const { items } = await fetchData()

  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Valerie Stoica" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Home" className="lg:hidden" />
          <p>
            Hi 👋 I'm Valerie, software developer, math enthusiast, aspiring etymologist, and minimalist, based in Waterloo, Canada. 
          </p>
          <p>
            I develop things when I'm not studying Systems Design Engineering at uWaterloo. I am currently working as a Software Developer at the Canadian Food Inspection Agency. Previously, I worked at a 
            startup called CIVISION INC. Outside of work, I tutor highschoolers in mathematics, creating videos that would remind you of 3Blue1Brown.

            But, I could be kept busy for hours with anything linguistics-related. I am currently studying Classical Arabic and dabbling in Russian.
          </p>
          <Button asChild variant="link" className="inline px-0">
            <Link href="/writing">
              <h2 className="mb-4 mt-8">Writing</h2>
            </Link>
          </Button>
          <Suspense fallback={<ScreenLoadingSpinner />}>
            <WritingList items={items} header="Writing" />
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  )
}
