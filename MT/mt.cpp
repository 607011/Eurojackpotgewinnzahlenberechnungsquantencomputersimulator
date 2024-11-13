#include <random>
#include <iostream>
#include <vector>

std::mt19937 rng;

void seed(uint32_t s) {
  rng.seed(s);
}

void seed_seq(const uint32_t *values, int size) {
  std::seed_seq seeds(values, values + size);
  rng.seed(seeds);
}

uint32_t randint() {
  return rng();
}

uint32_t randint31() {
  return rng() & 0x7fffffff;
}

int main() {
    constexpr int N = 3;
    uint32_t seeds[N] = {4711U, 42U, 5U};
    seed_seq(seeds, N);
    std::cout << randint31() << std::endl;
    return 0;
}
