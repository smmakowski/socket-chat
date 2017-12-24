
console.log('We are in!');

$('#red').on('click', (event) => {
  $('body').css({'background-color': 'red'});
});

$('#green').on('click', (event) => {
  $('body').css({'background-color': 'green'});
});

$('#blue').on('click', (event) => {
  $('body').css({'background-color': 'blue'});
});
