---
title: Seeding DB using Drizzle ORM
slug: seeding-db-using-drizzle-orm
summary: Since their package still not available
thumbnail: "![[seeding-db-using-drizzle-orm.webp]]"
thumbnail_x: "0.5"
thumbnail_y: "0.5"
tags: PostgreSQL, Drizzle, Typescript
created_at: 2024-10-29T04:31:34+07:00
updated_at: 2024-10-29T05:37:23+07:00
---
> **NOTE**  
> As I wrote this article (2024/10/29), [data seeding documentation](https://orm.drizzle.team/docs/kit-seed-data) still not available

Currently I'm updating one of my project to a new database, with new feature and changed database structure.  
Because of this, I need to migrate all data from the old database to the new database.

and you guessed it, their `drizzle-seed` still not available.  

![Data seeding documentation preview](seeding-db-using-drizzle-orm-1.png)

So I need to write my own script to seed the database, and the script must:
- Easy to add new tables to seed
- Easy to add new data
- Flexibility to seed a single table or the whole table

Since this gonna be a short article, I'll only post the code and explaining it on the code itself.  
(I'll assume you already have the client configured and ready to use)

In this project **I'm using NextJS**, so I'll make the script inside the router handler to make it easier for me.

> **WARNING**  
> Make sure to actually secure the endpoint so it can't be accessed on prod  
> For me, I'm securing it via middleware to return 404 if it's on prod

`/src/app/api/dev/seed/[type]/route.ts`
```ts
import { PgTableWithColumns } from "drizle-orm/pg-core";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { tableAData, tableBData, tableCData } from "./data"; // All your data that need to be inserted

import { db } from "~/server/db";
import { tableAModel, tableBModel, tableCModel } from "~/server/db/models"; // Database table model

import { env } from "~/env";

type TableName = "tableA" | "tableB" | "tableC"
type TableWithColumns = pgTableWithColumns<{
	dialect: "pg";
	columns: {};
	schema: any;
	name: any
}>

// Create a map for the table model and data
// I can easily add new table here
const TableMap: Record<TableName, TableWithColumns> = {
	tableA: tableAModel,
	tableB: tableBModel,
	tableC: tableCModel
}
const DataMap: Record<TableName, object[]> = {
	tableA: tableAData,
	tableB: tableBData,
	tableC: tableCData
}

export async function GET(
	request: NextRequest,
	{ params: { type } }: { params: { type: string } }
) {
	try {
		// Basic guard to only allow this endpoint on dev
		if(env.NODE_ENV !== "development") {
			return new NextResponse(null, {
				status: 404
			});
		}

		// Check if type is valid
		if(!Object.keys(DataMap).includes(type) && type !== "all") {
			return NextResponse.json(
				{
					success: false,
					message: `Invalid ${type}`,
					available: Object.keys(DataMap)
				},
				{
					status: 400
				}
			);
		}
		// Add "all" to allow bulk seed
		const parsedType = type as "all" || TableName;
		
		// Will be used to fill table with data
		const force = new URL(request.nextUrl).searchParams.get("force");
		const isForced = ["true", "1", "t"].includes(
			force?.toLowerCase() ?? ""
		);

		const updated: string[] = [];
		const failed: { key: TableName; reason: string }[] = [];

		if(parsedType === "all") {
			await db.transaction(async (t) => {
				for (const key in DataMap) {
					// If you want to stop when there are failed seed
					// You can uncomment this
					
					// if(failed.length) {
					// 	 t.rollback();
					// 	 break;
					// }
					
					const currentTable = TableMap[key as TableName];
					const currentData = DataMap[key as TableName];
					
					if(!currentData.length) {
						failed.push({
							key: key as TableName,
							reason: `${key} data is empty. Skipping...`
						});
						continue;
					}
					
					// Check if the table already have data
					// If it's has, reject the request
					// If the user include search params 'force=true'
					// Then remove all the data to be filled with new data
					const isFilled = await t.select().from(currentTable).limit(1).execute();
					if(isFilled.length) {
						if(!isForced) {
							failed.push({
								key: key as TableName,
								reason: `${key} has data. Use \`force=true\` to fill it with new data.`
							});
							continue;
						}
						
						await t.delete(currentTable);
					}
					
					console.log(`[dev.seed.${key}] Inserting ${currentData.length} rows.`);
					await t.insert(currentTable).values(currentData).execute();
					updated.push(key);
				}
			})
			
			console.log(`[dev.seed.all] Seed finished`);
		} else {
			// Basically the same
			// But change the fail handling with throw error
			
			if(!DataMap[parsedType].length) {
				throw new Error(`${parsedType} data is empty.`)
			}
			
			const isFilled = await db.select().from(TableMap[parsedType]).limit(1).execute();
			if(isFilled.length) {
				if(!isForced) {
					throw new Error(
						`${parsedType} has data. Use \`force=true\` to fill it with new data.`
					);
				}
				
				await db.delete(TableMap[parsedType]);
			}
			
			await db.insert(TableMap[parsedType]).values(DataMap[parsedType]).execute();
		}
		
		return NextResponse.json(
			{
				success: true,
				message: `Successfully seed \`${parsedType}\``,
				updated: updated.length ? updated : undefined,
				failed: failed.length ? failed : undefined
			},
			{
				status: 201
			}
		)
	} catch (error) {
		// Basic error handling
		const e = error as Error;
		console.error(`[dev.seed.${type}] ${e.message}`)
		return NextResponse.json(
			{
				success: false,
				message: e.message,
				error: error
			},
			{
				status: 500
			}
		)
	}
}
```

And now you can seed the database either from your browser or terminal by using `curl` command

---

Seed a single table
```bash
curl localhost:3000/api/dev/seed/tableA
```

Seed all table
```bash
curl localhost:3000/api/dev/seed/all
```

Seed table even if table has data
```bash
curl localhost:3000/api/dev/seed/tableA?force=true
```