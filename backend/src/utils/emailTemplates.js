export const baseEmailTemplate = (title, content) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f9fafb;
      padding: 40px 0;
    }
    .email-content {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .email-header {
      background-color: #4f46e5;
      padding: 32px 40px;
      text-align: center;
    }
    .email-header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .email-body {
      padding: 40px;
      color: #374151;
      font-size: 16px;
      line-height: 1.6;
    }
    .email-body h2 {
      color: #111827;
      font-size: 20px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .email-body p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .email-footer {
      background-color: #f3f4f6;
      padding: 32px 40px;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    .email-footer p {
      margin: 0 0 8px 0;
    }
    .btn {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      font-weight: 500;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .info-box {
      background-color: #f3f4f6;
      border-left: 4px solid #4f46e5;
      padding: 20px;
      border-radius: 4px;
      margin: 24px 0;
    }
    .info-box h3 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 16px;
      color: #111827;
    }
  </style>
</head>
<body>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td class="email-header">
              <h1>AI Job Board</h1>
            </td>
          </tr>
          <tr>
            <td class="email-body">
              ${content}
            </td>
          </tr>
          <tr>
            <td class="email-footer">
              <p>This email was sent because you applied for a position on AI Job Board.</p>
              <p>&copy; ${new Date().getFullYear()} AI Job Board Inc. All rights reserved.</p>
              <p style="margin-top: 16px; font-size: 11px; color: #9ca3af;">
                Please do not reply directly to this automated email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
