import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[...Array(2)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-7 w-24 mb-1" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40 mb-1" />
                            <Skeleton className="h-4 w-60" />
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Skeleton className="h-55 w-full" />
                        </CardContent>
                    </Card>
                    <div className="lg:hidden">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40 mb-1" />
                                <Skeleton className="h-4 w-60" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-30 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="hidden lg:block">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40 mb-1" />
                                <Skeleton className="h-4 w-60" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-30 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40 mb-1" />
                            <Skeleton className="h-4 w-60" />
                        </CardHeader>
                        <CardContent>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                        <div>
                                            <Skeleton className="h-4 w-24 mb-1" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}