<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    public function index(): Response
    {
        $posts = BlogPost::with('user')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('blog-posts/index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('blog-posts/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'published_at' => ['nullable', 'date'],
        ]);

        $validated['user_id'] = auth()->id();

        BlogPost::create($validated);

        return redirect()->route('blog-posts.index')
            ->with('success', 'Blog post created successfully.');
    }

    public function show(BlogPost $blogPost): Response
    {
        $blogPost->load('user');

        if ($blogPost->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('blog-posts/show', [
            'post' => $blogPost,
        ]);
    }

    public function edit(BlogPost $blogPost): Response
    {
        if ($blogPost->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('blog-posts/edit', [
            'post' => $blogPost,
        ]);
    }

    public function update(Request $request, BlogPost $blogPost)
    {
        if ($blogPost->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'published_at' => ['nullable', 'date'],
        ]);

        $blogPost->update($validated);

        return redirect()->route('blog-posts.index')
            ->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blogPost)
    {
        if ($blogPost->user_id !== auth()->id()) {
            abort(403);
        }

        $blogPost->delete();

        return redirect()->route('blog-posts.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}
