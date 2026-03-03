'use client'
import { PageTransition } from "@/components/common/layout/PageTransition"
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
export default function DashboardPage() {
    return (
        <PageTransition>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Title</h2>
                    <p className="text-muted-foreground">Subtitle</p>
                </div>
                <Suspense fallback={<DashboardSkeleton />}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Card 1</CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <rect width="20" height="14" x="2" y="5" rx="2" />
                                            <path d="M2 10h20" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{20}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Card 2</CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            className="h-4 w-4 text-muted-foreground"
                                        >
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{10}</div>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card 4</CardTitle>
                                    <CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum itaque labore perspiciatis mollitia. Pariatur reprehenderit, cum molestias voluptatum tempore excepturi, earum, nostrum ipsam quos voluptatibus commodi atque sunt quidem voluptate!</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                </CardContent>
                            </Card>
                            <div className="lg:hidden">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Card 3</CardTitle>
                                        <CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum itaque labore perspiciatis mollitia. Pariatur reprehenderit, cum molestias voluptatum tempore excepturi, earum, nostrum ipsam quos voluptatib</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="hidden lg:block">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Card 4</CardTitle>
                                        <CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum itaque labore perspiciatis mollitia. Pariatur reprehenderit, cum molestias voluptatum tempore excepturi, earum, nostrum ipsam quos voluptatibus commodi atque sunt quidem voluptate!</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card 5</CardTitle>
                                    <CardDescription>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum itaque labore perspiciatis mollitia. Pariatur reprehenderit, cum molestias voluptatum tempore excepturi, earum, nostrum ipsam quos voluptatibus commodi atque sunt quidem voluptate!</CardDescription>
                                </CardHeader>
                                <CardContent>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Suspense>
            </div>
        </PageTransition>
    )
}