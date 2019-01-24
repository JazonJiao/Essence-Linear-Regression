// In 3D scenes, notice the difference between s and g3


const Chap2Part5 = function(s) {

    let time = {
        move1: frames(3),
        move2: frames(7)
    };

    /*** 2019-01-23
     * Capable of displaying a linear transformation from R^3 to R^2
     * this.from = [0, 0, 0];
     * Responsible for calculating the arrow's landing spot based on the 2x3 matrix in global.js
     *
     */
    class Arrow_3to2 extends Arrow3D {
        constructor(ctx, args) {
            super(ctx, args);
            this.land1 = this.calcLanding();   // landing position after 3-to-2 transformation

        }

        calcLanding() {
            let m = matrix;
            let to = p5ToStd(this.to);
            // apply matrix-vector multiplication
            let x1 = m[0] * to[0] + m[1] * to[1] + m[2] * to[2];
            let x2 = m[3] * to[0] + m[4] * to[1] + m[5] * to[2];
            return [x1, x2, 0];
        }

        show(g3) {
            super.show(g3);
            if (this.s.frameCount === getT(time.move1)) {
                this.move({ to: this.land1 });
            }
        }
    }

    s.scale = function(a) {  // scaling a 3-array
        let step = 100;   // used for determining the coordinates
        return [a[0] * step, a[1] * step, a[2] * step];
    };

    let g2;
    let g3;
    let obj = [];
    s.arrows = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
    };

    s.setup = function () {
        s.frameRate(fr);

        s.pixelDensity(1);
        s.createCanvas(cvw, cvh);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);
        g2 = s.createGraphics(100, 10);

        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });

        s.axes = new Axes3D(s, {
            angle: 2,
            model: obj[0]
        });

        // i-het
        s.arrows[0] = new Arrow_3to2(s, {
            to: s.scale([1, 0, 0]),
            color: s.color([255, 147, 147]),
        });

        // j-hat
        s.arrows[1] = new Arrow_3to2(s, {
            to: s.scale([0, 1, 0]),
            color: s.color([147, 255, 147]),
        });

        // k-hat
        s.arrows[2] = new Arrow_3to2(s, {
            to: s.scale([0, 0, 1]),
            color: s.color([147, 147, 255])
        });

        // x0
        s.arrows[3] = new Arrow_3to2(s, {
            to: s.scale([matrix[0], matrix[1], matrix[2]]),
            color: s.color([237, 47, 47])
        });

        // x1
        s.arrows[4] = new Arrow_3to2(s, {
            to: s.scale([matrix[3], matrix[4], matrix[5]]),
            color: s.color([37, 147, 37]),
        });

        // y
        s.arrows[5] = new Arrow_3to2(s, {
            to: s.scale(target),
            color: s.color([27, 147, 227])
        });

        let x0l = s.arrows[3].calcLanding();
        let x1l = s.arrows[4].calcLanding();
        let yl = s.arrows[5].calcLanding();

        let inv = s.calcInv(x0l, x1l);

        s.yto = [inv[0] * yl[0] + inv[1] * yl[1], inv[2] * yl[0] + inv[3] * yl[1], 0];
        s.x0to = [inv[0] * x0l[0] + inv[1] * x0l[1], inv[2] * x0l[0] + inv[3] * x0l[1], 0];
        s.x1to = [inv[0] * x1l[0] + inv[1] * x1l[1], inv[2] * x1l[0] + inv[3] * x1l[1], 0];
    };

    s.calcInv = function(u, v) {
        let a = u[0], b = u[1], c = v[0], d = v[1];
        let det = a * d - b * c;
        console.log(u,v);
        a /= det;
        b /= det;
        c /= det;
        d /= det;
        return [d, -b, -c, a];
    };

    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        for (let a of s.arrows)
            a.show(g3);

        if (s.frameCount === getT(time.move2)) {
            s.arrows[3].move({ to: s.scale(s.x0to) });
            s.arrows[4].move({ to: s.scale(s.x1to) });
            s.arrows[5].move({ to: s.scale(s.yto) });
        }

        s.pl.showPlane(g3);

        s.image(g3, 0, 0, cvw, cvh);
        showFR(s, g2);
    };

};

let p25 = new p5(Chap2Part5);