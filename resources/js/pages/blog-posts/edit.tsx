import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';

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

export default function Edit({ post }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blog Posts',
            href: '/blog-posts',
        },
        {
            title: post.title,
            href: `/blog-posts/${post.id}`,
        },
        {
            title: 'Edit',
            href: `/blog-posts/${post.id}/edit`,
        },
    ];

    const formatDateTimeLocal = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, "yyyy-MM-dd'T'HH:mm");
    };

    const { data, setData, put, processing, errors } = useForm({
        title: post.title,
        content: post.content,
        published_at: formatDateTimeLocal(post.published_at),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/blog-posts/${post.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${post.title}`} />
            <PageContainer>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Blog Post</CardTitle>
                        <CardDescription>
                            Update your blog post
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Enter post title"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData('content', e.target.value)
                                    }
                                    placeholder="Write your post content..."
                                    rows={10}
                                />
                                {errors.content && (
                                    <p className="text-sm text-destructive">
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="published_at">
                                    Publish Date (Optional)
                                </Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) =>
                                        setData('published_at', e.target.value)
                                    }
                                />
                                <p className="text-sm text-muted-foreground">
                                    Leave empty to save as draft
                                </p>
                                {errors.published_at && (
                                    <p className="text-sm text-destructive">
                                        {errors.published_at}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Post'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </PageContainer>
        </AppLayout>
    );
}
