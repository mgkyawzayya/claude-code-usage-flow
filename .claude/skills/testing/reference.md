# Testing Reference

## Pest Testing Patterns

### Feature Test
```php
<?php

use App\Models\User;
use App\Models\Post;

test('user can create a post', function () {
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Test Post',
            'content' => 'Test content',
        ]);
    
    $response->assertRedirect('/posts');
    $this->assertDatabaseHas('posts', [
        'title' => 'Test Post',
        'user_id' => $user->id,
    ]);
});

test('guest cannot create a post', function () {
    $this->post('/posts', ['title' => 'Test'])
        ->assertRedirect('/login');
});

test('validation fails with empty title', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
        ->post('/posts', ['title' => ''])
        ->assertSessionHasErrors('title');
});
```

### Unit Test
```php
<?php

use App\Services\SlugGenerator;

test('generates slug from title', function () {
    $generator = new SlugGenerator();
    
    expect($generator->generate('Hello World'))
        ->toBe('hello-world');
});

test('handles special characters', function () {
    $generator = new SlugGenerator();
    
    expect($generator->generate('Test & Demo!'))
        ->toBe('test-demo');
});
```

### Factories
```php
<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraphs(3, true),
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(['published_at' => now()]);
    }

    public function draft(): static
    {
        return $this->state(['published_at' => null]);
    }
}
```

## Vitest + React Testing Library

### Component Test
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostForm } from './PostForm';

describe('PostForm', () => {
    it('submits form with valid data', async () => {
        const onSubmit = vi.fn();
        render(<PostForm onSubmit={onSubmit} />);
        
        await userEvent.type(
            screen.getByLabelText(/title/i),
            'Test Post'
        );
        await userEvent.click(
            screen.getByRole('button', { name: /submit/i })
        );
        
        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Test Post',
        });
    });
    
    it('shows validation error for empty title', async () => {
        render(<PostForm onSubmit={vi.fn()} />);
        
        await userEvent.click(
            screen.getByRole('button', { name: /submit/i })
        );
        
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
});
```

### Hook Test
```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
    it('initializes with default value', () => {
        const { result } = renderHook(() => useCounter());
        expect(result.current.count).toBe(0);
    });

    it('increments count', () => {
        const { result } = renderHook(() => useCounter());
        act(() => result.current.increment());
        expect(result.current.count).toBe(1);
    });
});
```

## Test Commands

```bash
# Laravel/Pest
composer test                        # Run all tests
php artisan test --filter=PostTest   # Run specific test
php artisan test --coverage          # With coverage
php artisan test --parallel          # Parallel execution

# Vitest
npm run test                         # Run all tests
npm run test:watch                   # Watch mode
npm run test:coverage                # With coverage
```
