---
title: UseURLState - Persist your state on URL
slug: useurlstate-persist-your-state-on-url
summary: Type-safe URL state management using Zod
thumbnail: "![[useurlstate-persist-your-state-on-url.png]]"
thumbnail_x: "0.5"
thumbnail_y: "0.5"
tags: Nextjs, Zod, Typescript
created_at: 2024-09-19T16:05:03+07:00
updated_at: 2024-09-19T19:58:35+07:00
---
Saving state in URL is a common practice in web development, there a lot of benefits of doing so, such as sharing the state with others, bookmarking the page with the state, and more.  
This practice is especially useful to save the state of a filter, pagination, or any other state that can be represented as a query parameter.  
Usually, you can find this practice in e-commerce websites, where you can share the product list with a specific filter.  
## My Reasoning
While I'm working on a CMS project, I want to save the filter and pagination state in the URL.  
When it's only 1 or 2 pages, it's still easy to remember what kind of filter that can be used. But when it's a lot of pages, it's hard to remember what kind of filter can be used for each page, and I need to recheck the schema of the files again and again.

To make it easier for me (and probably for others), I decided to create a custom hook with Zod validation to make sure the state is correct, and also add autocomplete to make it easier to use.

You can follow this article to see how I do it, or go to the **Result section** to copy the hooks.

{{ data-toc }}

## Code Time
### Initial Hook File
First we need to create our base hook file on `/src/hooks` folder, you are free to name the hook whatever you want but I will name it `useURLState`.  
The path should be `/src/hooks/useURLState.tsx` now.

```tsx
"use client";

export default function useURLState() {

	return []
}
```

> **Note**  
> You are free to return an array or object, just make sure to update the returning types

Then we need to add types for the arguments and the returning value.  
For the arguments, I make it to accept 2 values:
- **Zod Schema**, this will be used for the validation
- **Options**, an optional object contains several options to change how the hook behave  
And for the returning value, I make it to return an array or tuple to make it feels like React `useState`
- **Index 0**, returning the state value
- **Index 1**, returning a function to update the state value
- **Index 2**, returning a function to reset the state to the default value  
Feel free to change it to an object instead

```tsx
"use client";

import { z } from 'zod';

// Make the update accept direct value
// Or a function where it have previous value
// This to make it feels like using useState
type UpdateFunction<T extends z.ZodType<unknown>> =
	| Partial<z.infer<T>>
	| ((prev: z.infer<T>) => Partial<z.infer<T>>);

type useURLStateReturnValue<T extends z.ZodType<unknown>> = [
	z.infer<T>, 
	(state: UpdateFunction<T>) => void,
	() => void
]

type useURLStateOptions = {
	// Push will add to history, allowing back
	// While replace will not
	// Default to "replace"
	routerBehavior?: "push" | "replace";
}
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options: useURLStateOptions = {}
): useURLStateReturnValue<T> {

	return []
}
```

### Creating Your Zod Schema
Before adding state and other to the hook, we need to create our filter schema first.  
You are free to save the files anywhere you want, but I will save it on `/src/schema/dataA.ts` which contains all schema that related to `dataA`

Now you can insert all things you want to add as filter to the schema, but make sure to add `default()` function to all of your keys.  
It to make sure we can get the default state value by using Zod parse function.

For this example, I will use the most basic filtering schema.

```ts
import { z } from 'zod';

export const SchemaDataAFilter = z.object({
	q: z.string().default(""),
	page: z.coerce.number().default(1),
	pageSize: z.coerce.number().default(10),
	orderBy: z.enum(["name", "updatedAt"]).default("updatedAt"),
	orderDir: z.enum(["asc", "desc"]).default("desc")
})
```

### Adding the State
After preparing the initial files, the types, and your filter Zod schema, now we can add the state to the hooks.

