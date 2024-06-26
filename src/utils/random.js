export function shuffle(array, seed) {
  // taken from https://stackoverflow.com/questions/16801687/javascript-random-ordering-with-seed

  // <-- ADDED ARGUMENT
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed; // <-- ADDED LINE
  }

  return array;
}

export function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function randomString(length, seed = null) {
  if (seed === null) {
    seed = Math.random();
  }

  let s = "";
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.floor(random(seed) * 26) + 97);
  }
  return s;
}
