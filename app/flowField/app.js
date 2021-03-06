var inc = 0.1;
var scl = 20;
var cols, rows;

var zoff = 0;

var fr;
var noiseSlider;
var magSlider;
var maxspeedSlider;

var particles = [];
var flowField;

function reset() {
    background(255)
}

var shouldShowArrows = false;

function showArrows() {
    shouldShowArrows = !shouldShowArrows;
    reset();
}

function setup() {
    createCanvas(600, 600);
    cols = floor(width / scl);
    rows = floor(height / scl);

    fr = createP('');
    button = createButton('reset');
    button.mousePressed(reset);

    button = createButton('arrows');
    button.mousePressed(showArrows);

    noiseSlider = createSlider(1, 4, 4, 1);
    magSlider = createSlider(0.1, 10, 0.5, 0.1);
    maxspeedSlider = createSlider(1, 20, 4, 1);
    flowField = new Array(cols * rows);

    for (var i = 0; i < 300; i++) {
        particles[i] = new Particle();
    }

    background(255)
}

function draw() {
    if(shouldShowArrows) {
        background(255)
    }

    var yoff = 0;

    for (var y = 0; y < rows; y++) {
        var xoff = 0;

        for (var x = 0; x < cols; x++) {
            var index = x + y * cols;
            var a = noise(xoff, yoff, zoff) * TWO_PI * noiseSlider.value();
            var v = p5.Vector.fromAngle(a);
            v.setMag(magSlider.value());
            flowField[index] = v;
            xoff += inc;

            if (shouldShowArrows) {
                stroke(0, 100);
                strokeWeight(1);
                push();
                translate(x * scl, y * scl);
                rotate(v.heading());
                line(0, 0, scl, 0);
                pop();   
            }
        }

        yoff += inc;

        zoff += 0.0008;        
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowField);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
    }

    fr.html(floor(frameRate()));
}

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.prev = this.pos.copy();

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(maxspeedSlider.value());
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.follow = function(vectors) {
        var x = floor(this.pos.x / scl);
        var y = floor(this.pos.y / scl);
        var index = x + y * cols;
        var force = vectors[index];
        this.applyForce(force);
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.show = function() {
        stroke(0, 50);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
        this.updatePrev();
        //point(this.pos.x, this.pos.y);
    }

    this.updatePrev = function() {
        this.prev.x = this.pos.x;
        this.prev.y = this.pos.y;
    }

    this.edges = function() {
        if(this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if(this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
        }
        if(this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
        }
        if(this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrev();
        }
    }
}