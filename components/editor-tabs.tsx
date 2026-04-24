"use client"

import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvatarEditor } from "@/components/avatar-editor"
import { ApprovalScreenshot } from "@/components/approval-screenshot"

export function EditorTabs({ className }: { className?: string }) {
  const [value, setValue] = useState<string>("avatar")
  return (
    <Tabs value={value} onValueChange={(v) => setValue(String(v))} className={className}>
      <TabsList className="self-center">
        <TabsTrigger value="avatar">离职头像</TabsTrigger>
        <TabsTrigger value="approval">离职审批</TabsTrigger>
      </TabsList>
      <TabsContent value="avatar" className="flex w-full justify-center">
        <AvatarEditor className="lg:h-full" />
      </TabsContent>
      <TabsContent value="approval" className="flex w-full justify-center">
        <ApprovalScreenshot className="lg:h-full" />
      </TabsContent>
    </Tabs>
  )
}
