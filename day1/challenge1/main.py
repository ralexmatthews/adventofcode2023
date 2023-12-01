with open("./input.txt") as file:
  lines = file.readlines()

  sum = 0

  for line in lines:
    line = line.strip()
    if len(line) == 0:
      continue

    digits_from_line = [digit for digit in line if digit.isdigit()]

    first_digit = digits_from_line[0]
    digits_from_line.reverse()
    last_digit = digits_from_line[0]

    concatted = first_digit + last_digit
    sum += int(concatted)

  print(sum)
