 // Your original validateEmail function - unchanged
 function validateEmail() {
     var email = document.getElementById("email").value;
     var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailPattern.test(email)) {
         alert("Please enter a valid email address.");
         return false;
     } else {
         // Instead of just showing alert, now we proceed to email sent form
         showEmailSentForm(email);
     }
     return false; // Prevent form submission
 }

 // New functions for the password reset flow
 function showEmailSentForm(email) {
     // Generate a random 6-digit code
     const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

     // Store the code and email for verification (in real app, this would be on server)
     window.currentResetCode = resetCode;
     window.currentEmail = email;

     // Show the code in the demo
     document.getElementById('reset-code').textContent = resetCode;

     // Hide forgot password form and show email sent form
     document.getElementById('forgot-password-form').classList.add('hidden');
     document.getElementById('email-sent-form').classList.remove('hidden');

     // Simulate sending email (in real app, this would make an API call)
     console.log(`Reset code ${resetCode} sent to ${email}`);
 }

 function validateResetCode() {
     const enteredCode = document.getElementById('reset-token').value;
     const errorDiv = document.getElementById('code-error');

     if (enteredCode === window.currentResetCode) {
         // Code is correct, show reset password form
         document.getElementById('email-sent-form').classList.add('hidden');
         document.getElementById('reset-password-form').classList.remove('hidden');
         errorDiv.classList.add('hidden');
     } else {
         // Code is incorrect, show error
         errorDiv.classList.remove('hidden');
     }

     return false; // Prevent form submission
 }

 function resetPassword() {
     const newPassword = document.getElementById('new-password').value;
     const confirmPassword = document.getElementById('confirm-password').value;
     const errorDiv = document.getElementById('password-error');

     if (newPassword !== confirmPassword) {
         errorDiv.classList.remove('hidden');
         return false;
     }

     if (newPassword.length < 6) {
         errorDiv.textContent = 'Password must be at least 6 characters long.';
         errorDiv.classList.remove('hidden');
         return false;
     }

     // Password reset successful
     // In a real app, you would send the new password to your server
     console.log(`Password reset successful for ${window.currentEmail}`);

     // Show success message
     document.getElementById('reset-password-form').classList.add('hidden');
     document.getElementById('success-form').classList.remove('hidden');

     // Clear stored data
     window.currentResetCode = null;
     window.currentEmail = null;

     return false; // Prevent form submission
 }

 function goBackToForgotPassword() {
     // Hide all forms except the original forgot password form
     document.getElementById('email-sent-form').classList.add('hidden');
     document.getElementById('reset-password-form').classList.add('hidden');
     document.getElementById('success-form').classList.add('hidden');
     document.getElementById('forgot-password-form').classList.remove('hidden');

     // Clear any error messages
     document.getElementById('code-error').classList.add('hidden');
     document.getElementById('password-error').classList.add('hidden');

     // Clear form fields
     document.getElementById('email').value = '';
     document.getElementById('reset-token').value = '';
     document.getElementById('new-password').value = '';
     document.getElementById('confirm-password').value = '';

     // Clear stored data
     window.currentResetCode = null;
     window.currentEmail = null;
 }