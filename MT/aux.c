#include <emscripten.h>

float up_and_down_linear(float t) {
  return t < 0.5f ? 2.0f * t : 1.0f - t;
}

EMSCRIPTEN_KEEPALIVE
float opacity(int offset, int t, int span) {
    return up_and_down_linear(
        (float)((t + offset) % span) / (float)span
    );
}