```tsx
// Type goes here...

export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options: useURLStateOptions = {}
): useURLStateReturnValue<T> {
	const router = useRouter();
	const sp = useSearchParams();
	const pathname = usePathname();

	// Set the default options value
	const { routerBehavior = "replace" } = options;

	// Memoize the value to make sure it only re-render when the schema changed
	// We will using this value to reset the url state
	// Since our schema have default value
	// If we provide empty object, it will have the default value on all keys
	const defaultState = useMemo<z.infer<T>>(
		() => schema.parse({}) as z.infer<T>,
		[schema]
	)

	// Our URL State
	// It should be taking all the initial values from current url search params
	const [urlState, setUrlState] = useState<z.infer<T>>(
		schema.parse(Object.fromEntries(sp.entries())) as z.infer<T>
	)
	
	return []
}
```

You might wonder why do I assert the type on the `defaultState` and `urlState`  
It because the `T` type we get will be returning `unknown`, and if I don't provide the `unknown` generic argument on the `T`, it will become `any` type.  
But it should be safe, even when we parse the search params on `urlState`, it should only taking the keys that exist on our schema.

> **Note**  
> If you have any better implementation on this, feel free to mention it on the comment section

### Add `updateState` Function
After adding the state, now we can move on to making the update function.  
It's pretty tricky, since we need to set it to the `urlState`, update the URL, and make sure to remove all state with default value.

First we need to update the `urlState`, it's pretty straightforward since it's the basic of React state update

```tsx
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options: useURLStateOptions = {}
): useURLStateReturnValue<T> {
	// State goes here...

	const onUpdateState = useCallback(
		(previous: UpdateFunction<T>) => {
			setUrlState((prev) => {
				const newPartialState = typeof previous === "function" ? previous(prev) : previous;
				const newState = {
					...(prev as Record<string, unknown>),
					...(newPartialState as Record<string,unknown>)
				};

				const parsedState = schema.safeParse(newState);
				if(!parsedState.success) {
					// Add your error handler here
					console.error("Failed to update state");
					console.error(parsedState.error.flatten());
					return prev;
				}

				return parsedState.data as z.infer<T>
			})
		},
		[defaultState, pathname, router, routerBehavior, schema, sp]
	)
	
	return []
}
```

With this we have basic state update, now we need to update the URL and remove the state if it's default value.

```tsx
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options: useURLStateOptions = {}
): useURLStateReturnValue<T> {
	// State goes here...

	const onUpdateState = useCallback(
		(previous: UpdateFunction<T>) => {
			setUrlState((prev) => {
				const newPartialState = typeof previous === "function" ? previous(prev) : previous;
				const newState = {
					...(prev as Record<string, unknown>),
					...(newPartialState as Record<string,unknown>)
				};

				const parsedState = schema.safeParse(newState);
				if(!parsedState.success) {
					// Add your error handler here
					console.error("Failed to update state");
					console.error(parsedState.error.flatten());
					return prev;
				}

				const searchParams = new URLSearchParams(sp.toString());
				Object.keys(newPartialState).forEach(
					(key) => {
						// Check if the key is undefined
						// or equal to default value
						// If so, then remove it from the search params
						if(
							newState[key] === undefined ||
							String(newState[key]) === String(defaultState[key as keyof z.infer<T>])
						) {
							searchParams.delete(key);
						} else {
							searchParams.set(key, String(newState[key]))
						}
					}
				)
				
				// Assign the search params to current URL
				const url = new URL(pathname, window.location.href);
				url.search = searchParams.toString();
				if(routerBehavior === "replace") {
					router.replace(url.toString(), { scroll: false })
				} else {
					router.push(url.toString(), { scroll: false })
				}

				return parsedState.data as z.infer<T>
			})
		},
		[defaultState, pathname, router, routerBehavior, schema, sp]
	)
	
	return []
}
```

### Add `resetState` Function
Now we create `resetState` function that will be useful if you want to reset the state with a single click.  
You can skip this step if you don't need it.

Basically we only need to remove all keys that exist on our schema, update the state, then update the URL

