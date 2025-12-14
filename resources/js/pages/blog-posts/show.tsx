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
import { Edit, Trash2 } from 'lucide-react';

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

interface Props {
    post: BlogPost;
}

export default function Show({ post }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blog Posts',
            href: '/blog-posts',
        },
        {
            title: post.title,
            href: `/blog-posts/${post.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            router.delete(`/blog-posts/${post.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <PageContainer>
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-3xl">
                                    {post.title}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    {post.published_at ? (
                                        <>
                                            Published on{' '}
                                            {format(
                                                new Date(post.published_at),
                                                'PPP',
                                            )}{' '}
                                            by {post.user.name}
                                        </>
                                    ) : (
                                        <>
                                            Draft • Created on{' '}
                                            {format(
                                                new Date(post.created_at),
                                                'PPP',
                                            )}
                                        </>
                                    )}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/blog-posts/${post.id}/edit`}>
                                    <Button variant="outline" size="icon">
                                        <Edit className="size-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-neutral max-w-none dark:prose-invert">
                            {post.content.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </PageContainer>
        </AppLayout>
    );
}
