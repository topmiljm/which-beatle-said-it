export function validateUsername(username) {
  if (!username) return "Username is required";
  if (username.trim().length < 2)
    return "Username must be at least 2 characters";
  if (username.length > 20)
    return "Username cannot exceed 20 characters";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 6)
    return "Password must be at least 6 characters";
  return null;
}

export function validateLoginForm({ username, password }) {
  const errors = {};

  const u = validateUsername(username);
  const p = validatePassword(password);

  if (u) errors.username = u;
  if (p) errors.password = p;

  return errors;
}