---
title: The differences between "Type Alias" and "New Types" in Go
date: 2024-09-02T09:00:00.00Z
tags:
  - golang
  - learning
slug: /go_alias_vs_new_types
featureImage: ../assets/2024_09_02/banner.jpg
---
As a Golang developer, you've probably encountered two seemingly similar ways to define types:

```go
type ID = string
type ID string
```

At first glance, they might look almost identical. But don't be fooled! These two declarations have distinctly different behaviors that can significantly impact your code. Let's dive into the nitty-gritty of type aliases and new type declarations in Go.

## Type Alias

```go
type ID = string
```

This is a type alias. Think of it as creating a nickname for an existing type. Here's what you need to know:

- `ID` and `string` are entirely interchangeable.
- No type conversion is needed when using them together.
- `ID` inherits all methods of `string`.
    

Type aliases are great for gradual code refactoring or when you need complete compatibility with the original type.

## New Type Declaration

```go
type ID string
```

This creates a brand new type based on `string`. It's like having a child that looks like its parent but has its own identity. Key points:

- `ID` and `string` are distinct types.
- Explicit conversion is required to use them interchangeably.
- `ID` doesn't automatically inherit `string` methods (but can be converted to use them).

New type declarations are perfect for creating domain-specific types, adding methods, or enforcing stricter type safety.

## Seeing Them in Action

Let's look at a quick example to illustrate the difference:
```go
// Type alias
type AliasID = string
var a AliasID = "123"
var s string = a // No conversion needed

// New type
type NewID string
var n NewID = "456"
var t string = string(n) // Explicit conversion required
```

## When to Use Each

Choose your type definition based on your specific needs. I've personally found that I use Type Alias when trying to refactor a codebase to use a Custom domain type, especially when the type does not require any additional specifics.
```go
// Use type alias for refactoring or full compatibility
type OldUserID = string
```

And I declare a new type for domain-specific types that need additional logic for easy of usage and added safety:
```go
type NewUserID string
func (id NewUserID) Validate() bool {
    return len(id) > 0
}
```

The choice between type aliases and new type declarations in Go is more than a syntactic preference. It's a decision that affects type safety, code organization, and even the conceptual model of your program.

By understanding the nuances between these two definitions, you can write more intentional, transparent, and safer Go code. So the next time you're about to define a type, pause for a moment and ask yourself: do I need a chameleon or a unique snowflake?

Happy coding, and may your codes never panic!

> This content was first posted on my Twitter Account. If you like content like this, you should follow me there [@perfectmak](https://x.com/Perfectmak/articles). I post about building reliable software, automation, and performance testing.