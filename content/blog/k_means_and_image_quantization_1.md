---
title: K Means and Image Quantization [Part 1]
date: '2017-08-23T22:12:03.284Z'
tags: ["algorithms", "kMeans", "machine learning"]
featureImage: ../assets/k_mean_part_1_cover.jpg
followUpPosts: ["k_means_and_image_quantization_2"]
---

I was having a random discussion with a colleague of mine about the University he graduated from, and I realized that there are some Universities that actually employ a grading system where students grades were given based on the current distribution of students scores.This would mean there was no set cut-off mark for Distinction, Credit, Pass or Fail. This means to get distinctions all through the University, you just had to get a score higher than all the other students (or just sabotage their efforts 😁).

So lets assume we have a set of 10 students, where their scores were [1, 2, 3, 3, 4, 5, 6, 7, 7, 9]. The problem here is how to distribute the students into four categories i.e Distinction, Credit, Pass and Fail.

The solution is quite easy right?

- Distinction: [7, 7, 9]
- Credit: [5, 6]
- Pass: [3, 3, 4]
- Fail: [1, 2]

But how do we solve this problem when there are about 100 students with varying kinds of grade. This is where K Means Comes to our rescue. But first a background on what K Means is.

Before we discuss more about K Means, don’t forget to leave one or more 👏 👏 for this story, most especially if you would like this kind of grading system in your school 🙂.

### What is K Means?
K Means is a method of determining groups of related things in a list. A more apt way of saying this is that K Means is used in determining clusters.

‘K Means’ should not be confused with another technique called ‘KNN’ which stands for ‘K Nearest Neighbours’, as KNN performs a different function when compared to K Means.

### How does K Means Work?
It works by computing a set of ‘K’ values (this values are called means) that would be used to group each items to its respective cluster. So ‘K’ can be any whole number and it represents the number of groups or clusters that we are looking for in the list of items.

## Step by Step Calculation of K Means.
So now we are going to apply K Means to solve our problem of classifying a list of students grade into either distinction, credit, pass or fail.

**1. Identify the number of clusters you need - ‘K’s value.**

In our case here, we need four clusters (distinction, credit, pass and fail). So, our ‘K’ is equal to 4.

**2. Select ‘K’ arbitrary points within the range of the items in the list.**

The next thing we do is to select 4 arbitrary points from the cluster. From this point on, I’ll refer to these points as centers.

So for our lists of scores, we select [1, 4, 5, 9] as our 4 centers.

Note that the selected points need not be evenly distributed, they can be picked at random.

**3. Calculate distances of all items to each ‘K’ centers.**

For each of the centers, we calculate the distance of all points to it.

This would be give a result of:

- [0, 1, 4, 4, 9, 6, 25, 36, 36, 64] for the first center [1],
- [9, 4, 1, 1, 0, 1, 4, 9, 9, 25] for the second center [4],
- [16, 9, 4, 4, 1, 0, 1, 4, 4, 16] for the the third center [5], and
- [64, 49, 36, 36, 25, 16, 9, 4, 4, 0] for the fourth center [9].

**NOTE** that the distance used is the sum of square difference of each points to the centers. This is done by squaring the difference between a point and the center. e.g for the second grade [2] and the first center [1], the distance is (2 - 1)^2 = 1² = 1.

**4. Classify each items to a center with the shortest distance**

So from the results of the distances above we can see that the first Item is closed to center [1], the second item is also closer to center [1], but the third item is closer to center [4].

So based on these distance results, we can classify each grades in the list to the centers as shown below:

- center [1] - [1, 2]
- center [4] - [3, 3, 4]
- center [5] - [5, 6, 7, 7]
- center [9] - [9]

For reference, here are the initial grades: [1, 2, 3, 3, 4, 5, 6, 7, 7, 9].

So there you have it, that is all it takes to calculate the ‘K’ clusters using ‘K’ means.

### The Main Objective of K Means - (Minimum Intra Cluster Distance)
To all the nerdy ones reading this post, before you start typing. Let me finish.

The major aim of K Means is to create clusters or rather groups from a list of items in such a way that the items in the groups would actually be the closest to each other.

And in order to achieve this method, K Means uses a continuous (iterative) method, where it keeps calculating and recalculating centers until it has gotten the best ‘K’ groups or clusters for each center.

### Applications of K Means
K Means (and generally clustering algorithms) can be applied to different contexts. Some of this include:

- User Segmentation: As already illustrated in the example above, clustering can be used easily segment users based on their behaviour or certain attributes.
- [Image Quantization](https://en.wikipedia.org/wiki/Quantization_%28image_processing%29): Image Quantization is an image processing technique that is used to compress an image.
- Search Engines: Search engines try to group similar objects in one cluster and the dissimilar objects far from each other using clustering.

<hr/>

I tried to explain what K Means is and it usefulness in this post as simply as I can and I hope you have been able to learn a thing or two. In the second part of this post, we will go through a practical example of applying K Means clustering to perform Image Quantization using Javascript/Java/Python or any of your favorite programming language. Let me know which programming language you would like the post to be written in the comments below.

Don’t forget to share this post with your friends.

<hr/>

UPDATE: The second part for this post can be found [here](../k_means_and_image_quantization_2).

<hr/>

Special Thanks to [Wumi Oyediran](https://twitter.com/wumi_oyediran) and [Oyewale Ademola](https://twitter.com/sao_ademola) for helping me review this posts.