import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface BlogPost {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    content: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

interface PaginatedPosts {
    data: BlogPost[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    posts: PaginatedPosts;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blog Posts',
        href: '/blog-posts',
    },
];

export default function Index({ posts }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            router.delete(`/blog-posts/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Posts" />
            <PageContainer>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Blog Posts</h1>
                            <p className="text-muted-foreground">
                                Manage your blog posts
                            </p>
                        </div>
                        <Link href="/blog-posts/create">
                            <Button>
                                <Plus className="mr-2 size-4" />
                                New Post
                            </Button>
                        </Link>
                    </div>

                    {posts.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex min-h-64 items-center justify-center">
                                <div className="text-center">
                                    <p className="mb-4 text-muted-foreground">
                                        No blog posts yet
                                    </p>
                                    <Link href="/blog-posts/create">
                                        <Button>
                                            <Plus className="mr-2 size-4" />
                                            Create your first post
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {posts.data.map((post) => (
                                <Card key={post.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle>
                                                    {post.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {post.published_at
                                                        ? `Published on ${format(
                                                              new Date(
                                                                  post.published_at,
                                                              ),
                                                              'PPP',
                                                          )}`
                                                        : 'Draft'}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/blog-posts/${post.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={`/blog-posts/${post.id}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(post.id)
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-2 text-muted-foreground">
                                            {post.content.substring(0, 200)}
                                            {post.content.length > 200
                                                ? '...'
                                                : ''}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </PageContainer>
        </AppLayout>
    );
}
