@vertex
fn main(
  @builtin(vertex_index) vertexIndex: u32,
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 0.5),
    vec2<f32>(-0.5, -0.5),
    vec2<f32>(0.5, -0.5),
  );
  return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
}