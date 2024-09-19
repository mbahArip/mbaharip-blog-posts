---
title: UseURLState - Persist your state on URL
slug: useurlstate-persist-your-state-on-url
summary: ""
thumbnail: ""
thumbnail_x: ""
thumbnail_y: ""
tags: 
created_at: 2024-09-19T16:05:03+07:00
updated_at: 2024-09-19T17:42:54+07:00
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
type UpdateFunction<T> =
	| Partial<z.infer<T>>
	| ((prev: z.infer<T>) => Partial<z.infer<T>>);

type useURLStateReturnValue<T> = [
	z.infer<T>, 
	(state: UpdateFunction<T>) => void,
	() => void
]

type useURLStateOptions = {
	// Push will add to history, allowing back
	// While replace will not
	// Default to "replace"
	routerType: "push" | "replace";
}
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options?: useURLStateOptions
): useURLStateReturnValue<T> {

	return []
}
```

### Creating your Zod Schema
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

### Adding the state
After preparing the initial files, the types, and your filter Zod schema, now we can add the state to the hooks.

```tsx
// Type goes here...

export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options?: useURLStateOptions
): useURLStateReturnValue<T> {
	const router = useRouter();
	const sp = useSearchParams();
	const pathname = usePathname();

	// Memoize the value to make sure it only re-render when the schema changed
	// We will using this value to reset the url state
	// Since our schema have default value
	// If we provide empty object, it will have the default value on all keys
	const defaultState = useMemo<ZodInfer<T>>(
		() => schema.parse({}) as ZodInfer<T>,
		[schema]
	)

	// Our URL State
	// It should be taking all the initial values from current url search params
	const [urlState, setUrlState] = useState<ZodInfer<T>>(
		schema.parse(Object.fromEntries(sp.entries())) as ZodInfer<T>;
	)
	
	return []
}
```

You might wonder why do I assert the type on the `defaultState` and `urlState`
It because the `T` type we get will be returning `unknown`, and if I don't provide the `unknown` generic argument on the `T`, it will become `any` type.
But it should be safe, even when we parse the search params on `urlState`, it should only taking the keys that exist on our schema.

> **Note**
> If you have any better implementation on this, feel free to mention it on the comment section

### Add `updateState` function
After adding the state, now we can move on to making the update function.
It's pretty tricky, since we need to set it to the `urlState`, update the URL, and make sure to remove all state with default values.

First we need to update the `urlState`, it's pretty straightforward since it's the basic of React state update

```tsx
export default function useURLState<T extends z.ZodType<unknown>>(
	schema: T,
	options?: useURLStateOptions
): useURLStateReturnValue<T> {
	// State goes here...

	const onUpdateState = useCallback(
		() => {
			setUrlState((prev) => {
				const newState = typeof previous === "function" ? previous
			})
		},
		[defaultState, pathname, router, sp, schema]
	)
	
	return []
}
```

## Conclusion