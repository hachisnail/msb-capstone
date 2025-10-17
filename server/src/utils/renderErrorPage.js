// utils/renderErrorPage.js
export function renderErrorPage(res, status, message) {
  return res.status(status).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Error ${status}</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background-color: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            color: #374151;
          }
          .error-box {
            background: #fff;
            padding: 2rem 3rem;
            border-radius: 1rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
          h1 {
            color: #ef4444;
            margin: 0 0 0.5rem 0;
            font-size: 4rem;
          }
          p {
            font-size: 1.25rem;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="error-box">
          <h1>${status}</h1>
          <p>${message}</p>
        </div>
      </body>
    </html>
  `);
}
