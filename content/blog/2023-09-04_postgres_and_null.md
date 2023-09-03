---
title: Postgres and Null Comparison
date: 2023-09-04T09:00:00.000Z
tags:
  - tutorial
  - postgres
slug: /postgres_and_null
featureImage: ../assets/2023_09_04/banner.png
---
I was recently reviewing a Ruby code for a colleague that had a function used to fetch some records from a PostgreSQL database. The function looks something like this:
```ruby
def new_users_count_after_activation(user)
	User.where(
		"company_id = ? AND created_at > ?",
		user.company_id,
		user.account_verified_at).
	count
end
```

This is a hypothetical function for the purpose of this post. The `account_verified_at` field can be `null` (or `nil` in Ruby), and when that happens, do you know how Postgres would respond to this query? If you already know, that is good. If not, this is what I will explain in this post 😉.

If `user.account_verified_at` is `nil`, then the SQL generated will be:
```sql
... WHERE company_id = :company_id AND created_at > NULL 
```

In PostgreSQL, a NULL value is a special value that represents a missing value.
- It is not equal to any other value, including itself.
- When you compare a NULL value to another value, the result is always NULL.

With that in mind, the SQL statement will essentially evaluate to:
```sql
... WHERE company_id = :company_id AND NULL
```
This will be evaluated as false for all records and, therefore, not return any results for this query. This scenario sounds like an unintended expected behaviour (Yay) because our core logic will not return users if the current user is not activated. But this could be the source of subtle bugs in other scenarios, especially when the query results are required to perform some critical business logic.

When using a dynamically typed language like ruby, it is hard to track whether or not values can be nullable. Typically, these languages employ type hints and comprehensive tests to ensure logic works as expected. However, we are all humans and inevitably prone to errors. Code Reviews can catch these extra potential error cases, so if you don't take code reviews seriously, you should. Cheers 🥂.

> There is also a potential gotcha here for newbies to PostgreSQL who are genuinely trying to query for all NULL values in a column. For example, say a query like:
> ```
> WHERE account_verified_at = NULL
> ```
> This will also evaluate to `NULL`  and end up returning empty results. You will want to use the `IS NULL` operator instead and do:
>  ```
>  WHERE account_verified_at IS NULL
>  ```


I hope this article helps you understand how PostgreSQL compares NULL values. If you have any questions, please feel free to comment below.

**In addition to the above, here are some other things to keep in mind about NULL values in PostgreSQL:**

- You cannot perform mathematical operations on NULL values.
- You cannot use NULL values in GROUP BY or DISTINCT queries.
- You can use the `COALESCE()` function to return a default value if a NULL value is encountered.

See this excellent article titled [PostgreSQL iS NULL](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-is-null/) for a more detailed explanation of NULL behaviours in PostgreSQL.