# Extracting Raw Ports from Linux's Proc Files

This guide explains how to extract the list of ports in use on a Linux system by reading directly from the proc filesystem. This method is nearly universal across Linux distributions—even on minimal installs—because it relies on the kernel’s `/proc` interface rather than external tools like `netstat` or `ss`.

## Why Use `/proc/net`?

The proc filesystem exposes kernel data in a file-like structure. In particular, `/proc/net/tcp`, `/proc/net/tcp6`, `/proc/net/udp`, and `/proc/net/udp6` contain information about active sockets. This is the most basic and raw way to access networking details, ensuring maximum compatibility across different Linux distributions.

## Step 1: Viewing the Raw Data

You can start by viewing the raw contents of one of these files. For example, to see active TCP connections:

```sh
cat /proc/net/tcp
```

A sample output might look like this:

```
  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
   0: 0100007F:1F90 00000000:0000 0A 00000000:00000000 00:00000000 00000000   100        0 12345 1 ffff8881b2a40000 100 0 0 10 0
   1: 00000000:0050 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 67890 1 ffff8881b2a50000 100 0 0 10 0
```

**Key Points:**

- **Header Row:** The first line contains column headers.
- **Local Address Field:** The second column (`local_address`) contains the IP and port. The IP is in hexadecimal and the port follows after the colon, also in hexadecimal.

## Step 2: Understanding How Ports Are Stored

In `/proc/net/tcp`, each entry’s `local_address` is formatted as `IP:PORT` in hexadecimal. For example:

- `0100007F:1F90`  
  - `0100007F` is the IP (127.0.0.1 in decimal).
  - `1F90` is the port in hex (8080 in decimal).

To work with the port numbers in your application, you need them in decimal format.

## Step 3: Extracting the Port Field

Using a tool like `awk`, you can split each line and focus on the `local_address` field. A basic command to split the local address field might be:

```sh
awk 'FNR > 1 { split($2, a, ":"); print a[2] }' /proc/net/tcp
```

This command:
- Skips the header row (`FNR > 1`).
- Splits the second field (`$2`) using the colon (`:`) as the delimiter.
- Prints the hexadecimal port (the second element in the array `a`).

## Step 4: Converting the Port from Hexadecimal to Decimal

To convert hexadecimal to decimal, you can use `printf` within `awk`. The following snippet shows the conversion:

```sh
awk 'FNR > 1 {
  split($2, a, ":");
  cmd = "printf \"%d\" 0x"a[2];
  cmd | getline p;
  close(cmd);
  print p;
}' /proc/net/tcp
```

This does the following:
- Splits the `local_address` field to extract the port in hex.
- Constructs a command (`printf "%d" 0x...`) to convert the hex value to decimal.
- Reads the output of the command into variable `p` and then prints it.

## Step 5: Combining Multiple Protocols and Cleaning the Output

To cover both IPv4 and IPv6 as well as TCP and UDP, you can read from all four files:

- `/proc/net/tcp`
- `/proc/net/tcp6`
- `/proc/net/udp`
- `/proc/net/udp6`

Additionally, you may want to filter out any blank or zero values and sort the results to remove duplicates. The final one-liner looks like this:

```sh
awk 'FNR>1 { split($2,a,":"); cmd="printf \"%d\" 0x"a[2]; cmd | getline p; close(cmd); if(p != "" && p > 0) print p }' /proc/net/{tcp,tcp6,udp,udp6} | sort -un
```

### Explanation:

- **`FNR>1`:** Skips header lines.
- **`split($2,a,":")`:** Splits the second field into an array `a` using `:` as the delimiter.
- **`cmd="printf \"%d\" 0x"a[2]`:** Builds a shell command that converts the hexadecimal port (`a[2]`) into a decimal number.
- **`cmd | getline p; close(cmd)`:** Executes the command and reads the result into variable `p`.
- **`if(p != "" && p > 0) print p`:** Prints the port only if it is not empty and greater than zero.
- **`| sort -un`:** Sorts the resulting port numbers and removes duplicates.