```tsx
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options: useURLStateOptions = {}
): useURLStateReturnValue<T> {
	// State goes here...

	const onResetState = useCallback(
		() => {
			setUrlState(() => {
				const searchParams = new URLSearchParams(sp.toString());
				for(const key of Object.keys(defaultState as Record<string, unknown>)) {
					searchParams.delete(key);
				}
				
				// Assign the search params to current URL
				const url = new URL(pathname, window.location.href);
				url.search = searchParams.toString();
				if(routerBehavior === "replace") {
					router.replace(url.toString(), { scroll: false })
				} else {
					router.push(url.toString(), { scroll: false })
				}

				return defaultState;
			})
		},
		[defaultState, pathname, router, sp, routerBehavior]
	)
	
	return []
}
```

### Handle URL Change Using `useEffect`
Now the important part is to handle URL change from browser navigation or manual URL input.  
We're gonna using `useEffect` to make it run every time `defaultState`, `schema`, or `searchParams` changed.

```tsx
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options: useURLStateOptions = {}
): useURLStateReturnValue<T> {
	// State goes here...

	useEffect(
		() => {
			const handleRouteChange = () => {
				const searchParams = new URLSearchParams(sp.toString());
				const urlState: Record<string, unknown> = {};
				for(const key of Object.keys(defaultState as Record<string, unknown>)) {
					const value = searchParams.get(key);
					if(value) {
						try {
							urlState[key] = value;
						} catch(error) {
							console.error(`Failed to parse value for ${key}`);
						}
					} else {
						urlState[key] = defaultState[key as keyof z.infer<T>];
					}
				}

				const parsedState = schema.safeParse(urlState);
				if(!parsedState.success) {
					// Your error handling
					console.error("Failed to parse URL State");
					console.error(parsedState.error.flatten());
					setUrlState(defaultState);
				} else {
					setUrlState(parsedState.data as z.infer<T>);
				}
			}

			window.addEventListener('popstate', handleRouteChange);
			// Cleanup when unmount
			return () => window.removeEventListener('popstate', handleRouteChange);
		},
		[defaultState, schema, sp]
	)
	
	return []
}
```

### Final Code
It's completed, now all you need is to return the state, update function, and reset function.  
And then you can use it on your project.

