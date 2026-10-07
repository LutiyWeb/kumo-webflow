import { _ as e, c as t, d as n, f as r, g as i, i as a, l as o, m as s, n as c, o as l, p as u, r as d, t as f, u as p, v as m } from "./three.module-Dv8xNPlV.js";
//#region src/assets/envelope.svg
var h = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='128'%20height='128'%20viewBox='0%200%2064%2064'%20fill='none'%20stroke='%23fff'%20stroke-width='3'%20stroke-linejoin='round'%20stroke-linecap='round'%3e%3crect%20x='9'%20y='17'%20width='46'%20height='30'%20rx='3'/%3e%3cpath%20d='M10%2019%20L32%2035%20L54%2019'/%3e%3cpath%20d='M10%2045%20L26%2031%20M54%2045%20L38%2031'/%3e%3c/svg%3e", g = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='128'%20height='128'%20viewBox='0%200%2064%2064'%20fill='none'%20stroke='%23fff'%20stroke-width='3'%20stroke-linecap='round'%3e%3ccircle%20cx='32'%20cy='32'%20r='27'/%3e%3ccircle%20cx='32'%20cy='32'%20r='7'/%3e%3cpath%20d='M39%2026%20V36%20a4%204%200%200%200%208%200%20V32%20a15%2015%200%201%200%20-6%2012'/%3e%3c/svg%3e", _ = document.querySelector("[data-network]");
if (!_) throw Error("[data-network] not found");
var v = new f({
	alpha: !0,
	antialias: !0
});
_.prepend(v.domElement), v.setSize(_.clientWidth, _.clientHeight);
var y = new s(), b = new n(50, _.clientWidth / _.clientHeight, .1, 100);
b.position.z = 10;
var x = (e) => p.mapLinear(e, -15, 4, .05, 1), S = 140, C = /* @__PURE__ */ new Float32Array(420), w = /* @__PURE__ */ new Float32Array(420), T = [
	{
		slope: -.35,
		offset: 3.5
	},
	{
		slope: .25,
		offset: -.5
	},
	{
		slope: -.3,
		offset: -4.5
	}
];
for (let e = 0; e < S; e++) {
	let t = T[Math.floor(Math.random() * T.length)], n = (Math.random() - .5) * 24;
	C[e * 3] = n, C[e * 3 + 1] = t.slope * n + t.offset + (Math.random() - .5) * 3, C[e * 3 + 2] = Math.random() * 19 - 15;
	let r = x(C[e * 3 + 2]);
	w[e * 3] = r, w[e * 3 + 1] = r, w[e * 3 + 2] = r;
}
var E = document.createElement("canvas");
E.width = E.height = 64;
var D = E.getContext("2d"), O = D.createRadialGradient(32, 32, 0, 32, 32, 32);
O.addColorStop(0, "#fff"), O.addColorStop(.3, "#fff"), O.addColorStop(.45, "rgba(255,255,255,0.35)"), O.addColorStop(1, "rgba(255,255,255,0)"), D.fillStyle = O, D.fillRect(0, 0, 64, 64);
var k = new a(E), A = document.createElement("canvas");
A.width = A.height = 64;
var j = A.getContext("2d"), M = j.createRadialGradient(32, 32, 0, 32, 32, 32);
M.addColorStop(0, "rgba(255,255,255,0.8)"), M.addColorStop(.6, "rgba(255,255,255,0.5)"), M.addColorStop(1, "rgba(255,255,255,0)"), j.fillStyle = M, j.fillRect(0, 0, 64, 64);
var N = new a(A), P = new m(), F = P.load(h), I = P.load(g);
for (let t = 0; t < S; t += 3) {
	let n = new i(new e({
		map: t % 2 ? I : F,
		opacity: x(C[t * 3 + 2]),
		transparent: !0,
		depthWrite: !1
	}));
	n.position.set(C[t * 3], C[t * 3 + 1], C[t * 3 + 2]), n.scale.set(.35, .35, 1), y.add(n);
}
var L = new d();
L.setAttribute("position", new c(C, 3)), L.setAttribute("color", new c(w, 3));
var R = new r(L, new u({
	vertexColors: !0,
	transparent: !0,
	blending: 2,
	size: .3,
	map: k,
	depthWrite: !1
}));
y.add(R);
var z = [], B = [];
for (let e = 0; e < S; e++) {
	let t = [];
	for (let n = 0; n < S; n++) {
		if (n === e) continue;
		let r = C[e * 3] - C[n * 3], i = C[e * 3 + 1] - C[n * 3 + 1], a = C[e * 3 + 2] - C[n * 3 + 2];
		t.push({
			j: n,
			dist: Math.hypot(r, i, a)
		});
	}
	t.sort((e, t) => e.dist - t.dist);
	for (let { j: n } of t.slice(0, 3)) {
		z.push(C[e * 3], C[e * 3 + 1], C[e * 3 + 2], C[n * 3], C[n * 3 + 1], C[n * 3 + 2]);
		let t = x(C[e * 3 + 2]), r = x(C[n * 3 + 2]);
		B.push(t, t, t, r, r, r);
	}
}
var V = new d();
V.setAttribute("position", new l(z, 3)), V.setAttribute("color", new l(B, 3));
var H = new o(V, new t({
	vertexColors: !0,
	transparent: !0,
	blending: 2,
	opacity: .6
}));
y.add(H);
function U(e, t, n, i, a, o, s) {
	let l = new Float32Array(e * 3);
	for (let t = 0; t < e; t++) l[t * 3] = (Math.random() - .5) * o, l[t * 3 + 1] = (Math.random() - .5) * s, l[t * 3 + 2] = n + Math.random() * (i - n);
	let f = new d();
	f.setAttribute("position", new c(l, 3)), y.add(new r(f, new u({
		map: N,
		size: t,
		opacity: a,
		transparent: !0,
		blending: 2,
		depthWrite: !1
	})));
}
U(40, .8, -20, -8, .15, 30, 18), U(15, 2.5, 2, 6, .12, 10, 6), v.setAnimationLoop((e) => {
	b.position.x = Math.sin(e * 6e-5) * 2, b.position.y = Math.cos(e * 4e-5) * 1, b.lookAt(0, 0, -5), v.render(y, b);
});
//#endregion
