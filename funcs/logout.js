// خروج: کوکی HttpOnly فقط از سمت سرور قابل حذف است
async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch (error) {
    console.error("logout failed", error);
  }
}

export default logout;
