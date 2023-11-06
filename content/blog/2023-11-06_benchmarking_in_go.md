---
title: Verifying Performance with Simple Benchmarks - Go Benchmarks
date: 2023-11-06T08:00:00.000Z
tags:
  - performance
  - golang
slug: /benchmarking_your_code_go
featureImage: ../assets/2023_11_06/banner.jpg
---
I am reflecting on how certain programming language features make it easy to iterate and test changes, specifically benchmarking. 

I recently started working on a project that involves transforming string values to a specific format that can be used to create a database table. This service was written in Go and used a simple replacer to convert any non-alphanumeric character into an underscore (`_`).

```go
var validStringRegex = regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
var replacer = strings.NewReplacer(
	" ", "_",
	",", "_",
	".", "_",
	"-", "_",
	"*", "_",
	"!", "_",
	"?", "_",
	"(", "_",
	")", "_",
)

func NormalizeWithReplacer(text string) (string, error) {
	formattedString := replacer.Replace(text)

	if !validStringRegex.MatchString(formattedString) {
		slog.Error("error normalising string", "value", text, "normalizedValue", formattedString)
		return "", fmt.Errorf("error normalising string %s", text)
	}

	return formattedString, nil
}
```

You'll also notice that the code uses a regular expression (Regex) to check that the transformed string matches the required format. This is necessary because chances are a character not included in the Replacer's list may exist in the string, leading to errors down the line.

As you may have guessed, a side effect of this code is that when a new character that is not accounted for is found, we will need to update the replacer list and then redeploy the service. Not the best way to do this, right? Since there is already a regex check in this code, why don't we flip the regex and use it to match and replace invalid characters with an underscore? This way, the code will be more robust and save Engineers time updating the replacer; Win-Win, right?

So, I quickly wrote up a Regex version of the function.

```go
// Matches all characters not in the valid syntax
var replacerRegex = regexp.MustCompile(`[^a-zA-Z0-9_]+?`)

func NormalizeWithRegex(text string) (string, error) {
	formattedString := replacerRegex.ReplaceAllString(text, "_")

	return formattedString, nil
}
```

There are even fewer lines of code in this version, and notice now that I do not need to return an error (the function signature still includes an `error` so it will be a drop-in replacement for the existing function).

All positive so far, Yay!. All existing test cases also pass on this function. However, there is one last thing I need to confirm before this new change can be shipped to production. I need to confirm that this doesn't impact the performance of the service. 

<collapsible title="Primer on Benchmark Tests in Go">
<h2>A Primer on Benchmark Tests in Go</h2>

In Golang, a benchmark can be written in a test file. Any function with a name that starts with the `Benchmark` word and has a signature like the following is considered to be run as a benchmark:
```go
func BenchmarkX(b testing.B) {
  // ... benchmark test goes here
}
```
You can then run these benchmarks using the `go test` command with the `-bench` flag like:
```sh
go test -bench <benchmark-to-run> ./...
```
Replace `<benchmark-to-run>` with the name of the test mark test to run (for our example, `BenchmarkX`), or use a `.` (dot) to run all benchmarks in the path.

For example, let's say we have a function that generates random numbers:
```go
// file random/random.go

package random

import "math/rand"

func GenerateRandomNumber() int {
	return rand.Int()
}
```
Then, a Benchmark test can be written like this:

```go
// file random/random_test.go

package random

import "testing"

func BenchmarkGenerateRandomNumber(b testing.B) {
	for i := 0; i < b.N; i++ {
		GenerateRandomNumber()
	}
}
```

Next, run the Benchmark test and get an output as shown below:
```
$ go test -bench . ./random
goos: darwin
goarch: arm64
pkg: github.com/perfectsengineering/pe_go_bench/random
BenchmarkGenerateRandomNumber-10        334039066                3.489 ns/op
PASS
ok      github.com/perfectsengineering/pe_go_bench/random       1.671s
```

The vital line to focus on is:
```sh
BenchmarkGenerateRandomNumber-10        334039066                3.489 ns/op
```
The `-10` suffix indicates how many parallel instances of the benchmark are run, usually equal to the `GOMAXPROCS` (number of logical CPU cores on your computer).
Next, the number `334039066` is the total number of times the Benchmark function was run across all parallel executions.
Finally, the `3.489 ns/op` is the average time for each execution; smaller means faster.

> You can also include the `-benchmem` flag in your test command to get more information about memory usage. I find this helpful information sometimes.
					
</collapsible>

## Benchmarking my change
This service processes over 25,000+ requests/s, and this `Normalize` function is on the hot path, being called for all these events. This means that a minor change like this can drastically impact the tail latencies of this service. It's a good thing Go has Benchmarking tests native to it.

```go
func BenchmarkNormalise(b *testing.B) {
	b.Run("WithReplacer", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			formatter.NormalizeWithReplacer("Hello, World!")
		}
	})

	b.Run("WithRegexp", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			formatter.NormalizeWithRegex("Hello, World!")
		}
	})
}
```
Then run the benchmark with:
```sh
go test -bench . -count 5 -benchmem  -benchtime 10s ./...
```
> Including the `-benchmem` flag because the extra memory allocation information comes in handy in evaluating memory tradeoffs along with compute.

### The Surprising Results

```sh
BenchmarkNormalise/WithReplacer-10   52982422    229.2 ns/op    32 B/op    2 allocs/op
BenchmarkNormalise/WithRegexp-10     26595258    453.2 ns/op    56 B/op    4 allocs/op
```
And there you have it, my new regex function runs slower (about 50% slower) and even allocates more memory to do so 😅.

## Conclusion
Contrary to what I thought, it is not all win-win. However, we can try and argue that the extra robustness from this new implementation may be worth more than slowdown, especially when you consider the Engineering time that is spent to update the Replacer function anytime a new character is encountered. The final decision will be up to your specific function. However, in this case, the values to be normalised are fairly standard and we only get new characters on rare occasions, so taking a hit in processing throughput is not going to fly.

All the code in this article can be found in [this github repository](https://github.com/PerfectsEngineering/pe_go_bench). If you liked this article, don't forget to <a href="https://eepurl.com/gZ9xGj" target="_blank">subscribe</a> to get notified about new articles. I write about my experience building software, focused on Infrastructure, automation and performance.