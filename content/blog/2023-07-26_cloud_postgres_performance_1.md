---
title: Comparing Cloud Postgres Performance
date: '2023-07-26T09:00:00.284Z'
tags: ['load_test', 'performance', 'postgres']
slug: /cloud_postgres_performance
featureImage: ../assets/welcome.jpg
---

I've been working with cloud databases for a few years now, and I've always been impressed with the performance of PostgreSQL. However, I recently had an experience that made me question whether all cloud providers are created equal.

I was working on a project that required a lot of database queries, and I was using CloudSQL (GCP's managed PostgreSQL instance). I started to notice that the performance of my queries was not as good as I expected.  I had to tune some parameters to get better performance (I'll write about this some other time), but this got me thinking. What if the performance of CloudSQL was just a fluke or it was similar across other Cloud Providers? 

I also found tweets of some people complaining about RDS (AWS's managed PostgreSQL Instance) not being performant enough researched and found that other people had also experienced performance issues with CloudSQL.

I was curious to see  So, I decided to run a benchmark test to compare the performance of CloudSQL to other Cloud providers.

In this article, I will share the results of my benchmark test. I will also discuss the factors that can affect the performance of a cloud database, and I will offer some tips for choosing the right cloud provider for your needs. I hope this article will help you make an informed decision when choosing a cloud database provider.