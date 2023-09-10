---
title: Monitor your Postgres DB Performance Before Launch
date: 2023-09-11T09:00:00.000Z
tags:
  - postgres
  - observability
  - performance
slug: /monitoring_postgres_performance
featureImage: ../assets/2023_09_11/banner.png
---
As the final touches are given to a development project ahead of the grand launch, one area is often tucked away: monitoring Database performance. Overlooking this aspect may lead to unforeseen performance-related issues cropping up shortly after the application becomes operational. This article underlines some quick and straightforward measures I usually try to do to monitor or detect such potential hiccups with a PostgreSQL database.

## Review the Query Logs
The first thing I try to do is set up monitoring for slow queries. In a perfect world, all your queries should be optimised and using indexes (all other optimisations), but the reality is that non-performant queries will pop their head up one way or the other. So, monitoring slow queries is vital, and there are a few ways to do it. 

### Bootstrapping Application Code
I typically start out by bootstrapping my application code's data access layer to track the time it takes for each query to get executed and returned to the application. If the query time is above a set threshold (I usually pick between 600-800ms for optimal user experience), I log out the query to be inspected later. The effort to do this will depend on how your code is structured (using a framework or not, etc.), but generally, it will require you to refrain from tinkering with the Database infrastructure. 

There are some drawbacks to this approach:
1. The times will also include other factors not 100% indicative of the database performance. Things like Network Latency, data serialising and deserialising times will be included.
2. This approach is coupled to your application's code language or framework choice and is not portable to new applications using a different technology.

### Using Modules & Extensions
The alternative approach (and can even be combined with the first approach) is to use modules and extensions set up within Postgres to track query execution time. These extensions will output values to the Postgres logs, and you will need to figure out a way to export the logged values to be visible to you. Still, this approach is much more portable and can explain why the query was slow.

Here is a quick list of some configurations and tools I use often:
- First, setting the [log_min_duration_statement](https://www.postgresql.org/docs/current/runtime-config-logging.html#:~:text=log_min_duration_statement%20(integer)) configuration for Postgres. This will log queries that exceed the specified length of time.

> If you have a high-traffic application, you can use an alternative set the `log_min_duration_sample` config to reduce the rate at which the slow queries are being logged. 
  
- The [auto_explain](https://www.postgresql.org/docs/current/auto-explain.html) module built into PostgreSQL can be configured to automatically log query plans of slow queries, giving you quicker insight into performance issues.
- Finally, I use the [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) extension when I want to get more comprehensive query execution information. This usually requires more effort to set up (unless your database provider already has it set up), but the additional insight into long-running queries and database inefficiencies will be worth it in the long run. 

> Pro-tip: You can use an external tool like [pgBadger](https://github.com/darold/pgbadger) to run analysis on the Postgres logs to make it easier to decipher inefficiencies.


Also, a heads up that most managed Postgres Database services don't enable these extensions by default and usually leave it up to you to configure when setting up your database. The Postgres Documentation has a good document on [how to set these configuration parameters](https://www.postgresql.org/docs/current/config-setting.html). You can read that in addition to your Database provider's documentation on how to set this up.

## Monitoring the Database Server
In addition to monitoring the database queries, you should monitor the underlying database server. This includes CPU usage, memory usage, and disk I/O. If you are using one of the hosted/managed Postgres services, they probably have these metrics tracked, and you can view them on their internal dashboard. 

If you are self-hosting or managing your own Postgres Instances, several PostgreSQL monitoring tools are available, both commercial and open source and I recommend you do your own research for what works best for you based on the time to implement and cost of the service.

Some tools and services I've used in the past are:
- [Datadog](https://www.datadoghq.com/): Datadog is a monitoring service that integrates well with different types of applications and software. They are easy to set up for your database and track reasonable metrics by default out of the box.
- [PostgresExporter with Grafana](https://github.com/prometheus-community/postgres_exporter):  To use this, You must already have Prometheus installed as your monitoring and alerting system. By setting up postgres_exporter, you can export server metrics related to your database to your Prometheus instance, which can then be visualized on Grafana. This may require some maintenance and technical knowledge, so it's best suited for larger teams, though individuals can also set it up for themselves.

These tools can help you collect and analyse performance data. For starters, the data you want to monitor from these tools are:
- CPU Usage
- Memory usage
- Disk Uitlitisation
- Connection Utilisation.

If find these to be good indicators to visualise at the launch of a product and as time passes and your users and data grow, you can start looking into more complex metrics like Cache hits/misses, Index utilisation etc.
### Set up alerts
When you have monitoring set up, you have the capability to create alerts that will inform you of any potential performance issues. By doing this, you are able to take corrective measures before these problems influence your application. For instance, you can ascertain when to implement Connection pooling, which can be made possible by tools like PgBouncer and Pgpool-II. These tools help optimize the utilisation of resources by limiting and managing the database connections. This ensures that your database will not be inundated with too many simultaneous connections, which can ultimately have a negative impact on performance.

## Conclusion
Monitoring PostgreSQL before launch is essential to ensure your application operates smoothly and efficiently right from the start. By following these tips, you can effectively monitor the performance of your PostgreSQL database and ensure that your application performs as expected when launched. Once you have identified performance problems, you can tune the database to improve performance. This may involve creating indexes, optimising queries, or increasing the memory allocated to the database.