```tsx
"use client";

import { type z } from 'zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Make the update accept direct value
// Or a function where it have previous value
// This to make it feels like using useState
type UpdateFunction<T extends z.ZodType<unknown>> =
	| Partial<z.infer<T>>
	| ((prev: z.infer<T>) => Partial<z.infer<T>>);

type useURLStateReturnValue<T extends z.ZodType<unknown>> = [
	z.infer<T>, 
	(state: UpdateFunction<T>) => void,
	() => void
]

type useURLStateOptions = {
	// Push will add to history, allowing back
	// While replace will not
	// Default to "replace"
	routerBehavior?: "push" | "replace";
}
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options: useURLStateOptions = {}
): useURLStateReturnValue<T> {
	const router = useRouter();
	const sp = useSearchParams();
	const pathname = usePathname();

	// Set the default options value
	const { routerBehavior = "replace" } = options;

	// Memoize the value to make sure it only re-render when the schema changed
	// We will using this value to reset the url state
	// Since our schema have default value
	// If we provide empty object, it will have the default value on all keys
	const defaultState = useMemo<z.infer<T>>(
		() => schema.parse({}) as z.infer<T>,
		[schema]
	)

	// Our URL State
	// It should be taking all the initial values from current url search params
	const [urlState, setUrlState] = useState<z.infer<T>>(
		schema.parse(Object.fromEntries(sp.entries())) as z.infer<T>
	)

	const onUpdateState = useCallback(
		(previous: UpdateFunction<T>) => {
			setUrlState((prev) => {
				const newPartialState = typeof previous === "function" ? previous(prev) : previous;
				const newState = {
					...(prev as Record<string, unknown>),
					...(newPartialState as Record<string,unknown>)
				};

				const parsedState = schema.safeParse(newState);
				if(!parsedState.success) {
					// Add your error handler here
					console.error("Failed to update state");
					console.error(parsedState.error.flatten());
					return prev;
				}

				const searchParams = new URLSearchParams(sp.toString());
				Object.keys(newPartialState).forEach(
					(key) => {
						// Check if the key is undefined
						// or equal to default value
						// If so, then remove it from the search params
						if(
							newState[key] === undefined ||
							String(newState[key]) === String(defaultState[key as keyof z.infer<T>])
						) {
							searchParams.delete(key);
						} else {
							searchParams.set(key, String(newState[key]))
						}
					}
				)
				
				// Assign the search params to current URL
				const url = new URL(pathname, window.location.href);
				url.search = searchParams.toString();
				if(routerBehavior === "replace") {
					router.replace(url.toString(), { scroll: false })
				} else {
					router.push(url.toString(), { scroll: false })
				}

				return parsedState.data as z.infer<T>
			})
		},
		[defaultState, pathname, router, routerBehavior, schema, sp]
	)
	
	const onResetState = useCallback(
		() => {
			setUrlState(() => {
				const searchParams = new URLSearchParams(sp.toString());
				for(const key of Object.keys(defaultState as Record<string, unknown>)) {
					searchParams.delete(key);
				}
				
				// Assign the search params to current URL
				const url = new URL(pathname, window.location.href);
				url.search = searchParams.toString();
				if(routerBehavior === "replace") {
					router.replace(url.toString(), { scroll: false })
				} else {
					router.push(url.toString(), { scroll: false })
				}

				return defaultState;
			})
		},
		[defaultState, pathname, router, sp, routerBehavior]
	)
	
	useEffect(
		() => {
			const handleRouteChange = () => {
				const searchParams = new URLSearchParams(sp.toString());
				const urlState: Record<string, unknown> = {};
				for(const key of Object.keys(defaultState as Record<string,unknown>)) {
					const value = searchParams.get(key);
					if(value) {
						try {
							urlState[key] = value;
						} catch(error) {
							console.error(`Failed to parse value for ${key}`, error);
						}
					} else {
						urlState[key] = defaultState[key as keyof z.infer<T>];
					}
				}

				const parsedState = schema.safeParse(urlState);
				if(!parsedState.success) {
					// Your error handling
					console.error("Failed to parse URL State");
					console.error(parsedState.error.flatten());
					setUrlState(defaultState);
				} else {
					setUrlState(parsedState.data as z.infer<T>);
				}
			}

			window.addEventListener('popstate', handleRouteChange);
			// Cleanup when unmount
			return () => window.removeEventListener('popstate', handleRouteChange);
		},
		[defaultState, schema, sp]
	)
	
	return [urlState, onUpdateState, onResetState]
}
```

#### Example
Here are the basic example of how you can use it on your project.

```tsx
"use client";

import useURLState from '~/hooks/useURLState';
import { SchemaDataAFilter } from '~/schema/DataA';

export default function YourPageOrComponent() {
	const [filter, setFilter, resetFilter] = useURLState(SchemaDataAFilter)

	return (
		<div>
			<pre>
				{JSON.stringify(filter, null, 2)}
			</pre>

			{/* Update directly */}
			<Button onClick={
				() => {
					const rng = Math.floor(Math.random() * 10 + 1);
					setFilter({
						page: rng
					});
				}
			}>
				Randomize Page
			</Button>
			{/* Using previous value */}
			<Button onClick={
				() => {
					setFilter(
						(prev) => ({
							...prev,
							orderDir: prev === "asc" ? "desc" : "asc"
						})
					);
				}
			}>
				Toggle Sort Direction
			</Button>

			{/* Reset the filter state */}
			<Button onClick={resetFilter}>
				Reset Filter
			</Button>
		</div>
	)
}
```

![Autocomplete on accessing value](useurlstate-persist-your-state-on-url-4.png)  
![Autocomplete on updating filter](useurlstate-persist-your-state-on-url-3.png)  
![Autocomplete on previous value](useurlstate-persist-your-state-on-url-2.png)

## Extra Words
Thank you for reading this article, hope it will help.  
After making several Content Management that needed this feature, I will absolutely use this hook for my next project.  
This also help me to understand more about typescript and things.

And as I mention above, if you have suggestion to improve this, you can mention it on the comment section.
