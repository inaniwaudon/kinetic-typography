import glob
import sys

files = glob.glob("./**/*.ts", recursive=True)
sum = 0
for file in files :
    if "node" in file :
        continue
    with open(file) as fp :
        count = len(fp.read().split("\n"))
        sum += count
        print(f"{file}\t:{count}")
print(sum)