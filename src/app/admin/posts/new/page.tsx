"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  List,
  Link2,
  Code,
  AlignLeft,
  ChevronDown,
  X,
  Plus,
  Calendar,
  Clock,
  Search,
  Bell,
  Eye,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewPostPage() {
  const [title, setTitle] = useState("Making The World a Better Place");
  const [content, setContent] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis ipsum amet turpis nibh ipsum parturient donec. Ultrices porttitor nullam volutpat et in. Vitae quis tortor a odio tincidunt."
  );
  const [author, setAuthor] = useState("David Clarke");
  const [category, setCategory] = useState("Big Data");
  const [tags, setTags] = useState(["Big Data"]);
  const [publishedGlobally, setPublishedGlobally] = useState(true);
  const [publishedInEnglish, setPublishedInEnglish] = useState(true);
  const [postDate, setPostDate] = useState("02/12/2019");
  const [postTime, setPostTime] = useState("16:00");

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b bg-card flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold">{title || "Untitled Post"}</h1>
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <Select defaultValue="english">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
            </SelectContent>
          </Select>

          {/* Preview Button */}
          <Button variant="outline" size="default">
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          {/* Save Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Save
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save Draft</DropdownMenuItem>
              <DropdownMenuItem>Save & Publish</DropdownMenuItem>
              <DropdownMenuItem>Schedule</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" />
                  <AvatarFallback>DC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Tabs */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="meta">Meta</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Text Block */}
                <div className="bg-card rounded-lg border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground">
                        Text
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Code className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center gap-1 pb-2 border-b">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Title */}
                  <div>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Post title..."
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                      placeholder="Start writing..."
                    />
                  </div>
                </div>

                {/* Image Block */}
                <div className="bg-card rounded-lg border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground">
                        Image
                      </span>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">Upload a file</span>{" "}
                      or drag and drop
                    </p>
                  </div>

                  {/* Caption */}
                  <div>
                    <Label htmlFor="caption" className="text-sm text-muted-foreground">
                      Caption
                    </Label>
                    <Input
                      id="caption"
                      placeholder="Add a caption..."
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Add Block Button */}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4" />
                  Add block
                </Button>
              </TabsContent>

              <TabsContent value="meta">
                <div className="text-center text-muted-foreground py-12">
                  Meta content coming soon...
                </div>
              </TabsContent>

              <TabsContent value="seo">
                <div className="text-center text-muted-foreground py-12">
                  SEO settings coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l bg-card overflow-auto">
          <div className="p-6 space-y-6">
            {/* Author */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Author</Label>
              <Select value={author} onValueChange={setAuthor}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" />
                      <AvatarFallback>DC</AvatarFallback>
                    </Avatar>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="David Clarke">David Clarke</SelectItem>
                  <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Post Date */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Post date</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
                    placeholder="HH:MM"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Category</Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-accent rounded-md">
                  <span className="text-sm">{category}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-auto"
                    onClick={() => setCategory("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tag */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Tag</Label>
              <div className="space-y-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-accent rounded-md"
                  >
                    <span className="text-sm">{tag}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-auto"
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="icon" className="w-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Published globally */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Published globally</Label>
              <Switch
                checked={publishedGlobally}
                onCheckedChange={setPublishedGlobally}
              />
            </div>

            {/* Published in English */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Published in English</Label>
              <Switch
                checked={publishedInEnglish}
                onCheckedChange={setPublishedInEnglish}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
