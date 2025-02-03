# Extracting Raw Ports on Windows Using netstat

This guide shows you how to extract a list of listening ports on Windows by processing the raw output of the built-in `netstat` command. Using this method, you avoid third-party tools, ensuring compatibility even on minimal Windows installations.

## Why Use netstat?

Windows provides the `netstat` command out of the box, which displays active network connections. By filtering its output for listening sockets, you can determine which local ports are in use. This is the most basic and reliable method to obtain this information on Windows.

## Step 1: Viewing the Raw Data

Start by running the following command in PowerShell:

```powershell
netstat -an
```

A sample snippet of the output might look like:

```
  Proto  Local Address          Foreign Address        State           PID
  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING       1234
  TCP    127.0.0.1:49680        127.0.0.1:49681        ESTABLISHED     5678
  TCP    [::]:443               [::]:0                 LISTENING       2345
```

**Key Points:**

- **Local Address:** Contains both the IP address and the port, separated by a colon. For IPv6 addresses, the IP is enclosed in square brackets, e.g. `[::]:443`.
- **State:** We are interested in lines where the state is `LISTENING`, which indicates that the port is open and waiting for connections.

## Step 2: Filtering for Listening Ports

Filter the output so that only lines with the `LISTENING` state are processed. In PowerShell, you can use `Select-String`:

```powershell
netstat -an | Select-String "LISTENING"
```

This command displays only the entries where the socket is listening.

## Step 3: Extracting the Port Number

Next, extract the port number from the `Local Address` field. In Windows netstat output, the `Local Address` is the second column. Using PowerShell, you can split each matching line by whitespace and then extract and further split the local address on the colon (`:`). The following one-liner demonstrates this:

```powershell
netstat -an | Select-String "LISTENING" |
ForEach-Object {
  # Split the line by whitespace and select the Local Address field (index 1)
  $localAddress = ($_ -split "\s+")[1]
  # For IPv6 addresses (enclosed in []), remove the brackets first
  $localAddress = $localAddress -replace '^\[|\]$', ''
  # Split on colon to separate IP from port and take the last element (the port)
  ($localAddress -split ":")[-1]
} | Sort-Object -Unique
```

### Explanation

- **`netstat -an | Select-String "LISTENING"`**  
  Filters the raw netstat output to include only lines where the connection is in the `LISTENING` state.

- **`($_ -split "\s+")[1]`**  
  Splits each line on whitespace and retrieves the second field, which is the local address.

- **`-replace '^\[|\]$', ''`**  
  Removes square brackets from IPv6 addresses, if present.

- **`($localAddress -split ":")[-1]`**  
  Splits the local address on the colon and selects the last element. This extracts the port number regardless of whether the IP is IPv4 or IPv6.

- **`| Sort-Object -Unique`**  
  Sorts the resulting port numbers and removes duplicates.

## Step 4: Running the Command

Open PowerShell and paste the one-liner. You should see a clean list of port numbers currently in the listening state, for example:

```
80
443
3389
```
