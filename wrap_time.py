#!/usr/bin/env python3
import subprocess
import sys
import re
import time



def run(command):
    t0 = time.time()
    ran = subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    t1 = time.time()
    for line in ran.stderr.decode('utf-8').splitlines():
        if 'maximum resident set size' in line:
            max_mem = int(line.strip().split()[0])

    return max_mem, t1 - t0

def main(command):
    import statistics

    def secs(x):
        return f'{x:.2f}s'

    def mbytes(x):
        return f'{x / 1024 / 1024:.1f}MB'

    times = []
    max_mems = []
    for i in range(10):
        m, t = run(command)
        print(i + 1, t, m)
        times.append(t)
        max_mems.append(m)
        time.sleep(1)  # Let the OS calm down

    print("TIMES")
    print("BEST:  ", secs(min(times)))
    print("WORST: ", secs(max(times)))
    print("MEAN:  ", secs(statistics.mean(times)))
    print("MEDIAN:", secs(statistics.median(times)))

    print("MAX MEMORY")
    print("BEST:  ", mbytes(min(max_mems)))
    print("WORST: ", mbytes(max(max_mems)))
    print("MEAN:  ", mbytes(statistics.mean(max_mems)))
    print("MEDIAN:", mbytes(statistics.median(max_mems)))


if __name__ == '__main__':
    command = sys.argv[1:]
    main(command)
