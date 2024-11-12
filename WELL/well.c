#include <emscripten.h>
#include <stdint.h>

#define R 32

#define M1 3
#define M2 24
#define M3 10

#define MAT0POS(t, v) (v ^ (v >> (t)))
#define MAT0NEG(t, v) (v ^ (v << -(t)))
#define Identity(v) (v)

#define V0 State[i]
#define VM1 State[(i + M1) % R]
#define VM2 State[(i + M2) % R]
#define VM3 State[(i + M3) % R]
#define VRm1 State[(i + R - 1) % R]

#define newV0 State[(i + R - 1) % R]
#define newV1 State[i]

static uint32_t State[R];

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE uint32_t bufsize() { return R; }

EXTERN EMSCRIPTEN_KEEPALIVE uint32_t WELL1024() {
  static uint32_t i = 0;
  uint32_t z0 = VRm1;
  uint32_t z1 = Identity(V0) ^ MAT0POS(+8, VM1);
  uint32_t z2 = MAT0NEG(-19, VM2) ^ MAT0NEG(-14, VM3);
  newV1 = z1 ^ z2;
  newV0 = MAT0NEG(-11, z0) ^ MAT0NEG(-7, z1) ^ MAT0NEG(-13, z2);
  i = (i + R - 1) % R;
  return State[i];
}

EXTERN EMSCRIPTEN_KEEPALIVE void
fill_state_array(const uint32_t *initial_values) {
  for (int i = 0; i < R; ++i) {
    State[i] = initial_values[i];
  }
}
