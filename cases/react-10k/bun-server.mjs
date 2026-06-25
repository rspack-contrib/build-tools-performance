// Bun is a native binary, so the benchmark runner cannot inject its console
// logging into the bin file. We log the required metrics directly here.
console.log('Benchmark Start Time:', Date.now());
console.log('Current PID:', process.pid);

process.on('exit', () => {
  console.log('Memory Usage:', process.memoryUsage().rss);
});

// Dynamic import keeps the logs above from being hoisted below the (potentially
// expensive) HTML bundling that Bun performs when the module is evaluated.
const { default: index } = await import('./index.html');

const server = Bun.serve({
  port: 1234,
  development: { hmr: true },
  routes: {
    '/': index,
  },
});

console.log(`Bun dev server ready at ${server.url}`);
