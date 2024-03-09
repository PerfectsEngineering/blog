---
title: Exploring Go's Functional Iterators (Range-over Functions)
date: 2024-03-09T09:00:00.00Z
tags:
  - golang
  - rangefunc
  - tutorial
slug: /go_range_over_funcs
featureImage: ../assets/2024_03_09/banner.jpg
---

Go's latest version, 1.22, introduces some exciting changes to the language. One of these changes includes an experimental function called "**range-over-function iterators**" that has a vast potential to make Go's range loops more expressive and extensible. It could also make Go more complex.
I've been exploring this new `range` iterators feature and I'm writing this article to share some of my thoughts.

<collapsible title="What are range-over-function iterators?">

## First, what are range-over-function iterators?

Function Iterators is a language feature the Go team is considering for the future of Go, and so in the 1.22 release, it is experimental and requires the `GOEXPERIMENT=rangefunc` enabled to work. When enabled, it allows importing the `iter` package, which exports some new types that allow writing custom `range` loops like:

```go
var f iter.Seq[ValueType]
for v := range f {
	...
}

// or in case you want to return two values
var f iter.Seq2[KeyType, ValueType]
for k, v := range f {
	...
}
```

The `iter.Seq` and `iter.Seq2` are type aliases for a function that accepts a `yield` function as it's input:

```go
type Seq[V any] func(yield func(V) bool)
type Seq2[K, V any] func(yield func(K, V) bool)
```

The `yield` function then needs to be called to return values for each iteration of the range loop. Let me use an example to illustrate how this all pieces together. Check out this function that generates a sequence of numbers from `start` to `end` with `step` intervals:

```go
func Range(start, end, step int) iter.Seq[int] {
	return func(yield func(int) bool) {
		for i := start; i < end; i += step {
			if !yield(i) {
				// yield returns false when the sequence needs to be cancelled
				// for example, when the user code calls `break`. A call to yield
				// after it returns false will cause a panic to be thrown.
				return
			}
		}
	}
}
```

This can then be used as such:

```go
for i := range Range(0, 10, 2) {
	fmt.Println(i)
}
```

You can the Go <a href="https://go.dev/wiki/RangefuncExperiment" target="_blank">Wiki about Function Iterators</a> to understand how this works behind the hood. Now, on to my explorations.

</collapsible>

<br/>

> "**range-over function iterators**" is a mouthful, so I'll be referring to them simply as "**Function Iterators**" throughout this article.
## Generating and Composing Sequences

If Function Iterators become standardized in Go, we will get a bunch of utility functions that support Function Iterators. The Go announcement wiki gives some hints at standard library functions that could merit returning iterators like `strings.Split`.

So, I started out by exploring some of this. The first I could think of was an infinite number generator. What if I wanted to write a Go Code like:

```go
start := 1; step := 5
for i := range ToInfinity(start, step) {
	// logic go here and then break when I'm done
}
```
This will especially be useful in situations where you have to use a forever loop as a retry mechanism and want to keep track of the number of iterations.

The implementation for `ToInfinity` is:

```go
// ToInfinity returns a sequence of integers from start to infinity with step increment.
func ToInfinity(start, step int) iter.Seq[int] {
	if step > 0 {
		// Forward iteration from start
		return func(yield func(int) bool) {
			for i := start; ; i += step {
				if !yield(i) {
					return
				}
			}
		}
	}

	if step < 0 {
		// Backward iteration from start
		return func(yield func(int) bool) {
			for i := start; ; i += step {
				if !yield(i) {
					return
				}
			}
		}
	}

	return func(yield func(int) bool) {
		// yield only the 'start' value when step 0
		yield(start)
	}
}
```

Notice how the implementation can also allow looping in the negative direction. The iterator's code isn't the most succinct, but this is the price you pay for this new feature's simplicity.

