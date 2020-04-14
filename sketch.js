

let play = true;
let cols = 100;
let rows = 100;
let grid = [cols, rows];
let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];

function removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    let d = dist(a.i, a.j, b.i, b.j)
    // let d = abs(a.i - b.i) + abs(a.j - b.j);
    return d
}

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.25) {
        this.wall = true
    }

    this.show = function (col) {
        fill(col);
        if (this.wall) {
            fill(0)
        }
        noStroke();
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }
    this.addNeighbors = function (grid) {
        let i = this.i;
        let j = this.j;

        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j])
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j])
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1])
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1])
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1])
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1])
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1])
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1])
        }
    }
}

function setup() {

    let button = createButton("reset");
    button.position(19, 21);

    let label = createElement('label', 'height :')
    label.position(100, 5);

    input = createInput();
    input.position(100, 21);
    button.mousePressed(reset)
    console.log('setup')
    reset()
}
function reset() {
    loop()
    createCanvas(800, 800).position(10, 50);
    play = false;
    cols = 100;
    rows = 100;
    grid = [cols, rows];
    openSet = [];
    closedSet = [];
    start;
    end;
    w, h;
    path = [];

    console.log('setup')

    w = width / cols;
    h = height / rows;

    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows)
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    start.wall = false
    end.wall = false

    openSet.push(start);
}

function draw() {

    if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i
            }
        }
        current = null
        var current = openSet[winner];

        if (current === end) {
            console.log('DONE!!');
            noLoop()

        }
        removeFromArray(openSet, current);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1;
                var newPath = false

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newPath = true
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true
                    openSet.push(neighbor);
                }
                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }
    } else {
        console.log('no solution')
        noLoop()
        return

    }
    background(204)
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0))
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0))
    }
    path = [];
    let temp = current;
    path.push(temp)
    while (temp.previous) {
        path.push(temp.previous)
        temp = temp.previous;
    }

    for (let i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255))
    }
    return

}