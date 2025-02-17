$(document).ready(function() {
  let correctPartsCount = 0; // Initialize a counter for correct parts
  let gulmoharPartsDropped = 0; // Counter for gulmohar parts dropped
  let score = 0; // Initialize score
  let wrongAttempts = 0; // Initialize counter for wrong attempts

  // Update the score display
  function updateScoreDisplay() {
    $('.score').text('Score: ' + score); // Update the score display
  }

  // Make parts draggable
  $('.part').draggable({
    revert: 'invalid', // Revert if not dropped in a valid droppable
    helper: 'clone', // Use a clone of the element as the helper
    start: function(event, ui) {
      $(this).css('opacity', '0.5'); // Make the original part semi-transparent
      $(this).css('z-index', 10); // Bring the dragged part to front
    },
    stop: function(event, ui) {
      $(this).css('opacity', '1'); // Reset opacity
      $(this).css('z-index', ''); // Reset z-index after dragging
    }
  });

  // Make the tree silhouette droppable
  $('#gulmohar-tree-mainimg').droppable({
    accept: '.part', // Accept only parts
    drop: function(event, ui) {
      const draggedPartId = ui.draggable.attr('id'); // Get the dragged part's ID
      const correctSound = document.getElementById('correctSound');
  const wrongSound = document.getElementById('wrongSound');
      console.log('Dragged Part ID:', draggedPartId);

      // Prevent the gulmohar-tree-mainimg from shifting position
      $(this).css('position', 'absolute'); // Change to absolute positioning

      // Check if the dragged part matches the expected ID
      if (['gulmohar-bark', 'gulmohar-leaf', 'gulmohar-fruit', 'gulmohar-flower'].includes(draggedPartId)) {
        // Play correct sound
    correctSound.play();
        showMessage(`Correct ${draggedPartId.split('-')[1].charAt(0).toUpperCase() + draggedPartId.split('-')[1].slice(1)} selected`);

        // Update score for correct part
        score += 10; 
        updateScoreDisplay(); // Update the score display

        // Instead of appending, just hide the part
        ui.draggable.hide(); // Hide the part after dropping

        gulmoharPartsDropped++; // Increment the gulmohar parts dropped

        // Reveal corresponding silhouette based on the dropped part
        if (draggedPartId === 'gulmohar-bark') {
          $('#gulmoharmain-barkimg').fadeIn(); // Reveal gulmohar bark image
        } else if (draggedPartId === 'gulmohar-leaf') {
          $('#gulmoharmain-leaveimg').fadeIn(); // Reveal gulmohar leaf image
        } else if (draggedPartId === 'gulmohar-fruit') {
          $('#gulmoharmain-fruitimg').fadeIn(); // Reveal gulmohar fruit image
        } else if (draggedPartId === 'gulmohar-flower') {
          $('#gulmoharmain-flowerimg').fadeIn(); // Reveal gulmohar flower image
        }

        // Check if four correct parts have been dropped
        if (gulmoharPartsDropped === 4) {
          revealMainImage(); // Call the function to reveal the main image
        }
      } else {
        // Play wrong sound
    wrongSound.play();
        showMessage('Please select another Part'); // For all other parts
        
        // Update score for incorrect part
        score -= 2; 
        updateScoreDisplay(); // Update the score display

        // Increment wrong attempts
        wrongAttempts++; 

        // Check if wrong attempts have reached 5
        if (wrongAttempts >= 5) {
          $('#game-over-modal').fadeIn(); // Show Game Over modal
        } else {
          ui.draggable.draggable('option', 'revert', true); // Revert the part back to its original position
        }
      }
    }
  });
//..............
$(document).on('click', '#identify-next-tree', function() {
  const totalScore = (parseInt(localStorage.getItem('totalScore')) || 0) + score;
  localStorage.setItem('totalScore', totalScore);
  window.location.href = 'raintreecontainer.html';
});
//..............
  // Restart button logic
  $(document).on('click', '.restartBtn', function() {
    location.reload(); // Reload the current page
  });

  // Quit button logic
  $(document).on('click', '.quitBtn', function() {
    window.location.href = '../index.html'; // Redirect to the index page
  });
});

// Function to display a message
function showMessage(message) {
  const messageElement = $('<div class="message"></div>').text(message);
  $('body').append(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, 2000);
}

// Function to reveal the main gulmohar image
function revealMainImage() {
  const mainImage = $('#gulmohar-tree-mainimg .main-image');
  const silhouette = $('#gulmohar-tree-mainimg .silhouette');

  // Use a fade effect to reveal the main image
  silhouette.fadeOut(1000, function() {
    mainImage.fadeIn(1000); // Fade in the main image

    // Hide or send the new images to the back
    $('#gulmoharmain-barkimg, #gulmoharmain-leaveimg, #gulmoharmain-fruitimg, #gulmoharmain-flowerimg').css('z-index', -1);

    // Show the modal with gulmohar tree information
    $('#gulmohar-info-modal').fadeIn();
  });
}

// Close the modal when the close button is clicked
$(document).on('click', '.close-button', function() {
  $('#gulmohar-info-modal').fadeOut();
});

// Close the modal when clicking outside of the modal content
$(window).on('click', function(event) {
  if ($(event.target).is('#gulmohar-info-modal')) {
    $('#gulmohar-info-modal').fadeOut();
  }
});

// Redirect to tamarindcontainer.html when the button is clicked
// $(document).on('click', '#identify-next-tree', function() {
//   const totalScore = (parseInt(localStorage.getItem('totalScore')) || 0) + score;
//   localStorage.setItem('totalScore', totalScore);
//   window.location.href = 'raintreecontainer.html'; // Redirect to the next tree
// });

// Close the Game Over modal when the close button is clicked
$(document).on('click', '#closeGameOverModal', function() {
  $('#game-over-modal').fadeOut();
});

// Play Again button logic
$(document).on('click', '#playAgainBtn', function() {
  localStorage.removeItem('totalScore');
  location.reload(); // current page reload -score == 0
  $('#game-over-modal').fadeOut();
  score = 0; // Reset score
  updateScoreDisplay(); // Update the score display
  gulmoharPartsDropped = 0; // Reset dropped parts count
  // Optionally, reset the game state here (e.g., show all parts again)
});

// Main Menu button logic
$(document).on('click', '#mainMenuBtn', function() {
  localStorage.removeItem('totalScore');
  window.location.href = '../index.html'; // Redirect to the main menu
}); 