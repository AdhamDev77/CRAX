import React from "react"
import { BarList } from '@/components/barList'

const data = [
  { name: "/home", value: 843, href: "https://tremor.so" },
  { name: "/imprint", value: 232, href: "https://tremor.so" },
  { name: "/cancellation", value: 3, href: "https://tremor.so" },
  { name: "/blocks", value: 108, href: "https://tremor.so" },
  { name: "/documentation", value: 384, href: "https://tremor.so" },
]

export const BarListAnalytics = () => {
  const [selectedItem, setSelectedItem] = React.useState("")
  return (
    <div className="flex flex-col gap-3">
      <BarList
        data={data}
        onValueChange={(item) => setSelectedItem(JSON.stringify(item, null, 2))}
      />
    </div>
  )
}