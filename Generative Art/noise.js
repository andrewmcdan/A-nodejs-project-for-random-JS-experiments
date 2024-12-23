(() => {
    "use strict";
    const t = 0.5 * (Math.sqrt(3) - 1),
        e = (3 - Math.sqrt(3)) / 6,
        o = 1 / 6,
        n = (Math.sqrt(5) - 1) / 4,
        r = (5 - Math.sqrt(5)) / 20,
        s = new Float32Array([
            1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1,
            -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
        ]),
        i = new Float32Array([
            0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0,
            -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1,
            0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1,
            0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1,
            1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1,
            1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1,
            -1, 1, 0, -1, -1, -1, 0,
        ]),
        l = new (class {
            constructor(t = Math.random) {
                const e =
                    "function" == typeof t
                        ? t
                        : (function (t) {
                              let e = 0,
                                  o = 0,
                                  n = 0,
                                  r = 1;
                              const s = (function () {
                                  let t = 4022871197;
                                  return function (e) {
                                      e = e.toString();
                                      for (let o = 0; o < e.length; o++) {
                                          t += e.charCodeAt(o);
                                          let n = 0.02519603282416938 * t;
                                          (t = n >>> 0),
                                              (n -= t),
                                              (n *= t),
                                              (t = n >>> 0),
                                              (n -= t),
                                              (t += 4294967296 * n);
                                      }
                                      return 2.3283064365386963e-10 * (t >>> 0);
                                  };
                              })();
                              return (
                                  (e = s(" ")),
                                  (o = s(" ")),
                                  (n = s(" ")),
                                  (e -= s(t)),
                                  e < 0 && (e += 1),
                                  (o -= s(t)),
                                  o < 0 && (o += 1),
                                  (n -= s(t)),
                                  n < 0 && (n += 1),
                                  function () {
                                      const t =
                                          2091639 * e +
                                          2.3283064365386963e-10 * r;
                                      return (
                                          (e = o),
                                          (o = n),
                                          (n = t - (r = 0 | t))
                                      );
                                  }
                              );
                          })(t);
                (this.p = (function (t) {
                    const e = new Uint8Array(256);
                    for (let t = 0; t < 256; t++) e[t] = t;
                    for (let o = 0; o < 255; o++) {
                        const n = o + ~~(t() * (256 - o)),
                            r = e[o];
                        (e[o] = e[n]), (e[n] = r);
                    }
                    return e;
                })(e)),
                    (this.perm = new Uint8Array(512)),
                    (this.permMod12 = new Uint8Array(512));
                for (let t = 0; t < 512; t++)
                    (this.perm[t] = this.p[255 & t]),
                        (this.permMod12[t] = this.perm[t] % 12);
            }
            noise2D(o, n) {
                const r = this.permMod12,
                    i = this.perm;
                let l = 0,
                    c = 0,
                    a = 0;
                const f = (o + n) * t,
                    h = Math.floor(o + f),
                    u = Math.floor(n + f),
                    m = (h + u) * e,
                    M = o - (h - m),
                    p = n - (u - m);
                let d, g;
                M > p ? ((d = 1), (g = 0)) : ((d = 0), (g = 1));
                const w = M - d + e,
                    A = p - g + e,
                    y = M - 1 + 2 * e,
                    D = p - 1 + 2 * e,
                    q = 255 & h,
                    F = 255 & u;
                let v = 0.5 - M * M - p * p;
                if (v >= 0) {
                    const t = 3 * r[q + i[F]];
                    (v *= v), (l = v * v * (s[t] * M + s[t + 1] * p));
                }
                let I = 0.5 - w * w - A * A;
                if (I >= 0) {
                    const t = 3 * r[q + d + i[F + g]];
                    (I *= I), (c = I * I * (s[t] * w + s[t + 1] * A));
                }
                let U = 0.5 - y * y - D * D;
                if (U >= 0) {
                    const t = 3 * r[q + 1 + i[F + 1]];
                    (U *= U), (a = U * U * (s[t] * y + s[t + 1] * D));
                }
                return 70 * (l + c + a);
            }
            noise3D(t, e, n) {
                const r = this.permMod12,
                    i = this.perm;
                let l, c, a, f;
                const h = 0.3333333333333333 * (t + e + n),
                    u = Math.floor(t + h),
                    m = Math.floor(e + h),
                    M = Math.floor(n + h),
                    p = (u + m + M) * o,
                    d = t - (u - p),
                    g = e - (m - p),
                    w = n - (M - p);
                let A, y, D, q, F, v;
                d >= g
                    ? g >= w
                        ? ((A = 1), (y = 0), (D = 0), (q = 1), (F = 1), (v = 0))
                        : d >= w
                        ? ((A = 1), (y = 0), (D = 0), (q = 1), (F = 0), (v = 1))
                        : ((A = 0), (y = 0), (D = 1), (q = 1), (F = 0), (v = 1))
                    : g < w
                    ? ((A = 0), (y = 0), (D = 1), (q = 0), (F = 1), (v = 1))
                    : d < w
                    ? ((A = 0), (y = 1), (D = 0), (q = 0), (F = 1), (v = 1))
                    : ((A = 0), (y = 1), (D = 0), (q = 1), (F = 1), (v = 0));
                const I = d - A + o,
                    U = g - y + o,
                    C = w - D + o,
                    x = d - q + 0.3333333333333333,
                    B = g - F + 0.3333333333333333,
                    E = w - v + 0.3333333333333333,
                    S = d - 1 + 0.5,
                    b = g - 1 + 0.5,
                    j = w - 1 + 0.5,
                    k = 255 & u,
                    z = 255 & m,
                    G = 255 & M;
                let H = 0.6 - d * d - g * g - w * w;
                if (H < 0) l = 0;
                else {
                    const t = 3 * r[k + i[z + i[G]]];
                    (H *= H),
                        (l = H * H * (s[t] * d + s[t + 1] * g + s[t + 2] * w));
                }
                let J = 0.6 - I * I - U * U - C * C;
                if (J < 0) c = 0;
                else {
                    const t = 3 * r[k + A + i[z + y + i[G + D]]];
                    (J *= J),
                        (c = J * J * (s[t] * I + s[t + 1] * U + s[t + 2] * C));
                }
                let K = 0.6 - x * x - B * B - E * E;
                if (K < 0) a = 0;
                else {
                    const t = 3 * r[k + q + i[z + F + i[G + v]]];
                    (K *= K),
                        (a = K * K * (s[t] * x + s[t + 1] * B + s[t + 2] * E));
                }
                let L = 0.6 - S * S - b * b - j * j;
                if (L < 0) f = 0;
                else {
                    const t = 3 * r[k + 1 + i[z + 1 + i[G + 1]]];
                    (L *= L),
                        (f = L * L * (s[t] * S + s[t + 1] * b + s[t + 2] * j));
                }
                return 32 * (l + c + a + f);
            }
            noise4D(t, e, o, s) {
                const l = this.perm;
                let c, a, f, h, u;
                const m = (t + e + o + s) * n,
                    M = Math.floor(t + m),
                    p = Math.floor(e + m),
                    d = Math.floor(o + m),
                    g = Math.floor(s + m),
                    w = (M + p + d + g) * r,
                    A = t - (M - w),
                    y = e - (p - w),
                    D = o - (d - w),
                    q = s - (g - w);
                let F = 0,
                    v = 0,
                    I = 0,
                    U = 0;
                A > y ? F++ : v++,
                    A > D ? F++ : I++,
                    A > q ? F++ : U++,
                    y > D ? v++ : I++,
                    y > q ? v++ : U++,
                    D > q ? I++ : U++;
                const C = F >= 3 ? 1 : 0,
                    x = v >= 3 ? 1 : 0,
                    B = I >= 3 ? 1 : 0,
                    E = U >= 3 ? 1 : 0,
                    S = F >= 2 ? 1 : 0,
                    b = v >= 2 ? 1 : 0,
                    j = I >= 2 ? 1 : 0,
                    k = U >= 2 ? 1 : 0,
                    z = F >= 1 ? 1 : 0,
                    G = v >= 1 ? 1 : 0,
                    H = I >= 1 ? 1 : 0,
                    J = U >= 1 ? 1 : 0,
                    K = A - C + r,
                    L = y - x + r,
                    N = D - B + r,
                    O = q - E + r,
                    P = A - S + 2 * r,
                    Q = y - b + 2 * r,
                    R = D - j + 2 * r,
                    T = q - k + 2 * r,
                    V = A - z + 3 * r,
                    W = y - G + 3 * r,
                    X = D - H + 3 * r,
                    Y = q - J + 3 * r,
                    Z = A - 1 + 4 * r,
                    $ = y - 1 + 4 * r,
                    _ = D - 1 + 4 * r,
                    tt = q - 1 + 4 * r,
                    et = 255 & M,
                    ot = 255 & p,
                    nt = 255 & d,
                    rt = 255 & g;
                let st = 0.6 - A * A - y * y - D * D - q * q;
                if (st < 0) c = 0;
                else {
                    const t = (l[et + l[ot + l[nt + l[rt]]]] % 32) * 4;
                    (st *= st),
                        (c =
                            st *
                            st *
                            (i[t] * A +
                                i[t + 1] * y +
                                i[t + 2] * D +
                                i[t + 3] * q));
                }
                let it = 0.6 - K * K - L * L - N * N - O * O;
                if (it < 0) a = 0;
                else {
                    const t =
                        (l[et + C + l[ot + x + l[nt + B + l[rt + E]]]] % 32) *
                        4;
                    (it *= it),
                        (a =
                            it *
                            it *
                            (i[t] * K +
                                i[t + 1] * L +
                                i[t + 2] * N +
                                i[t + 3] * O));
                }
                let lt = 0.6 - P * P - Q * Q - R * R - T * T;
                if (lt < 0) f = 0;
                else {
                    const t =
                        (l[et + S + l[ot + b + l[nt + j + l[rt + k]]]] % 32) *
                        4;
                    (lt *= lt),
                        (f =
                            lt *
                            lt *
                            (i[t] * P +
                                i[t + 1] * Q +
                                i[t + 2] * R +
                                i[t + 3] * T));
                }
                let ct = 0.6 - V * V - W * W - X * X - Y * Y;
                if (ct < 0) h = 0;
                else {
                    const t =
                        (l[et + z + l[ot + G + l[nt + H + l[rt + J]]]] % 32) *
                        4;
                    (ct *= ct),
                        (h =
                            ct *
                            ct *
                            (i[t] * V +
                                i[t + 1] * W +
                                i[t + 2] * X +
                                i[t + 3] * Y));
                }
                let at = 0.6 - Z * Z - $ * $ - _ * _ - tt * tt;
                if (at < 0) u = 0;
                else {
                    const t =
                        (l[et + 1 + l[ot + 1 + l[nt + 1 + l[rt + 1]]]] % 32) *
                        4;
                    (at *= at),
                        (u =
                            at *
                            at *
                            (i[t] * Z +
                                i[t + 1] * $ +
                                i[t + 2] * _ +
                                i[t + 3] * tt));
                }
                return 27 * (c + a + f + h + u);
            }
        })(),
        c = document.getElementById("artCanvas"),
        a = c.getContext("2d"),
        f = a.getImageData(0, 0, c.width, c.height),
        h = f.width,
        u = f.height,
        m = f.data;
    requestAnimationFrame(function t() {
        const e = performance.now() / 1e3;
        for (var o = 0; o < h; o++)
            for (var n = 0; n < u; n++) {
                var r = 0.5 * l.noise3D(o / 16, n / 16, e) + 0.5,
                    s = 0.5 * l.noise3D(o / 8, n / 8, e) + 0.5;
                (m[4 * (o + n * h) + 0] = 255 * r),
                    (m[4 * (o + n * h) + 1] = 200 * (r + s)),
                    (m[4 * (o + n * h) + 2] = 0),
                    (m[4 * (o + n * h) + 3] = 255);
            }
        a.putImageData(f, 0, 0), requestAnimationFrame(t);
    });
})();
