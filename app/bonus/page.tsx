/**
 * Bonus Task - jQuery Dynamic List
 * A separate page demonstrating jQuery functionality
 * Features:
 * - Add items to a list
 * - Input validation with error messages
 * - Delete items with fade-out animation
 * - Error messages that fade out after 2 seconds
 */

export default function BonusPage() {
  return (
    <html lang="en">
      <head>
        <title>jQuery Dynamic List - Bonus Task</title>
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 2.5rem;
            animation: slideIn 0.5s ease-out;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          h1 {
            color: #667eea;
            font-size: 2rem;
            margin-bottom: 0.5rem;
            text-align: center;
          }

          .subtitle {
            color: #666;
            text-align: center;
            margin-bottom: 2rem;
            font-size: 0.95rem;
          }

          .nav-link {
            display: inline-block;
            color: #667eea;
            text-decoration: none;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            transition: color 0.2s;
          }

          .nav-link:hover {
            color: #764ba2;
          }

          .input-container {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }

          #itemInput {
            flex: 1;
            padding: 0.875rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s;
            outline: none;
          }

          #itemInput:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          #itemInput.error {
            border-color: #ef4444;
            animation: shake 0.5s;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          .btn {
            padding: 0.875rem 1.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            white-space: nowrap;
          }

          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          }

          .btn:active {
            transform: translateY(0);
          }

          .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            border-left: 4px solid #ef4444;
            animation: slideDown 0.3s ease-out;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          #itemList {
            list-style: none;
            margin-top: 1.5rem;
          }

          .list-item {
            background: #f8fafc;
            padding: 1rem 1.25rem;
            margin-bottom: 0.75rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s;
            animation: fadeIn 0.4s ease-out;
            border-left: 4px solid #667eea;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .list-item:hover {
            background: #f1f5f9;
            transform: translateX(5px);
          }

          .list-item-text {
            color: #1e293b;
            font-size: 1rem;
            flex: 1;
          }

          .delete-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
          }

          .delete-btn:hover {
            background: #dc2626;
            transform: scale(1.05);
          }

          .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #94a3b8;
          }

          .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .fade-out {
            animation: fadeOut 0.5s ease-out forwards;
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(20px);
            }
          }

          .stats {
            text-align: center;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 0.9rem;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <a href="/" className="nav-link">← Back to Kanban Dashboard</a>

          <h1>jQuery Dynamic List 📝</h1>
          <p className="subtitle">Add, manage, and delete items with smooth animations</p>

          <div id="errorContainer"></div>

          <div className="input-container">
            <input
              type="text"
              id="itemInput"
              placeholder="Enter an item to add to the list..."
            />
            <button id="addButton" className="btn">Add Item</button>
          </div>

          <ul id="itemList">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p>No items yet. Add your first item above!</p>
            </div>
          </ul>

          <div className="stats">
            Total items: <strong id="itemCount">0</strong>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          $(document).ready(function() {
            let itemCount = 0;

            // Function to show error message
            function showError(message) {
              // Remove existing error if any
              $('#errorContainer .error-message').remove();

              // Create and show new error
              const errorDiv = $('<div class="error-message"></div>').text(message);
              $('#errorContainer').append(errorDiv);

              // Fade out and remove after 2 seconds
              setTimeout(function() {
                errorDiv.fadeOut(500, function() {
                  $(this).remove();
                });
              }, 2000);
            }

            // Function to update stats
            function updateStats() {
              $('#itemCount').text(itemCount);
            }

            // Function to update empty state
            function updateEmptyState() {
              if (itemCount === 0) {
                $('#itemList').html(\`
                  <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No items yet. Add your first item above!</p>
                  </div>
                \`);
              } else {
                $('#itemList .empty-state').remove();
              }
            }

            // Function to add item
            function addItem() {
              const inputValue = $('#itemInput').val().trim();

              // Validation: check if input is empty
              if (inputValue === '') {
                $('#itemInput').addClass('error');
                showError('⚠️ Please enter an item before adding!');

                // Remove error class after animation
                setTimeout(function() {
                  $('#itemInput').removeClass('error');
                }, 500);

                return;
              }

              // Create new list item
              const listItem = $(\`
                <li class="list-item">
                  <span class="list-item-text"></span>
                  <button class="delete-btn">Delete</button>
                </li>
              \`);

              // Set text safely to prevent XSS
              listItem.find('.list-item-text').text(inputValue);

              // Append to list
              $('#itemList').append(listItem);

              // Increment count
              itemCount++;
              updateStats();
              updateEmptyState();

              // Clear input
              $('#itemInput').val('').focus();
            }

            // Add button click event
            $('#addButton').on('click', addItem);

            // Enter key press event
            $('#itemInput').on('keypress', function(e) {
              if (e.which === 13) { // Enter key
                addItem();
              }
            });

            // Delete button click event (using event delegation)
            $('#itemList').on('click', '.delete-btn', function() {
              const listItem = $(this).closest('.list-item');

              // Add fade-out class and remove after animation
              listItem.addClass('fade-out');

              setTimeout(function() {
                listItem.remove();
                itemCount--;
                updateStats();
                updateEmptyState();
              }, 500);
            });

            // Focus input on page load
            $('#itemInput').focus();
          });
        `}} />
      </body>
    </html>
  );
}
