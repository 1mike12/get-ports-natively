# get-ports-natively

### 50x faster port finding with native OS commands. Works on Windows, macOS, and Linux.

A lightweight Node.js module that finds available network ports using native OS commands. Works on Windows, macOS, and
Linux without any external dependencies.

## Benchmarks
Most port-finding libraries rely on the `net` module and make checks one by one. If your goal is to just find the next open port, it's not a big deal to brute force it. However to get all used ports on the system, it's much more efficient to use native OS commands.

```commandline
Running benchmarks...
net module took 2.04195045 seconds (2041.95045 milliseconds)
getUsedPorts took 0.040742905 seconds (40.742905 milliseconds)
Speed difference: 50X faster
```

## Features

- Get all used ports on your system
- Find available ports within a specified range
- Native OS commands for better performance
- Platform-specific implementations (Windows, macOS, Linux)
- Zero external dependencies
- TypeScript support

## Installation

```bash
npm install get-ports-natively
```

## Usage

### Find a Free Port

```typescript
import {findFreePort} from 'get-ports-natively';

// Find the first available port starting from 3000
const port = await findFreePort();
console.log(`Found free port: ${port}`);

// Find a free port within a specific range
const customPort = await findFreePort(8000, 9000);
console.log(`Found free port in range: ${customPort}`);
```

### Get All Used Ports

```typescript
import {getUsedPorts} from 'get-ports-natively';

const usedPorts = await getUsedPorts();
console.log('Currently used ports:', [...usedPorts]);
```

## API

### `findFreePort(startPort?: number, endPort?: number): Promise<number | null>`

Finds the first available port within the specified range.

- `startPort` (optional): Starting port number (default: 3000)
- `endPort` (optional): Ending port number (default: 65535)
- Returns: Promise resolving to the first available port, or null if none found

### `getUsedPorts(): Promise<Set<number>>`

Gets all currently used ports on the system.

- Returns: Promise resolving to a Set of used port numbers

## Platform Support

- Windows: Uses `netstat` with CMD commands
- macOS: Uses `netstat` with awk
- Linux: Uses `netstat` with awk

## Requirements

- Node.js >= 16

## License

MPL-2.0

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.
