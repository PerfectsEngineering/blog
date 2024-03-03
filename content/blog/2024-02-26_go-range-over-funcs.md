---
title: Thoughts on Go's Functional Iterators (Range Functions)
date: 2024-02-26T09:00:00.00Z
tags:
  - golang
slug: /go_range_over_funcs
featureImage: ../assets/welcome.jpg
---

Go's latest version, 1.22, introduces some exciting changes to the language. One of these changes includes an experimental function called "**range-over-function iterators**" that has a vast potential to make Go's range loops more expressive and extensible. It could also make Go more complex.
I've been exploring this new `range` iterators feature and I'm writing this article to share some of my thoughts.

> "**range-over function iterators**" is a mouthful, so I'll be referring to them simply as "**Function Iterators**" throughout this article.
## First, what are range-over-function iterators?
Function Iterators is a language feature the Go team is considering for the future of Go, and so in the 1.22 release, it is experimental and requires the `GOEXPERIMENT=rangefunc` enabled to work. When enabled, it allows importing the `iter` package, which exports some new types that allow writing custom `range` loops like:
```go,
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

You can read Go's <a href="https://go.dev/wiki/RangefuncExperiment" target="_blank">Wiki about Function Iterators</a> to understand how this works behind the hood. Now, on to my explorations.

## Generating and Composing Sequences
If Function Iterators become standardized in Go, we will get a bunch of utility functions that support Function Iterators. The Go announcement wiki gives some hints at standard library functions that could merit returning iterators like `strings.Split`.

So, I started out by exploring some of this. The first I could think of was an infinite number generator:

```go
// RangeInfinite returns a sequence of integers from start to infinity with step increment.
func RangeInfinite(start, step int) iter.Seq[int] {
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
		// yield only start value when step 0
		yield(start)
	}
}
```

I chose this because, I wanted to see if I could compose these Iterators.

As you may have noticed, the Range Function work well with Generics

## Simpler Aggregation Operations
Have you ever had to fetch some data from a database using the default `sql` library and have to write a code. In my case, I've been working with BigQuery a lot, and there are times when I want to execute a query and marshal the results into a struct. Normally, this would be done like so:
```go
func fetchDataFromBigQuery(ctx context.Context, client *bigquery.Client) ([]string, error) {
	query := client.Query("SELECT * FROM dataset1.table_a")

	iter, err := query.Read(ctx)
	if err != nil {
		return nil, err
	}

	var results []string

	// Iterate over the results and append them to the array
	for {
		var row Row
		err := iter.Next(&row)
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("failed to retrieve row: %v", err)
		}

		result := fmt.Sprintf("Id: %d, Name: %s", row.Id, row.Name)
		results = append(results, result)
	}

	return results, nil
}
```

With Function Iterator and Generics, this boilerplate code can be much simpler like:
```go
func fetchDataFromBigQuery(
	ctx context.Context,
	client *bigquery.Client,
) ([]string, error) {
	query := client.Query("SELECT * FROM dataset1.table_a")

	// Run the query and get the results
	iter, err := query.Read(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}

	var results []string

	// Iterate over the results and append them to the array
	for row, err := range iterfuncs.BqRange[Row](iter) {
		if err != nil {
			return nil, fmt.Errorf("failed to retrieve row: %v", err)
		}

		result := fmt.Sprintf("Id: %d, Name: %s", row.Id, row.Name)
		results = append(results, result)
	}

	return results, nil
}
```
## Conclusion
It is also important to mention that the performance of these Range Functions 