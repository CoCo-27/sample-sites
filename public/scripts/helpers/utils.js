"use strict";
var utils = (function (){
  var obj = {};

  // This assumes array is shuffled and swaps the elements of xs into array such that array remains shuffled.
  // i.e. had the array contained xs as its starting elements, and then been shuffled, this is what you'd get.
  function shuffleInto(xs, array){
    if(xs.length > array.length) throw new Error("Target array must be at least as long as there are elements to shuffle into it.")
    // overwrite the start of array with xs

    for(let i = 0; i < xs.length; i++){
      array[i] = xs[i];
    }

    for(let i = 0; i < xs.length; i++){
      let len = array.length - i;
      let index = Math.floor(Math.random() * len);
      let temp = array[i];
      array[i] = array[index];
      array[index] = temp;
    }
  }

  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

    function percentage(x, digits) {
      return (x * 100).toFixed(digits) + "%"
    }

    function hyperGeo(N, K, n, k) {
      return (binomial(K,k)*binomial(N-K, n-k))/binomial(N,n);
    }

    function binomial(n, k) {
      if (k < 0 || k > n) return 0;
      if (k == 0 || k == n) return 1;
      var c = 1;
      if (k > n - k) k = n - k; // take advantage of symmetry
      for (var i = 0; i < k; i++) {
        c = c * (n - i) / (i + 1);
      }
      return c;
    }
  obj.percentage = percentage;
  obj.hyperGeo = hyperGeo;
  obj.binomial = binomial;
  obj.shuffle = shuffle;
  obj.shuffleInto = shuffleInto;
  return obj;
}());
