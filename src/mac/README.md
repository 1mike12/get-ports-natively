# Extracting Raw Ports on macOS Using netstat

This guide shows you how to extract a list of listening ports on macOS by processing the raw output of `netstat -an`.
This approach relies solely on built-in tools available on macOS, making it suitable for environments where installing
extra software is not an option.

## Why Use netstat?

macOS doesn’t expose a `/proc` filesystem like Linux does. Instead, network socket details are available via the
`netstat` command. This tool prints a list of all active network connections along with their states. By filtering for
lines that represent listening sockets, you can extract the local port numbers that services are using.

## Step 1: Viewing the Raw Data

Start by running the following command in your terminal:

```sh
netstat -an
```

This displays all active network connections. A snippet of the output might look like:

```
Proto Recv-Q Send-Q  Local Address          Foreign Address        (state)
tcp4       0      0  127.0.0.1.8080         127.0.0.1.52682        ESTABLISHED
tcp4       0      0  127.0.0.1.8080         *.*                    LISTEN
tcp6       0      0  ::1.56789              ::1.49285             ESTABLISHED
tcp6       0      0  ::1.80                 *.*                    LISTEN
```

**Key Points:**

- The `Local Address` field shows both the IP and port combined. In macOS output, the port is appended to the IP address
  using a dot as the delimiter.
- Only lines with the state `LISTEN` are relevant when you want to extract the ports that are waiting for connections.

## Step 2: Focusing on Listening Ports

To narrow down the output to only the listening ports, filter the raw data using `grep` or directly within `awk`. For
example, you can start with:

```sh
netstat -an | grep LISTEN
```

This yields only the lines that indicate a listening socket.

## Step 3: Extracting the Port Number

Since the `Local Address` field is formatted with dot-separated values (for example, `127.0.0.1.8080` or `::1.80`), the
port is always the last field when splitting by the dot (`.`). We can use `awk` to split the `Local Address` field and
extract the last element.

A simple command to do that is:

```sh
netstat -an | awk '/LISTEN/ { n = split($4, a, "."); print a[n] }'
```

**Explanation:**

- `/LISTEN/`: Filters the lines that contain the word `LISTEN`.
- `$4`: Assumes that the fourth field contains the `Local Address`. (This field may vary slightly if the format changes,
  but in standard macOS output it is typically the fourth column.)
- `split($4, a, ".")`: Splits the `Local Address` on the dot (`.`), storing the parts in an array `a`.
- `print a[n]`: Prints the last element of the array (the port number).

## Step 4: Cleaning and Sorting the Output

You might want to remove duplicates and sort the port numbers numerically. You can do this by piping the result to
`sort -un`:

```sh
netstat -an | awk '/LISTEN/ { n = split($4, a, "."); print a[n] }' | sort -un
```

This one-liner:

- Filters out only listening ports,
- Extracts the port numbers,
- And then sorts the list while removing any duplicates.
