// Validate phone: must be exactly 10 digits
const validatePhone = (phone_no) => {
  const isValid = /^\d{10}$/.test(phone_no);
  const message = isValid ? null : 'Phone number must be a valid 10-digit number';
  return { isValid, message };
};

// Validate email: basic email format check (optional field)
const validateEmail = (email_id) => {
  if (!email_id) return { isValid: true, message: null }; // Allow empty (optional)
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id);
  const message = isValid ? null : 'Invalid email address format';
  return { isValid, message };
};

module.exports = {
  validatePhone,
  validateEmail,
};
