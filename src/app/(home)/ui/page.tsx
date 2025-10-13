"use client"

import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Menu,
	Minus,
	Plus,
	Settings,
	Star,
	User,
	XCircle,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function UIShowcase() {
	const [progress, setProgress] = useState(50)
	const [switchValue, setSwitchValue] = useState(false)
	const [sliderValue, setSliderValue] = useState([33])
	const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="space-y-4 mb-8">
					<Button asChild variant="ghost" size="sm" className="self-start">
						<Link href="/">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to home
						</Link>
					</Button>

					<div className="text-center space-y-2">
						<h1 className="text-3xl font-bold text-foreground">UI Components</h1>
						<p className="text-muted-foreground">
							Complete showcase of all available shadcn/ui components
						</p>
					</div>
				</div>

				<div className="grid gap-8">
					<section>
						<h2 className="text-2xl font-semibold mb-4">Basic Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Button</CardTitle>
									<CardDescription>Clickable button component</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex flex-wrap gap-2">
										<Button>Default</Button>
										<Button variant="secondary">Secondary</Button>
										<Button variant="outline">Outline</Button>
										<Button variant="ghost">Ghost</Button>
										<Button variant="link">Link</Button>
										<Button variant="destructive">Destructive</Button>
									</div>
									<div className="flex flex-wrap gap-2">
										<Button size="sm">Small</Button>
										<Button size="default">Default</Button>
										<Button size="lg">Large</Button>
										<Button size="icon">
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Badge</CardTitle>
									<CardDescription>Small status descriptors</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex flex-wrap gap-2">
										<Badge>Default</Badge>
										<Badge variant="secondary">Secondary</Badge>
										<Badge variant="outline">Outline</Badge>
										<Badge variant="destructive">Destructive</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Avatar</CardTitle>
									<CardDescription>User profile pictures</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex gap-2">
										<Avatar>
											<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<Avatar>
											<AvatarFallback>JD</AvatarFallback>
										</Avatar>
										<Avatar>
											<AvatarFallback>
												<User className="h-4 w-4" />
											</AvatarFallback>
										</Avatar>
									</div>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Form Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Input Fields</CardTitle>
									<CardDescription>Text input components</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input id="email" type="email" placeholder="Email" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="password">Password</Label>
										<Input id="password" type="password" placeholder="Password" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="message">Message</Label>
										<Textarea id="message" placeholder="Type your message here." />
									</div>
									<div className="space-y-2">
										<Label htmlFor="otp">OTP Input</Label>
										<InputOTP maxLength={6}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Selection Components</CardTitle>
									<CardDescription>Various selection inputs</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label>Select Dropdown</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Select a fruit" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="apple">Apple</SelectItem>
												<SelectItem value="banana">Banana</SelectItem>
												<SelectItem value="orange">Orange</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Checkbox</Label>
										<div className="flex items-center space-x-2">
											<Checkbox id="terms" />
											<Label htmlFor="terms">Accept terms and conditions</Label>
										</div>
									</div>
									<div className="space-y-2">
										<Label>Radio Group</Label>
										<RadioGroup defaultValue="option-one">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="option-one" id="option-one" />
												<Label htmlFor="option-one">Option One</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="option-two" id="option-two" />
												<Label htmlFor="option-two">Option Two</Label>
											</div>
										</RadioGroup>
									</div>
									<div className="space-y-2">
										<Label>Switch</Label>
										<div className="flex items-center space-x-2">
											<Switch checked={switchValue} onCheckedChange={setSwitchValue} />
											<Label>{switchValue ? "On" : "Off"}</Label>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Interactive Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Slider & Progress</CardTitle>
									<CardDescription>Value controls and indicators</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label>Slider: {sliderValue[0]}</Label>
										<Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
									</div>
									<div className="space-y-2">
										<Label>Progress: {progress}%</Label>
										<Progress value={progress} />
										<div className="flex gap-2">
											<Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
												<Minus className="h-4 w-4" />
											</Button>
											<Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Toggle Components</CardTitle>
									<CardDescription>Toggle buttons and groups</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label>Single Toggle</Label>
										<Toggle>
											<Star className="h-4 w-4" />
										</Toggle>
									</div>
									<div className="space-y-2">
										<Label>Toggle Group</Label>
										<ToggleGroup type="multiple">
											<ToggleGroupItem value="bold">
												<strong>B</strong>
											</ToggleGroupItem>
											<ToggleGroupItem value="italic">
												<em>I</em>
											</ToggleGroupItem>
											<ToggleGroupItem value="underline">
												<u>U</u>
											</ToggleGroupItem>
										</ToggleGroup>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Command</CardTitle>
									<CardDescription>Command palette component</CardDescription>
								</CardHeader>
								<CardContent>
									<Command className="rounded-lg border shadow-md">
										<CommandInput placeholder="Type a command or search..." />
										<CommandList>
											<CommandEmpty>No results found.</CommandEmpty>
											<CommandGroup heading="Suggestions">
												<CommandItem>
													<Calendar className="mr-2 h-4 w-4" />
													Calendar
												</CommandItem>
												<CommandItem>
													<Settings className="mr-2 h-4 w-4" />
													Settings
												</CommandItem>
												<CommandItem>
													<User className="mr-2 h-4 w-4" />
													Profile
												</CommandItem>
											</CommandGroup>
										</CommandList>
									</Command>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Layout Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Tabs</CardTitle>
									<CardDescription>Tabbed interface component</CardDescription>
								</CardHeader>
								<CardContent>
									<Tabs defaultValue="account" className="w-full">
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="account">Account</TabsTrigger>
											<TabsTrigger value="password">Password</TabsTrigger>
										</TabsList>
										<TabsContent value="account" className="space-y-2">
											<div className="space-y-1">
												<Label htmlFor="name">Name</Label>
												<Input id="name" defaultValue="Pedro Duarte" />
											</div>
											<div className="space-y-1">
												<Label htmlFor="username">Username</Label>
												<Input id="username" defaultValue="@peduarte" />
											</div>
										</TabsContent>
										<TabsContent value="password" className="space-y-2">
											<div className="space-y-1">
												<Label htmlFor="current">Current password</Label>
												<Input id="current" type="password" />
											</div>
											<div className="space-y-1">
												<Label htmlFor="new">New password</Label>
												<Input id="new" type="password" />
											</div>
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Accordion</CardTitle>
									<CardDescription>Collapsible content sections</CardDescription>
								</CardHeader>
								<CardContent>
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<AccordionTrigger>Is it accessible?</AccordionTrigger>
											<AccordionContent>
												Yes. It adheres to the WAI-ARIA design pattern.
											</AccordionContent>
										</AccordionItem>
										<AccordionItem value="item-2">
											<AccordionTrigger>Is it styled?</AccordionTrigger>
											<AccordionContent>
												Yes. It comes with default styles that matches the other components
												aesthetic.
											</AccordionContent>
										</AccordionItem>
										<AccordionItem value="item-3">
											<AccordionTrigger>Is it animated?</AccordionTrigger>
											<AccordionContent>
												Yes. It&apos;s animated by default, but you can disable it if you prefer.
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Overlay Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Dialog</CardTitle>
									<CardDescription>Modal dialog component</CardDescription>
								</CardHeader>
								<CardContent>
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline">Open Dialog</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Are you absolutely sure?</DialogTitle>
												<DialogDescription>
													This action cannot be undone. This will permanently delete your account
													and remove your data from our servers.
												</DialogDescription>
											</DialogHeader>
										</DialogContent>
									</Dialog>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Alert Dialog</CardTitle>
									<CardDescription>Confirmation dialog</CardDescription>
								</CardHeader>
								<CardContent>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="outline">Show Alert</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will permanently delete your account
													and remove your data from our servers.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction>Continue</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Popover</CardTitle>
									<CardDescription>Floating content container</CardDescription>
								</CardHeader>
								<CardContent>
									<Popover>
										<PopoverTrigger asChild>
											<Button variant="outline">Open Popover</Button>
										</PopoverTrigger>
										<PopoverContent>
											<div className="space-y-2">
												<h4 className="font-medium leading-none">Dimensions</h4>
												<p className="text-sm text-muted-foreground">
													Set the dimensions for the layer.
												</p>
												<div className="grid gap-2">
													<div className="grid grid-cols-3 items-center gap-4">
														<Label htmlFor="width">Width</Label>
														<Input id="width" defaultValue="100%" className="col-span-2 h-8" />
													</div>
													<div className="grid grid-cols-3 items-center gap-4">
														<Label htmlFor="height">Height</Label>
														<Input id="height" defaultValue="25px" className="col-span-2 h-8" />
													</div>
												</div>
											</div>
										</PopoverContent>
									</Popover>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Tooltip</CardTitle>
									<CardDescription>Hover information</CardDescription>
								</CardHeader>
								<CardContent>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button variant="outline">Hover me</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Add to library</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Sheet</CardTitle>
									<CardDescription>Slide-out panel</CardDescription>
								</CardHeader>
								<CardContent>
									<Sheet>
										<SheetTrigger asChild>
											<Button variant="outline">Open Sheet</Button>
										</SheetTrigger>
										<SheetContent>
											<SheetHeader>
												<SheetTitle>Edit profile</SheetTitle>
												<SheetDescription>
													Make changes to your profile here. Click save when you&apos;re done.
												</SheetDescription>
											</SheetHeader>
											<div className="grid gap-4 py-4">
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="name" className="text-right">
														Name
													</Label>
													<Input id="name" value="Pedro Duarte" className="col-span-3" />
												</div>
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="username" className="text-right">
														Username
													</Label>
													<Input id="username" value="@peduarte" className="col-span-3" />
												</div>
											</div>
										</SheetContent>
									</Sheet>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Drawer</CardTitle>
									<CardDescription>Bottom drawer component</CardDescription>
								</CardHeader>
								<CardContent>
									<Drawer>
										<DrawerTrigger asChild>
											<Button variant="outline">Open Drawer</Button>
										</DrawerTrigger>
										<DrawerContent>
											<DrawerHeader>
												<DrawerTitle>Are you absolutely sure?</DrawerTitle>
												<DrawerDescription>This action cannot be undone.</DrawerDescription>
											</DrawerHeader>
											<div className="p-4 pb-0">
												<div className="flex items-center justify-center space-x-2">
													<Button variant="outline" className="flex-1">
														Cancel
													</Button>
													<Button className="flex-1">Continue</Button>
												</div>
											</div>
										</DrawerContent>
									</Drawer>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Menu Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Dropdown Menu</CardTitle>
									<CardDescription>Contextual menu options</CardDescription>
								</CardHeader>
								<CardContent>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline">Open Menu</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuLabel>My Account</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem>Profile</DropdownMenuItem>
											<DropdownMenuItem>Billing</DropdownMenuItem>
											<DropdownMenuItem>Team</DropdownMenuItem>
											<DropdownMenuItem>Subscription</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Context Menu</CardTitle>
									<CardDescription>Right-click context menu</CardDescription>
								</CardHeader>
								<CardContent>
									<ContextMenu>
										<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
											Right click here
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuItem>Back</ContextMenuItem>
											<ContextMenuItem>Forward</ContextMenuItem>
											<ContextMenuItem>Reload</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Menubar</CardTitle>
									<CardDescription>Application menu bar</CardDescription>
								</CardHeader>
								<CardContent>
									<Menubar>
										<MenubarMenu>
											<MenubarTrigger>File</MenubarTrigger>
											<MenubarContent>
												<MenubarItem>New Tab</MenubarItem>
												<MenubarItem>New Window</MenubarItem>
											</MenubarContent>
										</MenubarMenu>
										<MenubarMenu>
											<MenubarTrigger>Edit</MenubarTrigger>
											<MenubarContent>
												<MenubarItem>Undo</MenubarItem>
												<MenubarItem>Redo</MenubarItem>
											</MenubarContent>
										</MenubarMenu>
									</Menubar>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Navigation Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Navigation Menu</CardTitle>
									<CardDescription>Main navigation component</CardDescription>
								</CardHeader>
								<CardContent>
									<NavigationMenu>
										<NavigationMenuList>
											<NavigationMenuItem>
												<NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
												<NavigationMenuContent>
													<div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
														<div className="row-span-3">
															<NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
																<div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
																<p className="text-sm leading-tight text-muted-foreground">
																	Beautifully designed components built with Radix UI and Tailwind
																	CSS.
																</p>
															</NavigationMenuLink>
														</div>
													</div>
												</NavigationMenuContent>
											</NavigationMenuItem>
											<NavigationMenuItem>
												<NavigationMenuLink>Documentation</NavigationMenuLink>
											</NavigationMenuItem>
										</NavigationMenuList>
									</NavigationMenu>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Breadcrumb</CardTitle>
									<CardDescription>Navigation breadcrumb trail</CardDescription>
								</CardHeader>
								<CardContent>
									<Breadcrumb>
										<BreadcrumbList>
											<BreadcrumbItem>
												<BreadcrumbLink href="/">Home</BreadcrumbLink>
											</BreadcrumbItem>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbLink href="/components">Components</BreadcrumbLink>
											</BreadcrumbItem>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
											</BreadcrumbItem>
										</BreadcrumbList>
									</Breadcrumb>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Data Display</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Table</CardTitle>
									<CardDescription>Tabular data display</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Email</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>John Doe</TableCell>
												<TableCell>
													<Badge variant="outline">Active</Badge>
												</TableCell>
												<TableCell>john@example.com</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>Jane Smith</TableCell>
												<TableCell>
													<Badge variant="secondary">Inactive</Badge>
												</TableCell>
												<TableCell>jane@example.com</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Pagination</CardTitle>
									<CardDescription>Page navigation controls</CardDescription>
								</CardHeader>
								<CardContent>
									<Pagination>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious href="#" />
											</PaginationItem>
											<PaginationItem>
												<PaginationLink href="#">1</PaginationLink>
											</PaginationItem>
											<PaginationItem>
												<PaginationLink href="#" isActive>
													2
												</PaginationLink>
											</PaginationItem>
											<PaginationItem>
												<PaginationLink href="#">3</PaginationLink>
											</PaginationItem>
											<PaginationItem>
												<PaginationNext href="#" />
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Feedback Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Alert</CardTitle>
									<CardDescription>Status and notification alerts</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<Alert>
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>Heads up!</AlertTitle>
										<AlertDescription>
											You can add components to your app using the cli.
										</AlertDescription>
									</Alert>
									<Alert variant="destructive">
										<XCircle className="h-4 w-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>
											Your session has expired. Please log in again.
										</AlertDescription>
									</Alert>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Loading States</CardTitle>
									<CardDescription>Skeleton and loading indicators</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Skeleton className="h-4 w-[250px]" />
										<Skeleton className="h-4 w-[200px]" />
										<Skeleton className="h-4 w-[150px]" />
									</div>
									<div className="flex items-center space-x-4">
										<Skeleton className="h-12 w-12 rounded-full" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-[250px]" />
											<Skeleton className="h-4 w-[200px]" />
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Advanced Components</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Hover Card</CardTitle>
									<CardDescription>Rich hover preview</CardDescription>
								</CardHeader>
								<CardContent>
									<HoverCard>
										<HoverCardTrigger asChild>
											<Button variant="link">@nextjs</Button>
										</HoverCardTrigger>
										<HoverCardContent className="w-80">
											<div className="flex justify-between space-x-4">
												<Avatar>
													<AvatarImage src="https://github.com/vercel.png" />
													<AvatarFallback>VC</AvatarFallback>
												</Avatar>
												<div className="space-y-1">
													<h4 className="text-sm font-semibold">@nextjs</h4>
													<p className="text-sm">
														The React Framework – created and maintained by @vercel.
													</p>
													<div className="flex items-center pt-2">
														<Calendar className="mr-2 h-4 w-4 opacity-70" />
														<span className="text-xs text-muted-foreground">
															Joined December 2021
														</span>
													</div>
												</div>
											</div>
										</HoverCardContent>
									</HoverCard>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Carousel</CardTitle>
									<CardDescription>Image and content carousel</CardDescription>
								</CardHeader>
								<CardContent>
									<Carousel className="w-full max-w-xs">
										<CarouselContent>
											{Array.from({ length: 5 }).map((_, index) => (
												<CarouselItem key={index}>
													<div className="p-1">
														<Card>
															<CardContent className="flex aspect-square items-center justify-center p-6">
																<span className="text-4xl font-semibold">{index + 1}</span>
															</CardContent>
														</Card>
													</div>
												</CarouselItem>
											))}
										</CarouselContent>
										<CarouselPrevious />
										<CarouselNext />
									</Carousel>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Layout & Utility</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Scroll Area</CardTitle>
									<CardDescription>Custom scrollable area</CardDescription>
								</CardHeader>
								<CardContent>
									<ScrollArea className="h-[200px] w-full rounded-md border p-4">
										<div className="space-y-2">
											{Array.from({ length: 20 }).map((_, index) => (
												<div key={index} className="text-sm">
													Item {index + 1}
												</div>
											))}
										</div>
									</ScrollArea>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Aspect Ratio</CardTitle>
									<CardDescription>Maintain aspect ratio</CardDescription>
								</CardHeader>
								<CardContent>
									<AspectRatio ratio={16 / 9}>
										<div className="rounded-md bg-muted flex items-center justify-center">
											<span className="text-sm text-muted-foreground">16:9 Aspect Ratio</span>
										</div>
									</AspectRatio>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Separator</CardTitle>
									<CardDescription>Visual content separator</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="space-y-1">
												<h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
												<p className="text-sm text-muted-foreground">
													An open-source UI component library.
												</p>
											</div>
											<Separator className="my-4" />
											<div className="flex h-5 items-center space-x-4 text-sm">
												<div>Blog</div>
												<Separator orientation="vertical" />
												<div>Docs</div>
												<Separator orientation="vertical" />
												<div>Source</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Resizable</CardTitle>
									<CardDescription>Resizable panel layout</CardDescription>
								</CardHeader>
								<CardContent>
									<ResizablePanelGroup
										direction="horizontal"
										className="min-h-[200px] max-w-md rounded-lg border"
									>
										<ResizablePanel defaultSize={50}>
											<div className="flex h-full items-center justify-center p-6">
												<span className="font-semibold">One</span>
											</div>
										</ResizablePanel>
										<ResizableHandle />
										<ResizablePanel defaultSize={50}>
											<div className="flex h-full items-center justify-center p-6">
												<span className="font-semibold">Two</span>
											</div>
										</ResizablePanel>
									</ResizablePanelGroup>
								</CardContent>
							</Card>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Collapsible</h2>
						<div className="grid grid-cols-1 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Collapsible</CardTitle>
									<CardDescription>Expandable content sections</CardDescription>
								</CardHeader>
								<CardContent>
									<Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
										<div className="flex items-center justify-between space-x-4">
											<h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
											<CollapsibleTrigger asChild>
												<Button variant="ghost" size="sm">
													<Menu className="h-4 w-4" />
												</Button>
											</CollapsibleTrigger>
										</div>
										<div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
											@radix-ui/primitives
										</div>
										<CollapsibleContent className="space-y-2">
											<div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
												@radix-ui/colors
											</div>
											<div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
												@stitches/react
											</div>
										</CollapsibleContent>
									</Collapsible>
								</CardContent>
							</Card>
						</div>
					</section>
				</div>
			</div>
		</div>
	)
}