Naturally (or maybe not 😅), the question that comes to mind is, what if I only wanted to loop between a `start` and an `end` value? This is particularly interesting to me because I also wanted to explore the composability of these new `iter.Seq` types using the `iter.Pull()` functions that were introduced alongside them. So let's say I wanted to be able to write a loop like:
```go
start := 0; end := 10; step := 2;
for i := range Between(start, end, step) {
	// logic goes here
}
```

I wanted to achieve this by re-using the `ToInfinity()` iterator function from earlier. The implementation of `Between()` will look like this:

```go
func Between(start, end, step int) iter.Seq[int] {
	// use iter.Pull to be able to fetch values from ToInfinity's sequence
	next, stop := iter.Pull(ToInfinity(start, step))

	return func(yield func(int) bool) {
		defer stop()
		for {
			value, ok := next()
			// check to be sure that ToInfinity's sequence still has values
			if !ok {
				return
			}

			// check if bounds have been met and return
			if step > 0 && value > end {
				return
			}
			// check for bound for negative step values
			if step < 0 && value < end {
				return
			}

			// yield the next value since we are still within range
			if !yield(value) {
				return
			}
		}
	}
}
```

So far, these examples are great, but we can quickly achieve them with the current `range` for-loops that are part of the base Go language; you don't get much other than the composability from this. This brings me to the next set of things I set out to explore.
## Simplifying Aggregation Operations

Have you ever had to fetch some data from a database using the default `database/sql` library and written an ugly for loop? You can argue there are ORM to handle that now, so I'll use BigQuery as an example, because there are not many great ORM's for BigQuery.
I've been working with BigQuery a lot, and sometimes, I want to execute a query and marshal the results into a struct. Usually, this would be done like so:

```go
query := bigQueryClient.Query("SELECT * FROM dataset1.table_a")
iter, err := query.Read(ctx)
if err != nil {
	return nil, err
}

// Ugly loop: Iterate over the results and append them to the array
for {
	var row Row
	err := iter.Next(&row)
	if err == iterator.Done {
		break
	}
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve row: %v", err)
	}

	fmt.Printf("Id: %d, Name: %s", row.Id, row.Name)
}
```

What If I wanted to simplify this loop without tracking the `iterator.Done` error? Function Iterators coupled with Generics make this possible. We can have a loop that returns the row value and also returns an error like this:

```go
// Better loop: returns rows and error, if it occurs.
for row, err := range BqQuery[Row](
	ctx,
	bigQueryClient.Query("SELECT * FROM dataset1.table_a"),
) {
	if err != nil {
		// error can be .Read() error or a .Next() error.
		return nil, fmt.Errorf("failed to retrieve row: %v", err)
	}

	fmt.Printf("Id: %d, Name: %s", row.Id, row.Name)
}
```

This has the expressiveness of a range loop and is also flexible because you can now add additional logic into the loop, like filtering, breaking/continuing, or making additional calls, something that couldn't have been done easily if you had created a custom function to run the queries and marshal the rows.

The implementation for the `BqQuery` function looks like this:

```go
func BqQuery[E any](ctx context.Context, query *bigquery.Query) iter.Seq2[*E, error] {
	return func(yield func(*E, error) bool) {
		iter, err := query.Read(ctx)
		if err != nil {
			yield(nil, err)
			return
		}

		for {
			var row E
			err := iter.Next(&row)
			if err != nil {
				if err != iterator.Done {
					// call error handler
					if !yield(nil, err) {
						return
					}
				}
				return
			}

			if !yield(&row, nil) {
				return
			}
		}
	}
}
```

This illustrates the power of the `iter.Seq2` type because it enables us to have any type as values in the range variables; in this case, it is the `Row` type and `error`.

## Abstracting Resource Management
Finally, and perhaps the most interesting to me, is the possibility of abstracting away the acquiring and releasing of resources. If you've written or read a fair amount of Go code, you would know about the `defer` statement and how it is used to close resources. For example, when reading a file, we want to ensure it is always closed like:
```go
file, err := os.Open(filepath)
if err != nil {
	// handle error
}
defer file.Close() // ensures we release the file resource

// perform operations on the file
```

