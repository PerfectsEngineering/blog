---
layout: blog
title: 'Understanding Kubernetes CPU Resource Allocation: Multi-threading with
    Less Than 1 vCPU'
date: 2023-03-01T21:14:52.569Z
tags:
    - docker
    - kubernetes
featureImage: ../assets/cpu-nodes.webp
slug: /kubernetes_multithreading_cpu_limit
---

In today's fast-paced world of application development, containerization and orchestration have become crucial components for deploying and managing modern applications. Kubernetes, a widely-used container orchestration platform, has made it easier for developers and system administrators to manage the deployment, scaling, and operation of containerized applications. One of the critical aspects of Kubernetes is its ability to manage resources such as CPU and memory.

A colleague recently asked me if it was possible for a multi-threaded application to run on a container granted less than on 1vCPU resource limit. The short answer is, yes it is possible, and in this blog post, I will attempt to explain how Kubernetes CPU resource allocation works, specifically focusing on how it is possible to request less than 1 vCPU and still have your application run multi-threaded.

## First, the Basics of Kubernetes CPU Resource Allocation

Kubernetes allows users to specify the CPU resources required by a container in terms of "request" and "limit." A "request" is the minimum amount of CPU that a container is guaranteed to have, while the "limit" is the maximum CPU that a container can use. These values are specified in the container's YAML configuration file, and they help Kubernetes in making informed decisions while scheduling and allocating resources to different containers running on the same node.

CPU resources are measured in vCPUs and CPU units. A vCPU represents a virtual CPU core that corresponds to a physical CPU core or a hyperthread on the underlying hardware. CPU units, on the other hand, are a more granular measurement - often represented in millicores. One vCPU is equivalent to 1000 millicores. This granularity enables Kubernetes to allocate CPU resources more efficiently, allowing containers to request and consume CPU resources in fractions of a vCPU.

This is typically specified as part of a Pods Manifest file like so:

```yaml

---
resources:
    requests:
        cpu: 50m
    limits:
        cpu: 100m
```

The above means the container can use at least 5% (50/1000) of a CPU cycle and at most 10% of a CPU cycle.

## Deeper into CPU Requests

The CPU `requests` ensure that the container can use at least the specified amount of cores requested. An helpful way to visual this is to think of 1vCPU as a pie divided into 1000 sections and each container is given as many slices as they need to run operations. So for example, lets say we have two containers A and B. Container A requests `100m` and container B requests `500m`.

// image here.

The problem with simply specifying `requests`, at least with the way Kubernetes handles it, is that Kubernetes only ensures that at least the minimum requested CPU share is granted, it doesn't prevent the container from using more CPU time than it has requested. And this was why the `limits` was introduced.

CPU `limits` uses a different mechanism to ensure that a container can only use at most as many CPU cycles as its has specified. If the limit is reached, then the container gets throttled for a period of time. To achieve this, the container runtime splits up CPU times into specific intervals called **periods** and then defines a **quota** based on the limits requested. The **quota** represents how long a container can use CPU time within a **period**.

A way to think of this is to express the requested limit as fraction of time of a single available CPU. So, for example, given a limit of `100m`, we are requesting 100/1000 of a CPU cycle. Expressing this a CPU time where a full cycle is 1000ms, this will mean the container can only use 10ms (quota) for every 100ms(period) of CPU time.

// image here as well.

This also applies to when more than CPU limit is specified, like `1500m` (or just `1.5`). The quota will essentially span multiple periods such that the container can only use 150ms for every 200ms of CPU time.

## Benefits of Requesting Less Than 1 vCPU

There are several benefits to requesting less than 1 vCPU for your containerized applications. Firstly, it optimizes resource utilization by ensuring that your application consumes only the resources it needs, leaving more resources available for other containers running on the same node. This approach can also improve the overall performance of your application, as it reduces the risk of resource contention between containers. Additionally, specifying more granular CPU requests can lead to better scheduling decisions by Kubernetes, as it has a clearer understanding of the actual CPU requirements for each container.

## Conclusion

In summary, Kubernetes offers a flexible and efficient way of managing CPU resources for containerized applications. By allowing users to specify CPU requests in millicores, it becomes possible to request less than 1 vCPU and still runs multi-threaded applications. This flexibility benefits both the performance of individual applications and the overall resource utilization on the node. By understanding and leveraging Kubernetes' CPU resource allocation features, you can optimize your application deployments and ensure that your applications run smoothly and efficiently in a multi-container environment.
