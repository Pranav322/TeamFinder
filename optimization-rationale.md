# Performance Optimization Rationale: Owner Stats API

## Current Situation
The `app/api/owner-stats/route.js` endpoint currently fetches all notifications associated with an owner's projects in a single `prisma.notification.findMany` call.

### Performance Bottlenecks:
1. **Memory Overhead**: Large numbers of notifications are loaded into the application's memory.
2. **Data Redundancy**: The query includes project data for every notification. In cases where multiple notifications belong to the same project, the project details (title, description, image, etc.) are fetched and transmitted multiple times.
3. **Application-Level Processing**: Filtering and grouping (stats calculation) are performed in JavaScript after fetching all data.
4. **I/O Inefficiency**: The database transmits a large amount of data that is ultimately filtered out or condensed in the application.

## Proposed Optimization
The optimization involves breaking down the single large query into several targeted queries executed in parallel using `Promise.all`:

1. **`prisma.notification.groupBy`**: Used for calculating statistics. This moves the aggregation logic to the database, returning only the counts for each status.
2. **Targeted `findMany` for Lists**: Separate queries for `pendingRequests` and `rejectedRequests` fetch only the records needed for those specific parts of the response.
3. **Project-Centric Query for Approved Projects**: Instead of fetching notifications and grouping them by project in JS, we query for projects that have approved notifications. This avoids redundant project data transfer and simplifies the creation of the `teamMembers` list.

## Expected Impact
- **Reduced Memory Usage**: Drastic reduction in memory footprint as only the necessary records are held in memory.
- **Lower Latency**: Faster database execution for aggregations and reduced data transfer time over the network.
- **Improved Scalability**: The endpoint will remain performant as the number of notifications grows.

## Baseline vs. Optimized (Theoretical)
| Metric | Current Approach | Optimized Approach |
|--------|------------------|--------------------|
| Database Query | `O(N)` records fetched | `O(M + P + R)` records fetched* |
| Network Payload | High (due to redundancy) | Low (no redundant project data) |
| Memory Usage | High (`O(N)`) | Low (`O(M + P + R)`) |
| CPU Usage (App) | High (filtering/grouping) | Low (mostly formatting) |

*N = total notifications, M = pending notifications, P = rejected notifications, R = unique projects with approvals.