Now that we can provide custom logic in `range` function iterators, we can use it to create a block scope to ensure the resource is cleaned up after use. This would look something like:
```go
for file, err := range WithFile(filepath) {
	// perform operations on the file
}
```
If you are familiar with the Python programming language, this is similar to the `with` statement. 

<collapsible title="`defer`'s Behaviour in Range Functions" className="mb-2">

This resource management behaviour is possible because a `defer` statement within a Range function will be executed after the loop where it is being used has ended. This `defer` semantics may be confusing when implementing a Range function at first, but you get used to it after a few times.

Using an example to illustrate:

```go
package main

import (
	"fmt"
	"iter"
) 

unc DeferAfterYield() iter.Seq[int] {
	 defer fmt.Println("defer before range function")
	return func(yield func(int) bool) {
		defer fmt.Println("defer in range function")

		yield(5)
	}
}

func main() {
	for i := range DeferAfterYield() {
		defer fmt.Println("defer in main")
		fmt.Println(i)
	}

	fmt.Println("end of main")
}
```

This will output:
```
defer before range function
5
defer in range function
end of main
defer in main
```

Notice that the `defer` in the Range Function is executed immediately after the loop, while any `defer` within the loop is executed after its outer function exits.

</collapsible>


The one pushback I have against this is that a `for` loop connotes looping through a list of items, while this is essentially a single iteration loop that only executes once and ensures the file is closed once done. The Go community may come up with an idiomatic name for these kinds of functions to make it less confusing (or they will classify it as an anti-pattern; you never can tell, Go folks are simple folks), but I'm sticking with using a `With` prefix in their name.

Pushback or not, there is one use case of this resource management style that I thought of: A function iterator for reading a file line by line:
```go
for file, err := range ReadLines(filepath) {
	if err != nil {
		// handle error
		break;
	}

	// perform operations on the new line
}
```

This is especially useful to me because I can't count the times I've had to write some wrapper function around some `Scanner` or `Reader` type to do this, especially when processing larger files where I don't simply want to load all lines into memory and call the `strings.Split()` function on. With this ReadLines function, I can process each line imperatively, call `continue` to skip to the following line, and it is more versatile and reusable. Also, no `defer` statements are in sight.

<collapsible title="Implementations of the 'WithFile' and 'ReadLines' functions">

```go
// WithFile returns a sequence that yields a file
// (and an error if an error opened the file).
func WithFile(filepath string) iter.Seq2[*os.File, error] {
	return func(yield func(*os.File, error) bool) {
		file, err := os.Open(filepath)
		if err != nil {
			yield(nil, err)
			return
		}
		// ensure the file is closed after yielding
		defer file.Close()

		yield(file, nil)
	}
}

func ReadLines(filepath string) iter.Seq2[[]byte, error] {
	pullFile, stop := iter.Pull2(WithFile(filepath))
	return func(yield func([]byte, error) bool) {
		defer stop()
		file, err, ok := pullFile()
		if !ok {
			return
		}
		if err != nil {
			if !yield(nil, err) {
				return
			}
		}
		
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			// yield each line from the file
			if !yield(scanner.Bytes(), nil) {
				return
			}
		}

		if err := scanner.Err(); err != nil {
			if !yield(nil, err) {
				return
			}
		}
	}
}
```
</collapsible>

## Closing Thoughts

One thing is clear: While function iterators are currently experimental and have certain complexities, they are significant features that will contribute to Go's evolution and make the language more expressive for its users. 

As we await further developments and refinements, the Go community must continue exploring and providing feedback, paving the way for its potential adoption into the mainstream Go language.

It is also **important** to mention that these Range Functions are just as performant as if they were written in the range loops supported by the language. 

Let me know in the comments if you have some use cases to which Function Iterators would be nicely suited.